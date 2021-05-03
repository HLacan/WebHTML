function getPacientes() {
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

getPacientes()