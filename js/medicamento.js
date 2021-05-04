function getMedicamentos() {
    var htmlTable = document.getElementById("cuerpoTabla")
    fetch('http://127.0.0.1:5000/api/getMedicamentos')
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            document.getElementById("cuerpoTabla").innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var medicamento = response[i]
                htmlTable.innerHTML += `
                <tr>
                    <td>${medicamento.nombre}</td>
                    <td>${medicamento.precio}</td>
                    <td>${medicamento.descripcion}</td>
                    <td>${medicamento.cantidad}</td>
                    <td>
                        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modificar" onclick="getMedicamento('${medicamento.nombre}')" type="submit"><i class="fa fa-pencil" style="font-size:15px; color:white;"></i></button>
                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminar" onclick="opcionesDelete('${medicamento.nombre}')" type="submit"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cargarMedicamentos() {
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

function pdfMedicamentos() {
    window.jsPDF = window.jspdf.jsPDF
    const pdf = new jsPDF();

    fetch('http://127.0.0.1:5000/api/getMedicamentos')
        .then(function (response) {
            if (response.status !== 200) {
                console.log('hubo un problema' + response.status);
                return;
            } else {
                response.json().then(function (data) {
                    const lista = []
                    for (var i = 0; i < data.length; i++) {
                        var medicamento = data[i]
                        var dataMedicamento = {
                            'nombre': medicamento.nombre,
                            'precio': medicamento.precio,
                            'descripcion': medicamento.descripcion,
                            'cantidad': medicamento.cantidad,
                        }
                        lista.push(dataMedicamento)
                    }
                    //console.log("mi lista" + JSON.stringify(lista))

                    const columnas = [['Nombre', 'Precio', 'Descripcion', 'Cantidad']];
                    const filas = [];

                    lista.forEach(i => {
                        const temp = [i.nombre, i.precio, i.descripcion, i.cantidad];
                        filas.push(temp);
                    });

                    pdf.text('Listado de Medicamentos', 80, 10,)
                    pdf.autoTable({
                        head: columnas,
                        body: filas,
                    });
                    pdf.save('Listado_Medicamentos.pdf');
                    Toasty('reporte')
                });
            }
        }
        )
        .catch(function (err) {
            console.log('Fetch Error :(', err);
        });

}

function getMedicamento(usuario) {
    selectIndice = 0
    fetch(`http://127.0.0.1:5000/api/getMedicamento/${usuario}`)
        .then((resp) => resp.json(
        )).then(function (response) {
            console.log(response)
            document.getElementById('nombre').value = response.nombre
            document.getElementById('precio').value = response.precio
            document.getElementById('descripcion').value = response.descripcion
            document.getElementById('cantidad').value = response.cantidad
            document.getElementById('footerModal').innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="validarMedicamento('${response.nombre}')">Modificar</button>`
        }).catch(function (error) {
            console.log(error);
        });
}

function validarMedicamento(oldNombre) {
    newNombre = document.getElementById('nombre').value
    if (oldNombre != newNombre) {
        fetch(`http://127.0.0.1:5000/api/validarM/${oldNombre}/${newNombre}`)
            .then((resp) => resp.json())
            .then(function (response) {
                console.log(response)
                if (response['res'] == 'libre') {
                    updateMedicamento(oldNombre, newNombre)
                    cerrarModal('#modificar')
                    Toasty('modificar')
                } else {
                    console.log('el nombre de medicamento ya esta en uso')
                    Toasty('existe')
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    } else if (oldNombre == newNombre) {
        console.log('modificando el mismo medicamento')
        updateMedicamento(oldNombre, newNombre)
        cerrarModal('#modificar')
        Toasty('modificar')
    }
}

function updateMedicamento(oldNombre, newNombre) {
    nombre = document.getElementById('nombre').value
    precio = document.getElementById('precio').value
    descripcion = document.getElementById('descripcion').value
    cantidad = document.getElementById('cantidad').value

    fetch('http://127.0.0.1:5000/api/updateMedicamento', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            'oldNombre': oldNombre,
            'newNombre': newNombre,
            'precio': precio,
            'descripcion': descripcion,
            'cantidad': cantidad,
        })
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        console.log(jsonResponse)
        console.log('medicamento actualizado')
        getMedicamentos()
    }).catch(error => {
        console.log(error)
    })
}

function opcionesDelete(nombre) {
    document.getElementById('eliminarFooter').innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-primary" onclick="deleteMedicamento('${nombre}')">Eliminar</button>`
}

function deleteMedicamento(nombre) {
    fetch(`http://127.0.0.1:5000/api/deleteMedicamento/${nombre}`)
        .then((resp) => resp.json())
        .then(function (response) {
            console.log(response)
            cerrarModal('#eliminar')
            Toasty('eliminar')
            getMedicamento()
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cerrarModal(modal) {
    $(modal).modal('hide');
}

getMedicamentos()