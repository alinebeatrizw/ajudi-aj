//gapi.client.load('drive', 'v2', callback)  callbak é a função getFiles;
function getDriveFiles(){
	MostraStatus("Carregando arquivos");
    gapi.client.load('drive', 'v2', getFiles);
}

function getFiles(){
	var query = "";
		query = "trashed=false and '" + ID_PASTA + "' in parents";//poe dentro das pastas, sem isso ele n monta pastas e deixa tudo solto
    var request = gapi.client.drive.files.list({
        'maxResults': NO_OF_FILES,
        'q': query
    });

    request.execute(function (resp) {
       if (!resp.error) {
		ARQUIVOS_DRIVE = resp.items;
            ConstroiPagArquivos();
       }else{
            MensagemErro("Erro: " + resp.error.message);
       }
    });
}
// thumbnailLink = miniatura do preview
function ConstroiPagArquivos(){
	var bloco_arquivo = "";

	//verifica se tem arquivos
	//se o tamanho do array de arquivos for > 0 constroi a pagina dos arquivos que tem pra mostrar
    if (ARQUIVOS_DRIVE.length > 0) {
        for (var arquivo = 0; arquivo < ARQUIVOS_DRIVE.length; arquivo++) {
			//percorre um for pra cada arquivo
			//cada arquivo recebe seus dados (documentação google)
			ARQUIVOS_DRIVE[arquivo].textContentURL = "";
			ARQUIVOS_DRIVE[arquivo].level = (parseInt(LEVEL_PASTA) + 1).toString();
			ARQUIVOS_DRIVE[arquivo].parentID = (ARQUIVOS_DRIVE[arquivo].parents.length > 0) ? ARQUIVOS_DRIVE[arquivo].parents[0].id : "";
			ARQUIVOS_DRIVE[arquivo].thumbnailLink = ARQUIVOS_DRIVE[arquivo].thumbnailLink || '';
			ARQUIVOS_DRIVE[arquivo].fileType =  (ARQUIVOS_DRIVE[arquivo].fileExtension == null) ? "folder" : "file";
			ARQUIVOS_DRIVE[arquivo].permissionRole = ARQUIVOS_DRIVE[arquivo].userPermission.role;
			ARQUIVOS_DRIVE[arquivo].hasPermission = (ARQUIVOS_DRIVE[arquivo].permissionRole == "owner" || ARQUIVOS_DRIVE[arquivo].permissionRole == "writer");
			var textContentURL = '';

			//sem esse if os arquivos de texto se transformam em pastas
			if(ARQUIVOS_DRIVE[arquivo]['exportLinks'] != null){//exportLinks são links para exportar google docs
				ARQUIVOS_DRIVE[arquivo].fileType = "file";
				ARQUIVOS_DRIVE[arquivo].textContentURL = ARQUIVOS_DRIVE[arquivo]['exportLinks']['text/plain'];//text/plain são arquivos de texto
			}

			//titulo do arquivo
			var nome_arquivo = (ARQUIVOS_DRIVE[arquivo].fileType != "file") ? "Browse " 
			+ ARQUIVOS_DRIVE[arquivo].title : ARQUIVOS_DRIVE[arquivo].title;

			
			bloco_arquivo += "<div class='" + ARQUIVOS_DRIVE[arquivo].fileType + "-box'>";

			
			// se o drive file for diferente de um arquivo, é uma pasta, entao monta ela
			if (ARQUIVOS_DRIVE[arquivo].fileType != "file") {
				bloco_arquivo += "<div class='folder-icon' data-level='" 
				+ ARQUIVOS_DRIVE[arquivo].level + "' data-parent='" 
				+ ARQUIVOS_DRIVE[arquivo].parentID + "' data-size='" 
				+ ARQUIVOS_DRIVE[arquivo].fileSize + "' data-id='" 
				+ ARQUIVOS_DRIVE[arquivo].id + "' title='" 
				+ nome_arquivo + "' data-name='" 
				+ ARQUIVOS_DRIVE[arquivo].title + "' data-has-permission='" 
				+ARQUIVOS_DRIVE[arquivo].hasPermission 
				//pega os dados e as permições (documentação)

				//e depois coloca a imagem de pasta
				+ "'><div class='image-preview'><img src='imagens/pasta.png'/></div></div>";
			
			// se for um arquivo, pega a thumbnailLink dele e monta uma miniatura
			} else {
				if (ARQUIVOS_DRIVE[arquivo].thumbnailLink) {
					bloco_arquivo += "<div class='image-icon'><div class='image-preview'><a href='" 
					+ ARQUIVOS_DRIVE[arquivo].thumbnailLink.replace("s220", "s800") //aumenta o tamanho 
					+ "' miniatura='image-" + arquivo + "'><img src='" 
					+ ARQUIVOS_DRIVE[arquivo].thumbnailLink + "'/></a></div></div>";


			//se nao tiver preview (thumbnailLink), pega nas imagens o nome da extenção 
			//(fileExtension) + o nome "icon"
				}else {
					bloco_arquivo += "<div class='file-icon'><div class='image-preview'><img src='imagens/" 
					+ ARQUIVOS_DRIVE[arquivo].fileExtension + "-icon.png" + "'/></div></div>";
				}
			}
			//titulo do arquivo
			bloco_arquivo += "<div class='nome_arquivo '>" + ARQUIVOS_DRIVE[arquivo].title + "</div>";

			//botoes dentro da pagina de arquivos
			bloco_arquivo += "<div class='botoes-arquivo'>";
			//botao de download
			//verifica se não é uma pasta, pois nao pode fazer downlaod de pasta
				if (ARQUIVOS_DRIVE[arquivo].fileType != "folder") {
					bloco_arquivo += "<div class='botao-download' title='Download' data-id='" 
					+ ARQUIVOS_DRIVE[arquivo].id + "' data-file-counter='" + arquivo + "'></div>";
				}
				//botao de apagar
				if (ARQUIVOS_DRIVE[arquivo].hasPermission) {
					if (ARQUIVOS_DRIVE[arquivo].permissionRole == "owner") {
						bloco_arquivo += "<div class='botao-apagar' title='Apagar' data-id='" 
						+ ARQUIVOS_DRIVE[arquivo].id + "'></div>";	
					}
				}
			bloco_arquivo += "</div>";  
			bloco_arquivo += "</div>";
		}
	//se o tamanho do array de arquivos for < 0 mostra "nenhum arquivo encontrado"
    } else {
        bloco_arquivo = 'Nenhum arquivo encontrado';
	}
	
    EscondeStatus();
    $("#drive-conteudo").html(bloco_arquivo);
    botoes();
    EscondeGifCarregando();
}