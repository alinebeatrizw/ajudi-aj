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
* @param {function} [options.progresso] Callback for status for the in-progress upload
* @param {function} [options.onError] Callback if upload fails
*/
class Uploader {
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
        this.progresso = options.progresso || noop;
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

    //inicia o upload
    upload() {
        var requisicao_http = new XMLHttpRequest();

        requisicao_http.open(this.httpMethod, this.url, true); //o metodo open inicia uma nova requisiÃ§Ã£o 
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

    //envia o conteÃºdo do arquivo real.
    enviaArquivo() {
        var conteudo_arquivo = this.file;
        var tamanho_arquivo = this.file.size;


        var requisicao_http = new XMLHttpRequest();//faz uma nova requisiÃ§Ã£o
        requisicao_http.open('PUT', this.url, true);
        requisicao_http.setRequestHeader('Content-Type', this.contentType);
        requisicao_http.setRequestHeader('Content-Range', "bytes " + this.offset + "-" + (tamanho_arquivo - 1) + "/" + this.file.size);
        requisicao_http.setRequestHeader('X-Upload-Content-Type', this.file.type);
        
        //se a requisiÃ§Ã£o der certo ativa o evento de progresso
        if (requisicao_http.upload) {
            requisicao_http.upload.addEventListener('progress', this.progresso);
        }
        requisicao_http.onload = this.sucessoNoUpload.bind(this);
        requisicao_http.onerror = this.erroNoUpload.bind(this);
        requisicao_http.send(conteudo_arquivo);
    }
 

    /**
    * Sucesso no upload e invoca o callback 
    * 
    * @param {object} e requisicao_http event
    */
    sucessoNoUpload(e) {
        if (e.target.status == 200 || e.target.status == 201) {
            this.onComplete(e.target.response);
        }
    }
    /**
    * Erros no upload. 
    *
    * @private
    * @param {object} e requisicao_http event
    */
    erroNoUpload(e) {
        if (e.target.status && e.target.status < 500) {
            this.onError(e.target.response);
        }
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
    * @param {string} [id_arquivo] File ID if replacing
    * @param {object} [params] Query parameters
    * @return {string} URL
    */
    buildUrl_(id_arquivo, params, baseUrl) {
        var url = baseUrl || 'https://www.googleapis.com/upload/drive/v2/files/';
        if (id_arquivo) {
            url += id_arquivo;
        }
        var query = this.buildQuery_(params);
        if (query) {
            url += '?' + query;
        }
        return url;
    }
}