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
                            'sexo': doctor.sexo,
                            'usuario': doctor.usuario,
                            'contrasena': doctor.contrasena,
                            'especialidad': doctor.especialidad,
                            'telefono': doctor.telefono
                        }
                        lista.push(dataDoctor)
                    }
                    console.log("mi lista" + JSON.stringify(lista))

                    const header = [['Nombre', 'Apellido', 'Fecha', 'Sexo', 'Usuario', 'Contrasena', 'Especialidad', 'Telefono']];
                    const rows = [];

                    lista.forEach(elm => {
                        const temp = [elm.nombre, elm.apellido, elm.fecha, elm.sexo, elm.usuario, elm.contrasena, elm.especialidad, elm.telefono];
                        rows.push(temp);
                    });

                    pdf.text('Listado de Doctores', 80, 10,)
                    pdf.autoTable({
                        head: header,
                        body: rows,
                    });
                    pdf.save('ListadoDoctores.pdf');
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
        .then(function (response) {
            if (response.status !== 200) {
                console.log('hubo un problema' + response.status);
                return;
            } else {
                response.json().then(function (data) {
                    console.log(data);
                    document.getElementById("cuerpoTabla").innerHTML = "";
                    for (var i = 0; i < data.length; i++) {
                        var doctor = data[i]
                        var filaDoctor = [doctor.nombre, doctor.apellido, doctor.fecha, doctor.sexo, doctor.usuario, doctor.contrasena, doctor.especialidad, doctor.telefono]
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

                        listaDoctor.push(filaDoctor)
                    }
                    //console.log(listaDoctor)
                });
            }
        }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function cargarDoctores() {
    var input = document.getElementById('fileinput');
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
                    'sexo': info[3],
                    'usuario': info[4],
                    'contrasena': info[5],
                    'especialidad': info[6],
                    'telefono': info[7]
                })
            })
                .then(response => {
                    return response.json();
                    
                })
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    getDoctores();
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    reader.readAsText(file);
    

    /*
        fetch('http://127.0.0.1:5000/api/addDoctor', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'nombre': 'Pepe',
                'apellido': 'Gonzales',
                'fecha': '21/04/2021',
                'sexo': 'M',
                'usuario': 'El Pepe',
                'contrasena': 'pepiango',
                'especialidad': 'cabeza',
                'telefono': '123456789'
            })
        })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                console.log(jsonResponse);
                getDoctores();
            })
            .catch(error => {
                console.log(error)
            })
     */
}

function handleFileSelect() {

}


getDoctores()
