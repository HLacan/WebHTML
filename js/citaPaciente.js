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
            if(jsonResponse['res'] == 'ya hay citas'){
                Toasty('citaP')
            } else if (jsonResponse['res'] == 'agregado'){
                Toasty('citaA')
            }
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
                            <li class="list-group-item">Fecha: ${cita.fecha}</li>
                            <li class="list-group-item">Hora: ${cita.hora}</li>
                            <li class="list-group-item">Descripcion: ${cita.descripcion}</li>
                            <li class="list-group-item" style="background-color: ${color};">Estado: ${cita.estado}</li>
                            </ul>
                        </div>
                    </div>`
                    contador = 2
                } else if (contador == 2) {
                    cards3.innerHTML += `
                    <div class="mb-3">
                        <div class="card" style="width: 18rem;">
                            <ul class="list-group list-group-flush">
                            <li class="list-group-item">Fecha: ${cita.fecha}</li>
                            <li class="list-group-item">Hora: ${cita.hora}</li>
                            <li class="list-group-item">Descripcion: ${cita.descripcion}</li>
                            <li class="list-group-item" style="background-color: ${color};">Estado: ${cita.estado}</li>
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

function getCitasPendientes(){
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getCitasPendientes')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var cita = response[i]
                htmlTable.innerHTML += `
                <tr>
                    <td>Fecha: ${cita.fecha} --- Hora: ${cita.hora} --- Descripcion ${cita.descripcion}</td>
                    <td>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#cita" onclick="selDoctor('${cita.usuario}')" type="submit">Aceptar</button>
                        <button class="btn btn-danger" onclick="rechazarEstado('rechazado','${cita.usuario}')" type="submit">Rechazar</button>
                    </td>
                </tr>`
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function selDoctor(pUsuario){

    var select = document.getElementById("doctor")
    fetch('http://127.0.0.1:5000/api/getDoctores')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("doctor").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var doctor = response[i]
                select.innerHTML += `
                    <option value="${doctor.usuario}">${doctor.nombre} ${doctor.apellido}</option>
                `
            }
        })
        .catch(function (error) {
            console.log(error);
        });

    document.getElementById('footer').innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-primary" onclick="aceptarCita('${pUsuario}')">Aceptar Cita</button>`
}

function aceptarCita(usuario){
    doctor = document.getElementById('doctor').value
    fetch('http://127.0.0.1:5000/api/updateEstado', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            'estado': 'aceptado',
            'usuario': usuario,
            'doctor': doctor
        })
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        console.log(jsonResponse);
        Toasty('aceptado')
        cerrarModal('#cita')
        getCitasPendientes()
    }).catch(error => {
        console.log(error)  
    })
}

function rechazarEstado(estado, usuario){
    fetch('http://127.0.0.1:5000/api/updateEstado', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'estado': estado,
                'usuario': usuario,
                'doctor': ''
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse);
            Toasty('rechazado')
            getCitasPendientes()
        }).catch(error => {
            console.log(error)  
        })
}

//obtener citas aceptadas en 'ENFERMERAS'
function getAllCitas(){
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getCitasAceptadas')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var cita = response[i]
                htmlTable.innerHTML += `
                <tr>
                    <td>Fecha: ${cita.fecha} --- Hora: ${cita.hora} --- Descripcion ${cita.descripcion}</td>
                    <td>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#factura" onclick="getDatos('${cita.usuario}', '${cita.doctor}')" type="submit">Facturar</button>
                    </td>
                </tr>`
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getCitasDoctor(){
    usuario = sesion['usuario']
    var comp = ''
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch(`http://127.0.0.1:5000/api/getCitasAceptadas/${usuario}`)
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var cita = response[i]
                if(cita.estado == 'completado'){
                    comp = 'disabled'
                } else {
                    comp = ''
                }
                htmlTable.innerHTML += `
                <tr>
                    <td>Fecha: ${cita.fecha} --- Hora: ${cita.hora} --- Descripcion ${cita.descripcion}</td>
                    <td class="text-center"><button id='citaC' class="btn btn-primary" onclick="completarCita('${cita.usuario}', '${cita.doctor}')" ${comp}>Completar</button></td>
                    <td>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#receta" onclick="getDatosReceta('${cita.doctor}')" type="submit">Facturar</button>
                    </td>
                </tr>`
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

function completarCita(paciente, doctor){
    fetch('http://127.0.0.1:5000/api/updateEstado', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            'estado': 'completado',
            'usuario': paciente,
            'doctor': doctor
        })
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        console.log(jsonResponse);
        //Toasty('completado')
        getCitasDoctor()
    }).catch(error => {
        console.log(error)  
    })
}

function cerrarModal(modal) {
    $(modal).modal('hide');
}

