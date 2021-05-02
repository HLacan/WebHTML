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

getPacientes()