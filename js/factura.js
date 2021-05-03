function total() {
    consulta = parseFloat(document.getElementById('consulta').value)
    internado = parseFloat(document.getElementById('internado').value)
    operacion = parseFloat(document.getElementById('operacion').value)
    total = consulta + internado + operacion
    document.getElementById('total').value = total
}

function getDatos(paciente, doctor) {
    fetch(`http://127.0.0.1:5000/api/getDoctor/${doctor}`)
        .then((resp) => resp.json(
        )).then(function (response) {
            console.log(response)
            document.getElementById('doctor').value = response['nombre'] + ' ' + response['apellido']
        }).catch(function (error) {
            console.log(error);
        });

        fetch(`http://127.0.0.1:5000/api/getPaciente/${paciente}`)
        .then((resp) => resp.json(
        )).then(function (response) {
            console.log(response)
            document.getElementById('nombre').value = response['nombre'] + ' ' + response['apellido']
        }).catch(function (error) {
            console.log(error);
        });

        document.getElementById('footerModal').innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="generarFactura('${paciente}','${doctor}')">Generar Factura</button>`
}

function generarFactura(paciente, doctor){
    window.jsPDF = window.jspdf.jsPDF
    const pdf = new jsPDF();

    fecha = document.getElementById('fecha').value
    paciente = document.getElementById('nombre').value
    doctor = document.getElementById('doctor').value
    consulta = document.getElementById('consulta').value
    internado = document.getElementById('internado').value
    operacion = document.getElementById('operacion').value
    totalD = document.getElementById('total').value

    if(fecha == "" || paciente == "" || doctor == "" || consulta == "" || internado == "" || operacion == "" || totalD == ""){
        alert('vacio')
    } else {
        splittedFecha = fecha.split('-')
        newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

        pdf.text("Fecha: Guatemala, " + newFecha, 12, 20);
        pdf.text("Paciente: " + paciente, 12, 40);
        pdf.text("Doctor: " + doctor, 12, 50);
        pdf.text("-------------------------- Monto --------------------------", 12, 70);
        pdf.text("Monto por consulta: Q." + consulta, 12, 90);
        pdf.text("Monto por internado: Q." + internado, 12, 100);
        pdf.text("Monto por operacion: Q." + operacion, 12, 110);
        pdf.text("Total: Q." + totalD, 12, 130);
        pdf.save('Factura.pdf');
        Toasty('reporte')
    }
}