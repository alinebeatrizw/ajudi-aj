//inicia botoes de delete, download, clicar em uma pasta e navegação no breadcrumb
function botoes(){
	//botao de delete
	//documentação do delete https://developers.google.com/drive/api/v2/reference/files/delete#javascript
    $(".botao-apagar").click(function () {
        var confirma = confirm("Tem certeza que deseja excluir?");
        if (confirma) {
            MostraGifCarregando();
            MostraStatus("Excluindo");
			var request = gapi.client.drive.files.delete({
				'fileId': $(this).attr("data-id")
			});
			request.execute(function(resp) { 
			   EscondeStatus();
			   if (resp.error) {
					MensagemErro("Erro: " + resp.error.message);
			   }
			   getDriveFiles();
			});
        }
    });
	
	//botao de downlaod
    $(".botao-download").click(function () {
        MostraGifCarregando();
        MostraStatus("Baixando arquivo");
		CONTADOR_ARQUIVO = $(this).attr("data-file-counter");
		
        setTimeout(function () {
			window.open(ARQUIVOS_DRIVE[CONTADOR_ARQUIVO].webContentLink); //webContentLink propriedade para fazer o download 
			EscondeGifCarregando();
			EscondeStatus();
		}, 1000);
    });

	
	//clicar em uma pasta
    $(".folder-icon").click(function () {
        ProcuraPasta($(this));
    });

	//navegação no breadcrumb
    $("#drive-breadcrumb a").click(function () {
        ProcuraPasta($(this));
    });
}