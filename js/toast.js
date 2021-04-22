
var option =
{
    animation: true,
    delay: 3000
};

function Toasty(estado) {
    if(estado == 'repetido'){
        document.getElementById('toastBody').innerHTML = 'Uno o varios Registros Repetidos'
    } else if(estado == 'noArchivo'){
        document.getElementById('toastBody').innerHTML = 'No ay archivo que cargar'
    } else if(estado == 'modificar'){
        document.getElementById('toastBody').innerHTML = 'Registro Modificado'
    } else if(estado == 'eliminar'){
        document.getElementById('toastBody').innerHTML = 'Registro Eliminado'
    } else if(estado == 'reporte'){
        document.getElementById('toastBody').innerHTML = 'Reporte Generado!'
    }


    var toastHTMLElement = document.getElementById('EpicToast');

    var toastElement = new bootstrap.Toast(toastHTMLElement, option);

    toastElement.show();
}