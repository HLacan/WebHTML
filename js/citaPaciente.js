var sesion = JSON.parse(sessionStorage.getItem("sesion"));
console.log(sesion);

function addCita() {
    fecha = document.getElementById('fecha').value
    hora = document.getElementById('hora').value
    descripcion = document.getElementById('descripcion').value
    usuario = sesion['usuario']

    if (fecha == "" || hora == "" || descripcion == "") {
        alert('vacio')
    } else {

        splittedFecha = fecha.split('-')
        newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

        fetch('http://127.0.0.1:5000/api/addCitaPaciente', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'fecha': newFecha,
                'hora': hora,
                'descripcion': descripcion,
                'usuario': usuario,
                'estado': 'pendiente'
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse);
        }).catch(error => {
            console.log(error)
        })
    }


}