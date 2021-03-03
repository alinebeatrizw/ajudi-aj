var SCOPES = ['https://www.googleapis.com/auth/drive','profile'];
var CLIENT_ID = 'SEU_CLIENT_ID';
var NOME_PASTA = "";
var ID_PASTA = "root"; //pasta padrão para o inicio
var PERMISSAO_PASTA = true;
var LEVEL_PASTA = 0;
var NO_OF_FILES = 1000;
var ARQUIVOS_DRIVE = []; //array para os arquivos
var CONTADOR_ARQUIVO = 0;
var FOLDER_ARRAY = [];
$(function(){
	$("#botao-atualizar").click(function () {
        MostraGifCarregando();
        MostraStatus("Carregando arquivos");
        getDriveFiles();
    });
	
	$("#botao-upload").click(function () {
        $("#input-upload-file").click();
    });
});

// carrega biblioteca da api e auth2
// documentação https://developers.google.com/people/quickstart/js
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

//autorização para login
//documentação https://developers.google.com/people/quickstart/js
 function initClient() {
	gapi.client.init({
		clientId: CLIENT_ID,
		scope: SCOPES.join(' ')
	}).then(function () {
	  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
	  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}


//se a autenticação der certo, mostra os arquivos e esconde o container de login
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		$("#drive-box").show();
		$("#drive-box").css("display","inline-block");
        $("#container-login").hide();
        MostraGifCarregando();
		getDriveFiles();
//senao, mostra o container de login e mantem escondido os arquivos
	} else {
		$("#container-login").show();
        $("#drive-box").hide();
	}
}

//função chamada ao clicar no botao do google
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}



//função chamada ao clciar no botao de sair
function handleSignoutClick(event) {
	if(confirm("Tem certeza que deseja sair?")){
		var auth2 = gapi.auth2.getAuthInstance();
		
		$("#container-login").show();
        $("#drive-box").hide();
		auth2.disconnect();  //.disconnect sai mas depois nao entra mais --arrumar isso
	}}


// carrega biblioteca da api e auth2
// documentação https://developers.google.com/people/quickstart/js
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

//autorização para login
//documentação https://developers.google.com/people/quickstart/js
 function initClient() {
	gapi.client.init({
		clientId: CLIENT_ID,
		scope: SCOPES.join(' ')
	}).then(function () {
	  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
	  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}


//se a autenticação der certo, mostra os arquivos e esconde o container de login
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		$("#drive-box").show();
		$("#drive-box").css("display","inline-block");
        $("#container-login").hide();
        MostraGifCarregando();
		getDriveFiles();
//senao, mostra o container de login e mantem escondido os arquivos
	} else {
		$("#container-login").show();
        $("#drive-box").hide();
	}
}

//função chamada ao clicar no botao do google
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}



//função chamada ao clciar no botao de sair
function handleSignoutClick(event) {
	if(confirm("Tem certeza que deseja sair?")){
		var auth2 = gapi.auth2.getAuthInstance();
		
		$("#container-login").show();
        $("#drive-box").hide();
		auth2.disconnect();  
	}}
