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

function getCitasPaciente() {

    color = ''
    usuario = sesion['usuario']
    var cards1 = document.getElementById("cards1")
    var cards2 = document.getElementById("cards2")
    var cards3 = document.getElementById("cards3")
    fetch(`http://127.0.0.1:5000/api/getCitasPaciente/${usuario}`)
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cards1").innerHTML = "";
            document.getElementById("cards2").innerHTML = "";
            document.getElementById("cards3").innerHTML = "";
            contador = 0
            for (var i = 0; i < response.length; i++) {
                var cita = response[i]

                if (cita.estado == 'pendiente') {
                    color = 'rgb(1240, 213, 0)'
                } else if (cita.estado == 'aceptado') {
                    color = 'rgb(12, 191, 243)'
                } else if (cita.estado == 'completado') {
                    color = 'rgb(152, 243, 114)'
                } else if (cita.estado == 'rechazado') {
                    color = 'rgb(243, 104, 104)'
                }


                if (contador == 0) {
                    cards1.innerHTML += `
                    <div class="card" style="width: 18rem;">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Fecha: ${cita.fecha}</li>
                            <li class="list-group-item">Hora: ${cita.hora}</li>
                            <li class="list-group-item">Descripcion: ${cita.descripcion}</li>
                            <li class="list-group-item" style="background-color: ${color};">Estado: ${cita.estado}</li>
                        </ul>
                    </div>`
                    contador = 1
                } else if (contador == 1) {
                    cards2.innerHTML += `
                    <div class="mb-3">
                        <div class="card" style="width: 18rem;">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">An item</li>
                                <li class="list-group-item">A second item</li>
                                <li class="list-group-item">A third item</li>
                            </ul>
                        </div>
                    </div>`
                    contador = 2
                } else if (contador == 2) {
                    cards3.innerHTML += `
                    <div class="mb-3">
                        <div class="card" style="width: 18rem;">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">An item</li>
                                <li class="list-group-item">A second item</li>
                                <li class="list-group-item">A third item</li>
                            </ul>
                        </div>
                    </div>`
                    contador = 0
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}