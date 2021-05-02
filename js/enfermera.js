function getEnfermeras() {
    var listaEnfermeras = []
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getEnfermeras')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var enfermera = response[i]
                var filaEnfermera = [enfermera.nombre, enfermera.apellido, enfermera.fecha, enfermera.genero, enfermera.usuario, enfermera.contrasena, enfermera.telefono]
                htmlTable.innerHTML += `
                <tr>
                    <td>${enfermera.nombre}</td>
                    <td>${enfermera.apellido}</td>
                    <td>${enfermera.fecha}</td>
                    <td>${enfermera.genero}</td>
                    <td>${enfermera.usuario}</td>
                    <td>${enfermera.contrasena}</td>
                    <td>${enfermera.telefono}</td>
                    <td>
                        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modificarDoctor" onclick="getDoctor('${enfermera.usuario}')" type="submit"><i class="fa fa-pencil" style="font-size:15px; color:white;"></i></button>
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminarModal" onclick="getEliminarDoctor('${enfermera.usuario}')" type="submit"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`
                listaEnfermeras.push(filaEnfermera)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cargarEnfermeras() {
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

                fetch('http://127.0.0.1:5000/api/addEnfermera', {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        'nombre': info[0],
                        'apellido': info[1],
                        'fecha': info[2],
                        'genero': info[3],
                        'usuario': info[4],
                        'contrasena': info[5],
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

getEnfermeras()