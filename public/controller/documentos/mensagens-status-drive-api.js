//funções de notificações com jQuery $('seletorHTML').acao();

function MostraGifCarregando() {
    if ($("#drive-box-loading").length === 0) {
        $("#drive-box").prepend("<div id='drive-box-loading'></div>");
    }
    $("#drive-box-loading").html("<div id='loading-wrapper'><div id='loading'><img src='imagens/loading-bubble.gif'></div></div>");
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

