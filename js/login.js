
function login() {
    data = 'lol'
    usuario = document.getElementById('usuario').value
    contrasena = document.getElementById('contrasena').value

    if (usuario.trim() != "" || contrasena.trim() != ""){
        //console.log(usuario)
        //console.log(contrasena)
    
        fetch('https://application-be-201906576.herokuapp.com/api/login', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'usuario': usuario,
                'contrasena': contrasena,
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse);
            if (jsonResponse['tipo'] == 'admin'){
                console.log('amonos a admin page')
                sessionStorage.setItem("sesion", JSON.stringify(jsonResponse));
                document.location.href = "../html/inicioAdmin.html"

            } else if (jsonResponse['tipo'] == 'doctor'){
                console.log('amonos a doctor page')
                sessionStorage.setItem("sesion", JSON.stringify(jsonResponse));
                document.location.href = '../html/inicioDoctor.html'

            } else if (jsonResponse['tipo'] == 'enfermero'){
                console.log('amonos a enfermera page')
                sessionStorage.setItem("sesion", JSON.stringify(jsonResponse));
                document.location.href = '../html/inicioEnfermera.html'

            } else if (jsonResponse['tipo'] == 'paciente'){
                console.log('amonos a paciente page')
                sessionStorage.setItem("sesion", JSON.stringify(jsonResponse));
                document.location.href = '../html/inicioPaciente.html'

            } else if (jsonResponse['res'] == 'no existe') {
                console.log('no existe')
                Toasty('no existe')
            }
        }).catch(error => {
            console.log(error)
        })
    }
}


