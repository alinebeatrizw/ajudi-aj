
var SCOPES = ['https://www.googleapis.com/auth/drive','profile'];
var CLIENT_ID = '200457364652-4a8r3irh3p4gktel1nhtubr59ngo9dak.apps.googleusercontent.com';
var NOME_PASTA = "";
var ID_PASTA = "root"; //pasta padrão para o inicio
var FOLDER_PERMISSION = true;
var FOLDER_LEVEL = 0;
var NO_OF_FILES = 1000;
var ARQUIVOS_DRIVE = []; //array para os arquivos
var FILE_COUNTER = 0;
var FOLDER_ARRAY = [];


// carrega biblioteca da api e auth2
// documentação https://developers.google.com/people/quickstart/js
 function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

//autorização
 function initClient() {
	gapi.client.init({
		clientId: CLIENT_ID,
		scope: SCOPES.join(' ')
	}).then(function () {
	  // Listen for sign-in state changes.
	  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
	  // Handle the initial sign-in state.
	  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}


//check the return authentication of the login is successful, we display the drive box and hide the login box.
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		$("#drive-box").show();
		$("#drive-box").css("display","inline-block");
        $("#container-login").hide();
        MostraGifCarregando();
        getDriveFiles();
	} else {
		$("#container-login").show();
        $("#drive-box").hide();
	}
}



function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}





function handleSignoutClick(event) {
	if(confirm("Tem certeza que deseja sair?")){
		var auth2 = gapi.auth2.getAuthInstance();
		
		$("#container-login").show();
        $("#drive-box").hide();
		auth2.disconnect();  //.disconnect funcionoouuuuu amem
	}}
		//auth2.disconnect();
		//gapi.auth2.getAuthInstance().signOut();
		
		//location.href = 'https://accounts.google.com/Logout?&continue'; //esse location funcionou
			//gambiarra para retornar ao box de login arrumar com sessoes
			//se usar essa gambiarra, o botao de longin nao funciona, no caso do login box nao da hide()
		
	
	
