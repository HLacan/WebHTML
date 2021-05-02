function pdfDoctores() {
    window.jsPDF = window.jspdf.jsPDF
    const pdf = new jsPDF();

    fetch('http://127.0.0.1:5000/api/getDoctores')
        .then(function (response) {
            if (response.status !== 200) {
                console.log('hubo un problema' + response.status);
                return;
            } else {
                response.json().then(function (data) {
                    const lista = []
                    for (var i = 0; i < data.length; i++) {
                        var doctor = data[i]
                        var dataDoctor = {
                            'nombre': doctor.nombre,
                            'apellido': doctor.apellido,
                            'fecha': doctor.fecha,
                            'genero': doctor.genero,
                            'usuario': doctor.usuario,
                            'contrasena': doctor.contrasena,
                            'especialidad': doctor.especialidad,
                            'telefono': doctor.telefono
                        }
                        lista.push(dataDoctor)
                    }
                    console.log("mi lista" + JSON.stringify(lista))

                    const header = [['Nombre', 'Apellido', 'Fecha', 'Genero', 'Usuario', 'Contrasena', 'Especialidad', 'Telefono']];
                    const rows = [];

                    lista.forEach(elm => {
                        const temp = [elm.nombre, elm.apellido, elm.fecha, elm.genero, elm.usuario, elm.contrasena, elm.especialidad, elm.telefono];
                        rows.push(temp);
                    });

                    pdf.text('Listado de Doctores', 80, 10,)
                    pdf.autoTable({
                        head: header,
                        body: rows,
                    });
                    pdf.save('ListadoDoctores.pdf');
                    Toasty('reporte')
                });
            }
        }
        )
        .catch(function (err) {
            console.log('Fetch Error :(', err);
        });















}

function getDoctores() {
    var listaDoctor = []
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getDoctores')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var doctor = response[i]
                var filaDoctor = [doctor.nombre, doctor.apellido, doctor.fecha, doctor.genero, doctor.usuario, doctor.contrasena, doctor.especialidad, doctor.telefono]
                var user = JSON.stringify(doctor.usuario)
                htmlTable.innerHTML += `
                <tr>
                    <td>${doctor.nombre}</td>
                    <td>${doctor.apellido}</td>
                    <td>${doctor.fecha}</td>
                    <td>${doctor.genero}</td>
                    <td>${doctor.usuario}</td>
                    <td>${doctor.contrasena}</td>
                    <td>${doctor.especialidad}</td>
                    <td>${doctor.telefono}</td>
                    <td>
                        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modificarDoctor" onclick="getDoctor('${doctor.usuario}')" type="submit"><i class="fa fa-pencil" style="font-size:15px; color:white;"></i></button>
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminarModal" onclick="getEliminarDoctor('${doctor.usuario}')" type="submit"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`
                listaDoctor.push(filaDoctor)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cargarDoctores() {
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

                fetch('http://127.0.0.1:5000/api/addDoctor', {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        'nombre': info[0],
                        'apellido': info[1],
                        'fecha': info[2],
                        'genero': info[3],
                        'usuario': info[4],
                        'contrasena': info[5],
                        'especialidad': info[6],
                        'telefono': info[7]
                    })
                }).then(response => {
                    return response.json();

                }).then(jsonResponse => {
                    console.log(jsonResponse);
                    document.getElementById('fileinput').value = "";
                    if (jsonResponse['res'] == 'Usuario ya repetido') {
                        Toasty('repetido')
                    }
                    getDoctores();
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        reader.readAsText(file);
    }
}

function getDoctor(usuario) {
    selectIndice = 0
    fetch(`http://127.0.0.1:5000/api/getDoctor/${usuario}`)
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
            document.getElementById('especialidad').value = response.especialidad
            document.getElementById('telefono').value = response.telefono
            document.getElementById('footerModal').innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="validarDoctor('${response.usuario}')">Modificar</button>`
        }).catch(function (error) {
            console.log(error);
        });
}

function getEliminarDoctor(usuario) {
    document.getElementById('eliminarFooter').innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-primary" onclick="deleteDoctor('${usuario}')">Eliminar</button>`
}

function validarDoctor(oldUsuario) {
    newUsuario = document.getElementById('usuario').value
    if (oldUsuario != newUsuario) {
        fetch(`http://127.0.0.1:5000/api/getUpdateDoctor/${newUsuario}`)
            .then((resp) => resp.json())
            .then(function (response) {
                if (response['res'] == 'no existe') {
                    updateDoctor(newUsuario)
                    cerrarModal('#modificarDoctor')
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
        updateDoctor(oldUsuario)
        cerrarModal('#modificarDoctor')
        Toasty('modificar')
    }
}

function updateDoctor(usuario) {
    nombre = document.getElementById('nombre').value
    apellido = document.getElementById('apellido').value
    oldFecha = document.getElementById('fecha').value
    genero = document.getElementById('genero').value
    contrasena = document.getElementById('contrasena').value
    especialidad = document.getElementById('especialidad').value
    telefono = document.getElementById('telefono').value
    splittedFecha = oldFecha.split('-')
    newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

    fetch('http://127.0.0.1:5000/api/updateDoctor', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            'nombre': nombre,
            'apellido': apellido,
            'fecha': newFecha,
            'genero': genero,
            'usuario': usuario,
            'contrasena': contrasena,
            'especialidad': especialidad,
            'telefono': telefono
        })
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        console.log(jsonResponse)
        getDoctores()
    }).catch(error => {
        console.log(error)
    })
}

function deleteDoctor(usuario) {
    fetch(`http://127.0.0.1:5000/api/deleteDoctor/${usuario}`)
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            cerrarModal('#eliminarModal')
            Toasty('eliminar')
            getDoctores()
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cerrarModal(modal) {
    console.log(modal)
    $(modal).modal('hide');
}

getDoctores()

