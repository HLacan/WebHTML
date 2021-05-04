function getPacientes() {
    var listaPacientes = []
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getPacientes')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var paciente = response[i]
                var filaPaciente = [paciente.nombre, paciente.apellido, paciente.fecha, paciente.genero, paciente.usuario, paciente.contrasena, paciente.telefono]
                htmlTable.innerHTML += `
                <tr>
                    <td>${paciente.nombre}</td>
                    <td>${paciente.apellido}</td>
                    <td>${paciente.fecha}</td>
                    <td>${paciente.genero}</td>
                    <td>${paciente.usuario}</td>
                    <td>${paciente.contrasena}</td>
                    <td>${paciente.telefono}</td>
                    <td>
                        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modificar" onclick="getPaciente('${paciente.usuario}')" type="submit"><i class="fa fa-pencil" style="font-size:15px; color:white;"></i></button>
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminar" onclick="opcionesDelete('${paciente.usuario}')" type="submit"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`
                listaPacientes.push(filaPaciente)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cargarPacientes() {
    var input = document.getElementById('fileinput');
    if (!input.files[0]) {
        Toasty('noArchivo')
    } else {
        var file = input.files[0];
        console.log(file)

        var reader = new FileReader();

        reader.onload = function (progressEvent) {
            var linea = this.result.split('\n');
            for (var i = 1; i < linea.length - 1; i++) {
                info = linea[i].split(',');

                fetch('http://127.0.0.1:5000/api/addPaciente', {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        'nombre': info[0],
                        'apellido': info[1],
                        'fecha': info[2],
                        'genero': info[3],
                        'usuario': info[4],
                        'contrasena': info[5],
                        'telefono': info[6]
                    })
                }).then(response => {
                    return response.json();

                }).then(jsonResponse => {
                    console.log(jsonResponse);
                    document.getElementById('fileinput').value = "";
                    if (jsonResponse['res'] == 'Usuario ya repetido') {
                        Toasty('repetido')
                    }
                    getPacientes();
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        reader.readAsText(file);
    }
}

function pdfPacientes() {
    window.jsPDF = window.jspdf.jsPDF
    const pdf = new jsPDF();

    fetch('http://127.0.0.1:5000/api/getPacientes')
        .then(function (response) {
            if (response.status !== 200) {
                console.log('hubo un problema' + response.status);
                return;
            } else {
                response.json().then(function (data) {
                    const lista = []
                    for (var i = 0; i < data.length; i++) {
                        var paciente = data[i]
                        var dataPaciente = {
                            'nombre': paciente.nombre,
                            'apellido': paciente.apellido,
                            'fecha': paciente.fecha,
                            'genero': paciente.genero,
                            'usuario': paciente.usuario,
                            'contrasena': paciente.contrasena,
                            'telefono': paciente.telefono
                        }
                        lista.push(dataPaciente)
                    }
                    console.log("mi lista" + JSON.stringify(lista))

                    const columnas = [['Nombre', 'Apellido', 'Fecha', 'Genero', 'Usuario', 'Contrasena', 'Telefono']];
                    const filas = [];

                    lista.forEach(i => {
                        const temp = [i.nombre, i.apellido, i.fecha, i.genero, i.usuario, i.contrasena, i.telefono];
                        filas.push(temp);
                    });

                    pdf.text('Listado de Pacientes', 80, 10,)
                    pdf.autoTable({
                        head: columnas,
                        body: filas,
                    });
                    pdf.save('Listado_Pacientes.pdf');
                    Toasty('reporte')
                });
            }
        }
        )
        .catch(function (err) {
            console.log('Fetch Error :(', err);
        });















}

function getPaciente(usuario) {
    selectIndice = 0
    fetch(`http://127.0.0.1:5000/api/getPaciente/${usuario}`)
        .then((resp) => resp.json(
        )).then(function (response) {
            if (response.genero == 'M') {
                selectIndice = 0
            } else if (response.genero == 'F') {
                selectIndice = 1
            }

            console.log(response)
            var fecha = (response.fecha)
            var newFecha = fecha.split('/')
            document.getElementById('nombre').value = response.nombre
            document.getElementById('apellido').value = response.apellido
            document.getElementById('fecha').value = newFecha[2] + '-' + newFecha[1] + '-' + newFecha[0]
            document.getElementById('genero').selectedIndex = selectIndice
            document.getElementById('usuario').value = response.usuario
            document.getElementById('contrasena').value = response.contrasena
            document.getElementById('telefono').value = response.telefono
            document.getElementById('footerModal').innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="validarPaciente('${response.usuario}')">Modificar</button>`
        }).catch(function (error) {
            console.log(error);
        });
}

function validarPaciente(oldUsuario) {
    newUsuario = document.getElementById('usuario').value
    if (oldUsuario != newUsuario) {
        fetch(`http://127.0.0.1:5000/api/validar/${oldUsuario}/${newUsuario}`)
            .then((resp) => resp.json())
            .then(function (response) {
                console.log(response)
                if (response['res'] == 'libre') {
                    updatePaciente(oldUsuario, newUsuario)
                    cerrarModal('#modificar')
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
        updatePaciente(oldUsuario, newUsuario)
        cerrarModal('#modificar')
        Toasty('modificar')
    }
}

function updatePaciente(oldUsuario, newUsuario) {
    nombre = document.getElementById('nombre').value
    apellido = document.getElementById('apellido').value
    oldFecha = document.getElementById('fecha').value
    genero = document.getElementById('genero').value
    contrasena = document.getElementById('contrasena').value
    telefono = document.getElementById('telefono').value
    splittedFecha = oldFecha.split('-')
    newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

    fetch('http://127.0.0.1:5000/api/updatePaciente', {
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
        getPacientes()
    }).catch(error => {
        console.log(error)
    })
}

function opcionesDelete(usuario) {
    document.getElementById('eliminarFooter').innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-primary" onclick="deletePaciente('${usuario}')">Eliminar</button>`
}

function deletePaciente(usuario) {
    fetch(`http://127.0.0.1:5000/api/deletePaciente/${usuario}`)
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            cerrarModal('#eliminar')
            Toasty('eliminar')
            getPacientes()
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cerrarModal(modal) {
    $(modal).modal('hide');
}

getPacientes()