var favoritemovie = JSON.parse(sessionStorage.getItem("sesion"));
console.log(favoritemovie);

function salir(){
    sessionStorage.clear()
    document.location.href = '../index.html'
}