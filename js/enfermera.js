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

getEnfermeras()