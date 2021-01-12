//link "criar pasta"
$("#botao-criar-pasta").click(function () {
       
    $("#box-input-criar-pasta").show();
    $("#nome_pasta").val("");
});

//botao "criar" do form de criar pasta
$("#botao-criar").click(function () {
    if ($("#nome_pasta").val() == "") {
        alert("Digite o nome da pasta!");
    } else {
       
        $("#box-input-criar-pasta").hide();
        MostraGifCarregando();
        MostraStatus("Criando pasta");
        var access_token =  gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        var request = gapi.client.request({
           'path': '/drive/v2/files/',
           'method': 'POST',
           'headers': {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + access_token,             
           },
           'body':{
               "title" : $("#nome_pasta").val(),
               "mimeType" : "application/vnd.google-apps.folder",
               "parents": [{
                    "kind": "drive#file",
                    "id": ID_PASTA
                }]
           }
        });

        request.execute(function(resp) { 
           if (!resp.error) {
                MostraStatus("Carregando arquivos");
                getDriveFiles();
           }else{
                EscondeStatus();
                EscondeGifCarregando();
                MensagemErro("Erro: " + resp.error.message);
           }
        });
    }
});

$(".botao-fechar").click(function () {
    $(".box-input-criar-pasta").hide();
});