/******************** PAGE LOAD ********************/
$(function(){
	$("#button-reload").click(function () {
        MostraGifCarregando();
        MostraStatus("Carregando arquivos");
        getDriveFiles();
    });
	
	$("#button-upload").click(function () {
        $("#fUpload").click();
    });
	
	 $("#fUpload").bind("change", function () {
        var uploadObj = $("[id$=fUpload]");
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
		
		//if user upload an empty content, create a temp blob with a space content on it.
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
					$("#fUpload").val("");
					$("#upload-percentage").hide(1000);
					getDriveFiles();
				},
				onComplete: function(response){
					EscondeStatus();
					$("#upload-percentage").hide(1000);
					var errorResponse = JSON.parse(response);
					if(errorResponse.message != null){
						MensagemErro("Erro: " + errorResponse.error.message);
						$("#fUpload").val("");
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
			$("#fUpload").val("");
			getDriveFiles();
		}
    });
	
	
	$("#button-addfolder").click(function () {
        $("#transparent-wrapper").show();
        $("#float-box").show();
        $("#nome_pasta").val("");
    });
	
	$("#btn_CriarPasta").click(function () {
        if ($("#nome_pasta").val() == "") {
            alert("Please enter the folder name");
        } else {
            $("#transparent-wrapper").hide();
            $("#float-box").hide();
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
	
	$(".btn_fechar, .imgClose").click(function () {
        $("#transparent-wrapper").hide();
        $(".float-box").hide();
    });
});

/******************** END PAGE LOAD ********************/

/******************** DRIVER API ********************/
function getDriveFiles(){
	MostraStatus("Carregando arquivos");
    gapi.client.load('drive', 'v2', getFiles);
}

function getFiles(){
	var query = "";
		$(".button-opt").show();
		query = "trashed=false and '" + ID_PASTA + "' in parents";
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
	//se o tamanho do array de arquivos for > 0 constroi a pagina dos arquivos que tem pra mostrar
    if (ARQUIVOS_DRIVE.length > 0) {
        for (var arquivo = 0; arquivo < ARQUIVOS_DRIVE.length; arquivo++) {
			ARQUIVOS_DRIVE[arquivo].textContentURL = "";
			ARQUIVOS_DRIVE[arquivo].level = (parseInt(FOLDER_LEVEL) + 1).toString();
			ARQUIVOS_DRIVE[arquivo].parentID = (ARQUIVOS_DRIVE[arquivo].parents.length > 0) ? ARQUIVOS_DRIVE[arquivo].parents[0].id : "";
			ARQUIVOS_DRIVE[arquivo].thumbnailLink = ARQUIVOS_DRIVE[arquivo].thumbnailLink || '';
			ARQUIVOS_DRIVE[arquivo].fileType =  (ARQUIVOS_DRIVE[arquivo].fileExtension == null) ? "folder" : "file";
			ARQUIVOS_DRIVE[arquivo].permissionRole = ARQUIVOS_DRIVE[arquivo].userPermission.role;
			ARQUIVOS_DRIVE[arquivo].hasPermission = (ARQUIVOS_DRIVE[arquivo].permissionRole == "owner" || ARQUIVOS_DRIVE[arquivo].permissionRole == "writer");
			var textContentURL = '';

			if(ARQUIVOS_DRIVE[arquivo]['exportLinks'] != null){
				ARQUIVOS_DRIVE[arquivo].fileType = "file";
				ARQUIVOS_DRIVE[arquivo].textContentURL = ARQUIVOS_DRIVE[arquivo]['exportLinks']['text/plain'];
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
				+ "'><div class='image-preview'><img src='images/folder.png'/></div></div>";
			
			// se for um arquivo, pega o thumbnailLink dele e monta uma miniatura
			} else {
				if (ARQUIVOS_DRIVE[arquivo].thumbnailLink) {
					bloco_arquivo += "<div class='image-icon'><div class='image-preview'><a href='" 
					+ ARQUIVOS_DRIVE[arquivo].thumbnailLink.replace("s220", "s800") 
					+ "' data-lightbox='image-" + arquivo + "'><img src='"  //o data-lightbox ativa a biblioteca do lightbox para as imagens
					+ ARQUIVOS_DRIVE[arquivo].thumbnailLink + "'/></a></div></div>";


			//se nao tiver preview (thumbnailLink), pega nas imagens o nome da extenção 
			//(fileExtension) + o nome "icon"
				}else {
					bloco_arquivo += "<div class='file-icon'><div class='image-preview'><img src='images/" 
					+ ARQUIVOS_DRIVE[arquivo].fileExtension + "-icon.png" + "'/></div></div>";
				}
			}
			//titulo do arquivo
			bloco_arquivo += "<div class='nome_arquivo '>" + ARQUIVOS_DRIVE[arquivo].title + "</div>";

			//botoes dentro da pagina de arquivos
			bloco_arquivo += "<div class='button-box'>";
			//botao de download
			//verifica se não é uma pasta, pois nao pode fazer downlaod de pasta
				if (ARQUIVOS_DRIVE[arquivo].fileType != "folder") {
					bloco_arquivo += "<div class='button-download' title='Download' data-id='" 
					+ ARQUIVOS_DRIVE[arquivo].id + "' data-file-counter='" + arquivo + "'></div>";
				}
				//botao de apagar
				if (ARQUIVOS_DRIVE[arquivo].hasPermission) {
					if (ARQUIVOS_DRIVE[arquivo].permissionRole == "owner") {
						bloco_arquivo += "<div class='button-delete' title='Apagar' data-id='" 
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
    $("#drive-content").html(bloco_arquivo);
    IniciaBotoes();
    EscondeGifCarregando();
}

//inicia botoes de delete, download, clicar em uma pasta e navegação no breadcrumb
function IniciaBotoes(){
	//botao de delete
	//documentação do delete https://developers.google.com/drive/api/v2/reference/files/delete#javascript
	$(".button-delete").unbind("click");
    $(".button-delete").click(function () {
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
	$(".button-download").unbind("click");
    $(".button-download").click(function () {
        MostraGifCarregando();
        MostraStatus("Baixando arquivo");
		FILE_COUNTER = $(this).attr("data-file-counter");
		
        setTimeout(function () {

			window.open(ARQUIVOS_DRIVE[FILE_COUNTER].webContentLink); //webContentLink propriedade para fazer o download 

			EscondeGifCarregando();
			EscondeStatus();
		}, 1000);
    });


	
	//clicar em uma pasta
	$(".folder-icon").unbind("click");
    $(".folder-icon").click(function () {
        browseFolder($(this));
    });

	//navegação no breadcrumb
    $("#drive-breadcrumb a").unbind("click");
    $("#drive-breadcrumb a").click(function () {
        browseFolder($(this));
    });
}


//browse folder
function browseFolder(obj) {
    ID_PASTA = $(obj).attr("data-id");
    NOME_PASTA = $(obj).attr("data-name");
    FOLDER_LEVEL = parseInt($(obj).attr("data-level"));
	FOLDER_PERMISSION = $(obj).attr("data-has-permission");

    if (typeof NOME_PASTA === "undefined") {
        NOME_PASTA = "";
        ID_PASTA = "root";
        FOLDER_LEVEL = 0;
		FOLDER_PERMISSION = true;
        FOLDER_ARRAY = [];
    } else {
        if (FOLDER_LEVEL == FOLDER_ARRAY.length && FOLDER_LEVEL > 0) {
            //do nothing
        } else if (FOLDER_LEVEL < FOLDER_ARRAY.length) {
            var tmpArray = cloneObject(FOLDER_ARRAY);
            FOLDER_ARRAY = [];

            for (var i = 0; i < tmpArray.length; i++) {
                FOLDER_ARRAY.push(tmpArray[i]);
                if (tmpArray[i].Level >= FOLDER_LEVEL) { break; }
            }
        } else {
            var fd = {
                Name: NOME_PASTA,
                ID: ID_PASTA,
                Level: FOLDER_LEVEL,
				Permission: FOLDER_PERMISSION
            }
            FOLDER_ARRAY.push(fd);
        }
    }

	//add a pasta no breadcrumb
    var sbNav = "";
    for (var i = 0; i < FOLDER_ARRAY.length; i++) {
        sbNav +="<span class='breadcrumb-arrow'></span>";
        sbNav +="<span class='folder-name'><a data-id='" + FOLDER_ARRAY[i].ID + "' data-level='" + FOLDER_ARRAY[i].Level + "' data-name='" + FOLDER_ARRAY[i].Name + "' data-has-permission='" + FOLDER_PERMISSION + "'>" + FOLDER_ARRAY[i].Name + "</a></span>";
    }
    $("#span-navigation").html(sbNav.toString());

    MostraGifCarregando();
    MostraStatus("Carregando arquivos");
    getDriveFiles();
}


//function to clone an object
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var temp = obj.constructor(); 
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
    return temp;
}


//funções de notificações 

function MostraGifCarregando() {
    if ($("#drive-box-loading").length === 0) {
        $("#drive-box").prepend("<div id='drive-box-loading'></div>");
    }
    $("#drive-box-loading").html("<div id='loading-wrapper'><div id='loading'><img src='images/loading-bubble.gif'></div></div>");
}

function EscondeGifCarregando() {
    $("#drive-box-loading").html("");
}

function MostraStatus(text) {
    $("#status-message").show();
    $("#status-message").html(text);
}

function EscondeStatus() {
    $("#status-message").hide();
    $("#status-message").html("");
}

function PorcentagemCarregamento(percentageValue) {
    if ($("#upload-percentage").length == 0) {
        $("#drive-box").prepend("<div id='upload-percentage' class='flash'></div>");
    }
    if (!$("#upload-percentage").is(":visible")) {
        $("#upload-percentage").show(1000);
    }
    $("#upload-percentage").html(percentageValue.toString() + "%");
}

function MensagemErro(errorMessage) {
    $("#error-message").html(errorMessage);
    $("#error-message").show(100);
    setTimeout(function () {
        $("#error-message").hide(100);
    }, 3000);
}

