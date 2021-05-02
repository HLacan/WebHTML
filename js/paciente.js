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
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminarModal" onclick="getEliminarDoctor('${paciente.usuario}')" type="submit"><i class="fa fa-trash"></i></button>
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

getPacientes()