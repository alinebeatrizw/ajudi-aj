//procura pasta
function ProcuraPasta(obj) {
    ID_PASTA = $(obj).attr("data-id");
    NOME_PASTA = $(obj).attr("data-name");
   LEVEL_PASTA = parseInt($(obj).attr("data-level"));
	PERMISSAO_PASTA = $(obj).attr("data-has-permission");

    if (typeof NOME_PASTA === "undefined") {
        NOME_PASTA = "";
        ID_PASTA = "root";
        LEVEL_PASTA = 0;
		PERMISSAO_PASTA = true;
        FOLDER_ARRAY = [];
    } else {
        if (LEVEL_PASTA == FOLDER_ARRAY.length && LEVEL_PASTA > 0) {
            
        } else if (LEVEL_PASTA < FOLDER_ARRAY.length) {
            var tmpArray = ClonaObj(FOLDER_ARRAY);
            FOLDER_ARRAY = [];

            for (var i = 0; i < tmpArray.length; i++) {
                FOLDER_ARRAY.push(tmpArray[i]);
                if (tmpArray[i].Level >= LEVEL_PASTA) { break; }
            }
        } else {
            var fd = {
                Name: NOME_PASTA,
                ID: ID_PASTA,
                Level: LEVEL_PASTA,
				Permission: PERMISSAO_PASTA
            }
            FOLDER_ARRAY.push(fd);
        }
    }

	//volta ao inicio ao clicar em inicio
    var sbNav = "";
    $("#span-navigation").html(sbNav.toString());

    MostraGifCarregando();
    MostraStatus("Carregando arquivos");
    getDriveFiles();
}


//função para clonar objeto
function ClonaObj(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var temp = obj.constructor(); 
    for (var key in obj) {
        temp[key] = ClonaObj(obj[key]);
    }
    return temp;
}