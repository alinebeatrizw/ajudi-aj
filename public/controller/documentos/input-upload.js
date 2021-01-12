$("#input-upload-file").bind("change", function () {
    var uploadObj = $("[id$=input-upload-file]");
    MostraGifCarregando();
    MostraStatus("Fazendo upload");
    var file = uploadObj.prop("files")[0];
    var metadata = {
        'title': file.name,
        'description': "bytutorial.com File Upload",
        'mimeType': file.type || 'application/octet-stream',
        "parents": [{
            "kind": "drive#file",
            "id": ID_PASTA
        }]
    };
    
    
    if(file.size <= 0){
        var emptyContent = " ";
        file = new Blob([emptyContent], {type: file.type || 'application/octet-stream'});
    }
    
    PorcentagemCarregamento(0);

    try{
        var uploader =new Uploader({
            file: file,
            token: gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token,
            metadata: metadata,
            onError: function(response){
                var errorResponse = JSON.parse(response);
                MensagemErro("Erro: " + errorResponse.error.message);
                $("#input-upload-file").val("");
                $("#upload-percentage").hide(1000);
                getDriveFiles();
            },
            onComplete: function(response){
                EscondeStatus();
                $("#upload-percentage").hide(1000);
                var errorResponse = JSON.parse(response);
                if(errorResponse.message != null){
                    MensagemErro("Erro: " + errorResponse.error.message);
                    $("#input-upload-file").val("");
                    getDriveFiles();
                }else{
                    MostraStatus("Carregando arquivos");
                    getDriveFiles();
                }
            },
            progresso: function(event) {
                PorcentagemCarregamento(Math.round(((event.loaded/event.total)*100), 0));
            },
            params: {
                convert:false,
                ocr: false
            }
        });
        uploader.upload();
    }catch(exc){
        MensagemErro("Erro: " + exc);
        $("#input-upload-file").val("");
        getDriveFiles();
    }
});