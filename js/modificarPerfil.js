var sesion = JSON.parse(sessionStorage.getItem("sesion"));

function formulario() {
    tipoUsuario = sesion['tipo']

    if (tipoUsuario == 'admin') {
        document.getElementById('fecha-f').style.visibility = "hidden"
        document.getElementById('genero-f').style.visibility = "hidden"
        document.getElementById('especialidad-f').style.visibility = "hidden"
        document.getElementById('telefono-f').style.visibility = "hidden"

        document.getElementById('nombre').value = sesion['nombre']
        document.getElementById('apellido').value = sesion['apellido']
        document.getElementById('usuario').value = sesion['usuario']
        document.getElementById('contrasena').value = sesion['contrasena']

    } else if (tipoUsuario == 'doctor') {
        var fecha = sesion['fecha']
        var newFecha = fecha.split('/')

        document.getElementById('nombre').value = sesion['nombre']
        document.getElementById('apellido').value = sesion['apellido']
        document.getElementById('fecha').value = document.getElementById('fecha').value = newFecha[2] + '-' + newFecha[1] + '-' + newFecha[0]
        document.getElementById('usuario').value = sesion['usuario']
        document.getElementById('contrasena').value = sesion['contrasena']
        document.getElementById('especialidad').value = sesion['especialidad']
        document.getElementById('telefono').value = sesion['telefono']
    } else if (tipoUsuario == 'enfermero' || tipoUsuario == 'paciente') {

        var fecha = sesion['fecha']
        var newFecha = fecha.split('/')

        document.getElementById('especialidad-f').style.visibility = "hidden"

        document.getElementById('nombre').value = sesion['nombre']
        document.getElementById('apellido').value = sesion['apellido']
        document.getElementById('fecha').value = document.getElementById('fecha').value = newFecha[2] + '-' + newFecha[1] + '-' + newFecha[0]
        document.getElementById('usuario').value = sesion['usuario']
        document.getElementById('contrasena').value = sesion['contrasena']
        document.getElementById('telefono').value = sesion['telefono']
    }
}

function validarD() {
    oldUsuario = sesion['usuario']
    newUsuario = document.getElementById('usuario').value
    console.log(oldUsuario)
    console.log(newUsuario)
    if (oldUsuario != newUsuario) {
        fetch(`https://application-be-201906576.herokuapp.com/api/validar/${oldUsuario}/${newUsuario}`)
            .then((resp) => resp.json())
            .then(function (response) {
                console.log(response)
                if (response['res'] == 'libre') {
                    modificar(oldUsuario, newUsuario)
                    Toasty('modificar')
                } else {
                    console.log('el nombre de usuario le pertenece a otra persona')
                    Toasty('existe')
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    } else if (oldUsuario == newUsuario) {
        console.log('modificando el mismo usuario')
        modificar(oldUsuario, newUsuario)
        Toasty('modificar')
    }
}

function modificar(oldUsuario, newUsuario) {
    tipoUsuario = sesion['tipo']
    console.log(tipoUsuario)
    if (tipoUsuario == 'doctor') {
        nombre = document.getElementById('nombre').value
        apellido = document.getElementById('apellido').value
        oldFecha = document.getElementById('fecha').value
        genero = document.getElementById('genero').value
        usuario = document.getElementById('usuario').value
        contrasena = document.getElementById('contrasena').value
        especialidad = document.getElementById('especialidad').value
        telefono = document.getElementById('telefono').value
        splittedFecha = oldFecha.split('-')
        newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

        console.log(oldUsuario)
        console.log(newUsuario)

        fetch('https://application-be-201906576.herokuapp.com/api/updateDoctor', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'nombre': nombre,
                'apellido': apellido,
                'fecha': newFecha,
                'genero': genero,
                'oldUsuario': oldUsuario,
                'newUsuario': newUsuario,
                'contrasena': contrasena,
                'especialidad': especialidad,
                'telefono': telefono
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse)
            salir()
        }).catch(error => {
            console.log(error)
        })

    } else if (tipoUsuario == 'enfermero') {
        nombre = document.getElementById('nombre').value
        apellido = document.getElementById('apellido').value
        oldFecha = document.getElementById('fecha').value
        genero = document.getElementById('genero').value
        usuario = document.getElementById('usuario').value
        contrasena = document.getElementById('contrasena').value
        telefono = document.getElementById('telefono').value
        splittedFecha = oldFecha.split('-')
        newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

        fetch('https://application-be-201906576.herokuapp.com/api/updateEnfermera', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'nombre': nombre,
                'apellido': apellido,
                'fecha': newFecha,
                'genero': genero,
                'oldUsuario': oldUsuario,
                'newUsuario': newUsuario,
                'contrasena': contrasena,
                'telefono': telefono
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse)
            salir()
        }).catch(error => {
            console.log(error)
        })
    } else if (tipoUsuario == 'paciente') {
        console.log('modificando paciente')
        nombre = document.getElementById('nombre').value
        apellido = document.getElementById('apellido').value
        oldFecha = document.getElementById('fecha').value
        genero = document.getElementById('genero').value
        usuario = document.getElementById('usuario').value
        contrasena = document.getElementById('contrasena').value
        telefono = document.getElementById('telefono').value
        splittedFecha = oldFecha.split('-')
        newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

        fetch('https://application-be-201906576.herokuapp.com/api/updatePaciente', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'nombre': nombre,
                'apellido': apellido,
                'fecha': newFecha,
                'genero': genero,
                'oldUsuario': oldUsuario,
                'newUsuario': newUsuario,
                'contrasena': contrasena,
                'telefono': telefono
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse)
            salir()
        }).catch(error => {
            console.log(error)
        })
    } else if (tipoUsuario == 'admin') {
        console.log('modificando admin')
        nombre = document.getElementById('nombre').value
        apellido = document.getElementById('apellido').value
        usuario = document.getElementById('usuario').value
        contrasena = document.getElementById('contrasena').value

        fetch('https://application-be-201906576.herokuapp.com/api/updateAdmin', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'nombre': nombre,
                'apellido': apellido,
                'oldUsuario': oldUsuario,
                'newUsuario': newUsuario,
                'contrasena': contrasena,
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse)
            salir()
        }).catch(error => {
            console.log(error)
        })
    }
}

function redirigir() {
    tipoUsuario = sesion['tipo']
    if (tipoUsuario == 'enfermero') {
        document.location.href = '../html/inicioEnfermera.html'
    } else if (tipoUsuario == 'doctor') {
        document.location.href = '../html/inicioDoctor.html'
    } else if (tipoUsuario == 'admin') {
        document.location.href = '../html/inicioAdmin.html'
    } else if (tipoUsuario == 'paciente') {
        document.location.href = '../html/inicioPaciente.html'
    }
}
