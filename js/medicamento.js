function getMedicamentos() {
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getMedicamentos')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var paciente = response[i]
                htmlTable.innerHTML += `
                <tr>
                    <td>${paciente.nombre}</td>
                    <td>${paciente.precio}</td>
                    <td>${paciente.descripcion}</td>
                    <td>${paciente.cantidad}</td>
                    <td>
                        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modificar" onclick="getPaciente('${paciente.usuario}')" type="submit"><i class="fa fa-pencil" style="font-size:15px; color:white;"></i></button>
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminar" onclick="opcionesDelete('${paciente.usuario}')" type="submit"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`
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
                console.log(info)

                fetch('http://127.0.0.1:5000/api/addMedicamento', {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        'nombre': info[0],
                        'precio': info[1],
                        'descripcion': info[2],
                        'cantidad': info[3],
                    })
                }).then(response => {
                    return response.json();

                }).then(jsonResponse => {
                    console.log(jsonResponse);
                    document.getElementById('fileinput').value = "";
                    if (jsonResponse['res'] == 'Usuario ya repetido') {
                        Toasty('repetido')
                    }
                    getMedicamentos();
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        reader.readAsText(file);
    }
}

getMedicamentos()