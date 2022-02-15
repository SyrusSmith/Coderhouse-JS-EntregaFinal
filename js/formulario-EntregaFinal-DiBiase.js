// Creo una clase para almacenar los datos que entran para suscribirse al Newsletter
class NewsletterData {
    constructor (name, email) {
        // this.newsId = newsId;
        this.name = name;
        this.email = email;
    }
}

// Creo un array para almacenar los datos de suscripción al Newsletter
const NEWSLETTERDATABASE = [];

// FORMULARIO

let myFormNewsletter = document.getElementById("newsletterForm");
// let resultadoFormulario = document.getElementById("resultForm");
myFormNewsletter.addEventListener("submit", validateForm);

// Función para validar el formulario
function validateForm(e) {
    e.preventDefault();
    let newsletterName = document.getElementById("newsletterName").value;
    let newsletterEmail = document.getElementById("newsletterEmail").value;

    // Expresión regular para validar email
    let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    // Expresión regular para validar que sean solo letras
    let nameReg = /^[A-Za-z ]+$/;

    // Valido que el nombre tenga 3+ caracteres
    if (newsletterName.length < 3) {
        // Si da error, creo un span para mostrar el error, lo inyecto al HTML, lo estileo, y se lo adiciono al nodo padre
        let errorNewsletterName = document.createElement("span");        
        errorNewsletterName.innerHTML = `El nombre debe tener mínimo 3 letras`;
        errorNewsletterName.classList.add("CONTACTO__FORM__ERROR");
        document.getElementById("errorNewsletterName").appendChild(errorNewsletterName);

        // Y le cambio el estilo al nodo padre para mostrar que el error es acá
        document.getElementById("newsletterName").classList.add("CONTACTO__FORM__ERROR__FOCUS");

    } else if (!nameReg.test(newsletterName)) {

        // Si da error, creo un span para mostrar el error, lo inyecto al HTML, lo estileo, y se lo adiciono al nodo padre
        let errorNewsletterName = document.createElement("span");        
        errorNewsletterName.innerHTML = `El nombre debe contener solo letras`;
        errorNewsletterName.classList.add("CONTACTO__FORM__ERROR");
        document.getElementById("errorNewsletterName").appendChild(errorNewsletterName);

        // Y le cambio el estilo al nodo padre para mostrar que el error es acá
        document.getElementById("newsletterName").classList.add("CONTACTO__FORM__ERROR__FOCUS");
        
    } else {
        // Si el nombre está OK, lo guardo en local storage
        newsletterName = localStorage.setItem("Nombre", JSON.stringify(newsletterName));
    }
    // Valido que el email sea realmente un email
    if (!emailReg.test(newsletterEmail)) {
        // Si da error, creo un span para mostrar el error, lo inyecto al HTML, lo estileo, y se lo adiciono al nodo padre
        let errorNewsletterEmail = document.createElement("span");
        errorNewsletterEmail.innerHTML = `Tenés que poner un email válido`;
        errorNewsletterEmail.classList.add("CONTACTO__FORM__ERROR");        
        document.getElementById("errorNewsletterEmail").appendChild(errorNewsletterEmail);

        // Y le cambio el estilo al nodo padre para mostrar que el error es acá
        document.getElementById("newsletterEmail").classList.add("CONTACTO__FORM__ERROR__FOCUS");

    } else {
        // Si el email está OK, lo guardo en local storage
        newsletterEmail = localStorage.setItem("Email", JSON.stringify(newsletterEmail));
    }

    // Parseo los datos para después mostrarlos y/o guardarlos en un array como BB.DD.
    newsletterName = JSON.parse(localStorage.getItem("Nombre"));
    newsletterEmail = JSON.parse(localStorage.getItem("Email"));

    // Si los datos están completos, le muestro un mensaje de agradecimiento
    if ((newsletterName != null) && (newsletterEmail != null)) {

        // Creo un elemento que va a contener el mensaje
        let formSubmitted = document.createElement("div");

        // Inyecto el mensaje en el HTML
        formSubmitted.innerHTML = `<p>¡Gracias por suscribirte a nuestro newsletter <strong>${newsletterName}</strong>!</p>`;

        // Le agrego la clase
        formSubmitted.classList.add("CONTACTO__ENVIADO__MOSTRAR");

        // Busco el ID del elemento y le adiciono el elemento que creé para mostrarle que se suscribió correctamente
        document.getElementById("resultForm").appendChild(formSubmitted);

        // Creo la animación para mostrar el cartel de suscripción, y que se oculte automáticamente pasada X cantidad de tiempo
        $(".CONTACTO__ENVIADO__MOSTRAR").slideDown("fast", function() {
            $(".CONTACTO__ENVIADO__MOSTRAR").delay(4000).fadeOut(1500);
        });

        // Guardo los datos en un array a modo de BB.DD.
        NEWSLETTERDATABASE.push(new NewsletterData(newsletterName, newsletterEmail));
    }

    //window.setTimeout(localStorage.clear(), 60000); // 1 seg = 10000 miliseg

    console.log(NEWSLETTERDATABASE);

}