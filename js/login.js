function login() {
    usuario = document.getElementById('usuario').value
    contrasena = document.getElementById('contrasena').value

    if (usuario.trim() != "" || contrasena.trim() != ""){
        console.log(usuario)
        console.log(contrasena)
    
        fetch('http://127.0.0.1:5000/api/login', {
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
            if (jsonResponse['res'] == 'admin'){
                console.log('amonos a admin page')
                document.location.href = "../html/inicioAdmin.html"
            } else if (jsonResponse['res'] == 'doctor'){
                console.log('amonos a doctor page')
                document.location.href = '../html/inicioDoctor.html'
            }
        }).catch(error => {
            console.log(error)
        })
    }


}