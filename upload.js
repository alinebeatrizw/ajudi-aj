
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
class MediaUploader {
    constructor(options) {
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
        this.tentativaDeUpoload = new TentativaDeUpoload();

        this.url = options.url;
        if (!this.url) {
            var params = options.params || {};
            params.uploadType = 'resumable';
            this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
        }
        this.httpMethod = options.fileId ? 'PUT' : 'POST';
    }
    /**
    * Inicia o upload.
    */
    upload() {
        var self = this;
        var requisicao_http = new XMLHttpRequest();

        requisicao_http.open(this.httpMethod, this.url, true);
        requisicao_http.setRequestHeader('Authorization', 'Bearer ' + this.token);
        requisicao_http.setRequestHeader('Content-Type', 'application/json');
        requisicao_http.setRequestHeader('X-Upload-Content-Length', this.file.size);
        requisicao_http.setRequestHeader('X-Upload-Content-Type', this.contentType);

        requisicao_http.onload = function (e) {
            if (e.target.status < 400) {
                var location = e.target.getResponseHeader('Location');
                this.url = location;
                this.enviaArquivo();
            }
            else {
                this.erroNoUpload(e);
            }
        }.bind(this);
        requisicao_http.onerror = this.erroNoUpload.bind(this);
        requisicao_http.send(JSON.stringify(this.metadata)); //converte para string para poder ser enviada para o servidor
    }
    /**
    * Envie o conteúdo do arquivo real.
    *
    * @private
    */
    enviaArquivo() {
        var content = this.file;
        var end = this.file.size;

        if (this.offset || this.chunkSize) {
            // Only bother to slice the file if we're either resuming or uploading in chunks
            if (this.chunkSize) {
                end = Math.min(this.offset + this.chunkSize, this.file.size);
            }
            content = content.slice(this.offset, end);
        }

        var requisicao_http = new XMLHttpRequest();
        requisicao_http.open('PUT', this.url, true);
        requisicao_http.setRequestHeader('Content-Type', this.contentType);
        requisicao_http.setRequestHeader('Content-Range', "bytes " + this.offset + "-" + (end - 1) + "/" + this.file.size);
        requisicao_http.setRequestHeader('X-Upload-Content-Type', this.file.type);
        if (requisicao_http.upload) {
            requisicao_http.upload.addEventListener('progress', this.onProgress);
        }
        requisicao_http.onload = this.onContentUploadSuccess_.bind(this);
        requisicao_http.onerror = this.onContentUploadError_.bind(this);
        requisicao_http.send(content);
    }
    /**
    * Query para o estado do arquivo para retomada.
    *
    * @private
    */
    resume_() {
        var requisicao_http = new XMLHttpRequest();
        requisicao_http.open('PUT', this.url, true);
        requisicao_http.setRequestHeader('Content-Range', "bytes */" + this.file.size);
        requisicao_http.setRequestHeader('X-Upload-Content-Type', this.file.type);
        if (requisicao_http.upload) {
            requisicao_http.upload.addEventListener('progress', this.onProgress);
        }
        requisicao_http.onload = this.onContentUploadSuccess_.bind(this);
        requisicao_http.onerror = this.onContentUploadError_.bind(this);
        requisicao_http.send();
    }
    /**
    * Extraia o último intervalo salvo, se disponível na solicitação.
    *
    * @param {XMLHttpRequest} requisicao_http Request object
    */
    extractRange_(requisicao_http) {
        var range = requisicao_http.getResponseHeader('Range');
        if (range) {
            this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
        }
    }
    /**
    * Lide com respostas bem-sucedidas para uploads. Dependendo do contexto,
    * pode continuar com o upload da próxima parte do arquivo ou, se concluído,
    * invoca o callback do chamador.
    *
    * @private
    * @param {object} e requisicao_http event
    */
    onContentUploadSuccess_(e) {
        if (e.target.status == 200 || e.target.status == 201) {
            this.onComplete(e.target.response);
        }
        else if (e.target.status == 308) {
            this.extractRange_(e.target);
            this.tentativaDeUpoload.reset();
            this.enviaArquivo();
        }
    }
    /**
    * Lida com erros de uploads. Ou tenta novamente ou aborta, dependendo
    * no erro.
    *
    * @private
    * @param {object} e requisicao_http event
    */
    onContentUploadError_(e) {
        if (e.target.status && e.target.status < 500) {
            this.onError(e.target.response);
        }
        else {
            this.tentativaDeUpoload.retry(this.resume_.bind(this));
        }
    }
    /**
    * Lida com erros para a solicitação inicial.
    *
    * @private
    * @param {object} e requisicao_http event
    */
   erroNoUpload(e) {
        this.onError(e.target.response); // TODO - Retries for initial upload
    }
    /**
    * Construir uma string de consulta (query) a partir de um hash / objeto
    *
    * @private
    * @param {object} [params] Key/value pairs for query string
    * @return {string} query string
    */
    buildQuery_(params) {
        params = params || {};
        return Object.keys(params).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }
    /**
    * Crie o URL de upload do drive
    *
    * @private
    * @param {string} [id] File ID if replacing
    * @param {object} [params] Query parameters
    * @return {string} URL
    */
    buildUrl_(id, params, baseUrl) {
        var url = baseUrl || 'https://www.googleapis.com/upload/drive/v2/files/';
        if (id) {
            url += id;
        }
        var query = this.buildQuery_(params);
        if (query) {
            url += '?' + query;
        }
        return url;
    }
}









