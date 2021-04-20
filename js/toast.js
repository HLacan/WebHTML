
var option =
{
    animation: true,
    delay: 2000
};

function Toasty() {
    var toastHTMLElement = document.getElementById('EpicToast');

    var toastElement = new bootstrap.Toast(toastHTMLElement, option);

    toastElement.show();
}