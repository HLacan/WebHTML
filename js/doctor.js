function getDoctores() {
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getDoctores')
        .then(function (response) {
            if (response.status !== 200) {
                console.log('hubo un problema' + response.status);
                return;
            } else {
                response.json().then(function (data) {
                    console.log(data);
                    for(var i = 0; i < data.length; i++){
                        var doctor = data[i]
                        htmlTable.innerHTML += `
                        <tr>
                            <td>${doctor.nombre}</td>
                            <td>${doctor.apellido}</td>
                            <td>${doctor.fecha}</td>
                            <td>${doctor.sexo}</td>
                            <td>${doctor.usuario}</td>
                            <td>${doctor.contrasena}</td>
                            <td>${doctor.especialidad}</td>
                            <td>${doctor.telefono}</td>
                        </tr>`
                    }
                });
            }
        }
        )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}

getDoctores()