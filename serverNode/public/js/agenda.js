// jquery events
function formAddEvento() {
    $("#myModal").modal({
      show: true
    });}

function modalEditEvento() {
    $("#modalEditEvento").modal({
      show: true
    });}

$( function() {
      $( ".datepicker" ).datepicker();
      $('.timepicker').timepicker({});
      $( ".draggable" ).draggable();  
      $("#resizable").resizable();
});
  
  
var data = new Date();

function renderDate() {
    data.setDate(1);
    var dia = data.getDay();
    var hoje = new Date();
    var endDate = new Date(
        data.getFullYear(),
        data.getMonth() + 1,0
        ).getDate();
  
    var prevDate = new Date(
        data.getFullYear(),
        data.getMonth(),
        0).getDate();
        var meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
            ]

    document.getElementById("mes").innerHTML = meses[data.getMonth()];
    document.getElementById("date_str").innerHTML = data.getFullYear();
              
              
    var blocoDia = "";
    for (x = dia; x > 0; x--) {
        blocoDia += "<div class='prev_date'>" + (prevDate - x + 1) + "</div>";
    }
              
    for (i = 1; i <= endDate; i++) {
        if (i == hoje.getDate() && data.getMonth() == hoje.getMonth()) blocoDia += "<div class='hoje'>" + i + "</div>";
    else
        blocoDia += "<div>" + i + "</div>";
    }
    document.getElementsByClassName("dias")[0].innerHTML = blocoDia;
    }
  
    function mudarMes(para) {
        if(para == "anterior") {
            data.setMonth(data.getMonth() - 1);
            } else if(para == 'proximo') {
                data.setMonth(data.getMonth() + 1);
            }
        renderDate();
    }