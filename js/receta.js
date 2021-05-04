function getDatosReceta(doctor){
    fetch(`http://127.0.0.1:5000/api/getDoctor/${doctor}`)
    .then((resp) => resp.json(
    )).then(function (response) {
        console.log(response)
        document.getElementById('doctor').value = response['nombre'] + ' ' + response['apellido']
    }).catch(function (error) {
        console.log(error);
    });

    document.getElementById('footerModalReceta').innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="generarReceta()">Generar Factura</button>`
}

function generarReceta(){
    window.jsPDF = window.jspdf.jsPDF
    const pdf = new jsPDF();

    fecha = document.getElementById('fecha').value
    console.log(fecha)
    doctor = document.getElementById('doctor').value
    console.log(doctor)
    padecimiento = document.getElementById('padecimiento').value
    console.log(padecimiento)
    descripcion = document.getElementById('descripcion').value
    console.log(descripcion)

    if(fecha == "" || doctor == "" || padecimiento == "" || descripcion == ""){
        alert('vacio')
    } else {
        splittedFecha = fecha.split('-')
        newFecha = splittedFecha[2] + '/' + splittedFecha[1] + '/' + splittedFecha[0]

        pdf.text("Fecha: Guatemala, " + newFecha, 11, 20);
        pdf.text("Doctor: " + doctor, 12, 50);
        pdf.text("Padecimiento: " + padecimiento, 12, 80);
        pdf.text("Descripcion: " + descripcion, 12, 110);
        pdf.save('Receta_Paciente.pdf');
    }
}