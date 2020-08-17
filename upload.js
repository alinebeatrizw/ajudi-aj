﻿/**
* Helper for implementing retries with backoff. Initial retry
* delay is 1 second, increasing by 2x (+jitter) for subsequent retries
*
* @constructor
*/
var RetryHandler = function () {
    this.interval = 1000; // Start at one second
    this.maxInterval = 60 * 1000; // Don't wait longer than a minute 
};

/**
* 
Chame a função depois de esperar
*
* @param {function} fn Função para invocar
*/
RetryHandler.prototype.retry = function (fn) {
    setTimeout(fn, this.interval);
    this.interval = this.nextInterval_();
};

/**
* Reinicie o contador (por exemplo, após uma solicitação bem-sucedida).
*/
RetryHandler.prototype.reset = function () {
    this.interval = 1000;
};

/**
* Calcule o próximo tempo de espera.
* @return {number} Próximo intervalo de espera, em milissegundos
*
* @private
*/
RetryHandler.prototype.nextInterval_ = function () {
    var interval = this.interval * 2 + this.getRandomInt_(0, 1000);
    return Math.min(interval, this.maxInterval);
};

/**
* Obtenha um int aleatório no intervalo de mín. A máx. Usado para adicionar jitter aos tempos de espera.
*
* @param {number} min Lower bounds
* @param {number} max Upper bounds
* @private
*/
RetryHandler.prototype.getRandomInt_ = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};


/***
*
* @constructor
* @param {object} options Hash of options
* @param {string} options.token Access token
* @param {blob} options.file Blob-like item to upload
* @param {string} [options.fileId] ID of file if replacing
* @param {object} [options.params] Additional query parameters
* @param {string} [options.contentType] Content-type, if overriding the type of the blob.
* @param {object} [options.metadata] File metadata
* @param {function} [options.onComplete] Callback for when upload is complete
* @param {function} [options.onProgress] Callback for status for the in-progress upload
* @param {function} [options.onError] Callback if upload fails
*/
var MediaUploader = function (options) {
    var noop = function () { };
    this.file = options.file;
    this.contentType = options.contentType || this.file.type || 'application/octet-stream';
    this.metadata = options.metadata || {
        'title': this.file.name,
        'mimeType': this.contentType
    };
    this.token = options.token;
    this.onComplete = options.onComplete || noop;
    this.onProgress = options.onProgress || noop;
    this.onError = options.onError || noop;
    this.offset = options.offset || 0;
    this.chunkSize = options.chunkSize || 0;
    this.retryHandler = new RetryHandler();

    this.url = options.url;
    if (!this.url) {
        var params = options.params || {};
        params.uploadType = 'resumable';
        this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
    }
    this.httpMethod = options.fileId ? 'PUT' : 'POST';
};

/**
* Inicie o upload.
*/
MediaUploader.prototype.upload = function () {
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.open(this.httpMethod, this.url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Upload-Content-Length', this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.contentType);

    xhr.onload = function (e) {
        if (e.target.status < 400) {
            var location = e.target.getResponseHeader('Location');
            this.url = location;
            this.sendFile_();
        } else {
            this.onUploadError_(e);
        }
    } .bind(this);
    xhr.onerror = this.onUploadError_.bind(this);
    xhr.send(JSON.stringify(this.metadata));
};

/**
* Envie o conteúdo do arquivo real.
*
* @private
*/
MediaUploader.prototype.sendFile_ = function () {
    var content = this.file;
    var end = this.file.size;

    if (this.offset || this.chunkSize) {
        // Only bother to slice the file if we're either resuming or uploading in chunks
        if (this.chunkSize) {
            end = Math.min(this.offset + this.chunkSize, this.file.size);
        }
        content = content.slice(this.offset, end);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.url, true);
    xhr.setRequestHeader('Content-Type', this.contentType);
    xhr.setRequestHeader('Content-Range', "bytes " + this.offset + "-" + (end - 1) + "/" + this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
    if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send(content);
};

/**
* Query para o estado do arquivo para retomada.
*
* @private
*/
MediaUploader.prototype.resume_ = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.url, true);
    xhr.setRequestHeader('Content-Range', "bytes */" + this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
    if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send();
};

/**
* Extraia o último intervalo salvo, se disponível na solicitação.
*
* @param {XMLHttpRequest} xhr Request object
*/
MediaUploader.prototype.extractRange_ = function (xhr) {
    var range = xhr.getResponseHeader('Range');
    if (range) {
        this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
    }
};

/**
* Lide com respostas bem-sucedidas para uploads. Dependendo do contexto,
* pode continuar com o upload da próxima parte do arquivo ou, se concluído,
* invoca o callback do chamador.
*
* @private
* @param {object} e XHR event
*/
MediaUploader.prototype.onContentUploadSuccess_ = function (e) {
    if (e.target.status == 200 || e.target.status == 201) {
        this.onComplete(e.target.response);
    } else if (e.target.status == 308) {
        this.extractRange_(e.target);
        this.retryHandler.reset();
        this.sendFile_();
    }
};

/**
* Lida com erros de uploads. Ou tenta novamente ou aborta, dependendo
* no erro.
*
* @private
* @param {object} e XHR event
*/
MediaUploader.prototype.onContentUploadError_ = function (e) {
    if (e.target.status && e.target.status < 500) {
        this.onError(e.target.response);
    } else {
        this.retryHandler.retry(this.resume_.bind(this));
    }
};

/**
* Lida com erros para a solicitação inicial.
*
* @private
* @param {object} e XHR event
*/
MediaUploader.prototype.onUploadError_ = function (e) {
    this.onError(e.target.response); // TODO - Retries for initial upload
};

/**
* Construir uma string de consulta (query) a partir de um hash / objeto
*
* @private
* @param {object} [params] Key/value pairs for query string
* @return {string} query string
*/
MediaUploader.prototype.buildQuery_ = function (params) {
    params = params || {};
    return Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
};

/**
* Crie o URL de upload do drive
*
* @private
* @param {string} [id] File ID if replacing
* @param {object} [params] Query parameters
* @return {string} URL
*/
MediaUploader.prototype.buildUrl_ = function (id, params, baseUrl) {
    var url = baseUrl || 'https://www.googleapis.com/upload/drive/v2/files/';
    if (id) {
        url += id;
    }
    var query = this.buildQuery_(params);
    if (query) {
        url += '?' + query;
    }
    return url;
};