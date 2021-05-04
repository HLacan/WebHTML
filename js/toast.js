
var option =
{
    animation: true,
    delay: 3000
};

function Toasty(estado) {
    toast = document.getElementById('toastBody')
    if (estado == 'repetido') {
        toast.innerHTML = 'Uno o varios Registros Repetidos'
    } else if (estado == 'noArchivo') {
        toast.innerHTML = 'No ay archivo que cargar'
    } else if (estado == 'modificar') {
        toast.innerHTML = 'Registro Modificado'
    } else if (estado == 'eliminar') {
        toast.innerHTML = 'Registro Eliminado'
    } else if (estado == 'reporte') {
        toast.innerHTML = 'Reporte Generado!'
    } else if (estado == 'existe') {
        toast.innerHTML = 'El usuario ya existe!'
    } else if (estado == 'citaA') {
        toast.innerHTML = 'Cita Agregada!'
    } else if (estado == 'citaP') {
        toast.innerHTML = 'Ya hay una cita Pendiente!'
    } else if (estado == 'aceptado') {
        toast.innerHTML = 'Cita Aceptada!'
    } else if (estado == 'rechazado') {
        toast.innerHTML = 'Cita Rechazada!'
    } else if (estado == 'agregado') {
        toast.innerHTML = 'PacienteAgregado!'
    } else if (estado == 'no existe') {
        toast.innerHTML = 'usuario o contrasena incorrectos!'
    }


    var toastHTMLElement = document.getElementById('EpicToast');

    var toastElement = new bootstrap.Toast(toastHTMLElement, option);

    toastElement.show();
}