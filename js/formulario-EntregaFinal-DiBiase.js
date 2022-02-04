// Creo una clase para almacenar los datos que entran para suscribirse al Newsletter
class DatosNewsletter {
    constructor (nombre, email) {
        // this.newsId = newsId;
        this.nombre = nombre;
        this.email = email;
    }
}

// Creo un array para almacenar los datos de suscripción al Newsletter
const BASEDATOSNEWSLETTER = [];

// FORMULARIO

let miFormularioNewsletter = document.getElementById("newsletterForm");
// let resultadoFormulario = document.getElementById("resultForm");
miFormularioNewsletter.addEventListener("submit", validarFormulario);

// Función para validar el formulario
function validarFormulario(e) {
    e.preventDefault();
    let nombreNewsletter = document.getElementById("newsletterName").value;
    let emailNewsletter = document.getElementById("newsletterEmail").value;

    // Expresión regular para validar email
    let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    // Valido que el nombre tenga 3+ caracteres
    if (nombreNewsletter.length < 3) {
        // Si da error, creo un span para mostrar el error, lo inyecto al HTML, lo estileo, y se lo adiciono al nodo padre
        let errorNombreNewsletter = document.createElement("span");        
        errorNombreNewsletter.innerHTML = `El nombre debe tener mínimo 3 letras`;
        errorNombreNewsletter.classList.add("CONTACTO__FORM__ERROR");
        document.getElementById("errorNewsletterName").appendChild(errorNombreNewsletter);

        // Y le cambio el estilo al nodo padre para mostrar que el error es acá
        document.getElementById("newsletterName").classList.add("CONTACTO__FORM__ERROR__FOCUS");

    } else {
        // Si el nombre está OK, lo guardo en local storage
        nombreNewsletter = localStorage.setItem("Nombre", JSON.stringify(nombreNewsletter));
    }
    // Valido que el email sea realmente un email
    if (!emailReg.test(emailNewsletter)) {
        // Si da error, creo un span para mostrar el error, lo inyecto al HTML, lo estileo, y se lo adiciono al nodo padre
        let errorEmailNewsletter = document.createElement("span");
        errorEmailNewsletter.innerHTML = `Tenés que poner un email válido`;
        errorEmailNewsletter.classList.add("CONTACTO__FORM__ERROR");        
        document.getElementById("errorNewsletterEmail").appendChild(errorEmailNewsletter);

        // Y le cambio el estilo al nodo padre para mostrar que el error es acá
        document.getElementById("newsletterEmail").classList.add("CONTACTO__FORM__ERROR__FOCUS");

    } else {
        // Si el email está OK, lo guardo en local storage
        emailNewsletter = localStorage.setItem("Email", JSON.stringify(emailNewsletter));
    }

    // Parseo los datos para después mostrarlos y/o guardarlos en un array como BB.DD.
    nombreNewsletter = JSON.parse(localStorage.getItem("Nombre"));
    emailNewsletter = JSON.parse(localStorage.getItem("Email"));

    // Si los datos están completos, le muestro un mensaje de agradecimiento
    if ((nombreNewsletter != null) && (emailNewsletter != null)) {
        let formularioEnviado = document.createElement("div");
        formularioEnviado.innerHTML = `<p>¡Gracias por suscribirte a nuestro newsletter <strong>${nombreNewsletter}</strong>!</p>`;
        formularioEnviado.classList.add("CONTACTO__ENVIADO__MOSTRAR");
        document.getElementById("resultForm").appendChild(formularioEnviado);

        // Creo la animación para mostrar el cartel de suscripción, y que se oculte automáticamente pasada X cantidad de tiempo
        $(".CONTACTO__ENVIADO__MOSTRAR").slideDown("fast", function() {
            $(".CONTACTO__ENVIADO__MOSTRAR").delay(4000).fadeOut(1500);
        });

        // Guardo los datos en un array a modo de BB.DD.
        BASEDATOSNEWSLETTER.push(new DatosNewsletter(nombreNewsletter, emailNewsletter));
    }

    //window.setTimeout(localStorage.clear(), 60000); // 1 seg = 10000 miliseg

    console.log(BASEDATOSNEWSLETTER);

}