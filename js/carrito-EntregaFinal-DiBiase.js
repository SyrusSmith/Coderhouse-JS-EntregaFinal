// Agrego un evento listener para que cuando el contenido se cargue me arme el carrito
document.addEventListener('DOMContentLoaded', () => {
    cartTotalPrice(cart);
});

// Recupero el carrito del local storage y lo guardo para operarlo
let cart = JSON.parse(localStorage.getItem("cart"));

// Recorro el carrito, y si tiene productos creo en el HTML cada producto que contenga
if (cart) {
    cart.forEach(createCartProduct);
}

// Creo una función para inyectar en el HTML cada producto
function createCartProduct (cartProduct) {

    // Declaro una Variable para poder crear el elemento que va a contener a los productos que cree
    let cartProductContainer = document.createElement("tr");

    // Inyecto el HTML con los parámetros de cada producto que contenga el carrito
    cartProductContainer.innerHTML = 
        `<td><img src="${cartProduct.image}"></td>
        <td>${cartProduct.name}</td>
        <td>$${cartProduct.price}</td>
        <td>${cartProduct.quantity}</td>
        <td>$${cartProduct.subtotal}</td>
        <td><button id="${cartProduct.id}" class="btnEliminarProducto">Eliminar</button></td>`;

    // Llamo mediante ID al elemento donde se van a crear los productos, y le agrego cada hijo contenedor de cada producto
    document.getElementById("productosCarrito").appendChild(cartProductContainer);

}


// Creo una variable para almacenar al botón "btnComprarCarrito"
let buttonPurchase = document.querySelector(".btnComprarCarrito");

// Le agrego un evento click
buttonPurchase.addEventListener("click", purchaseCart);

// Creo la función purchaseProduct para poder comprar el carrito
function purchaseCart(e) {
    
    // Recupero el JSON con los productos que agregué al carrito
    let cartProducts = JSON.parse(localStorage.getItem("cart"));
    
    // Creo un array donde almacenar la compra
    let productsBuyed = [];

    // Creo una variable donde almacenar el valor total de la compra
    let productsFinalPrice = 0;

    // Con un for of recorro el array con los productos del carrito que traje del JSON, y luego los pusheo en el array que almacena la compra final
    for (const products of cartProducts) {
        
        productsBuyed.push({
            "dataId": `${products.id}`,
            "name": `${products.name}`,
            "price": `${products.price}`
        });

        // En cada iteración del for of voy sumando el valor de cada producto individual al total de la compra
        productsFinalPrice = products.price + productsFinalPrice;
    }

    // Pusheo el valor final de la compra dentro del array para guardarlo junto con los datos de cada producto
    productsBuyed.push({"Precio Total": `${productsFinalPrice}`});
    console.log(productsBuyed);
    
    // Persisto un JSON con los datos de la compra en el localStorage
    localStorage.setItem("purchase", JSON.stringify(productsBuyed));

    // MODAL PRODUCTOS COMPRADOS
    // Creo una variable para almacenar el elemento a crear en el DOM
    let purchaseThanks = document.createElement("div");

    purchaseThanks.innerHTML = `<div class="MODAL__CONTENT">
                                <button class="MODAL__CONTENT__CLOSE">
                                    <p>&times;</p>
                                </button>
                                <p class="MODAL__CONTENT__MESSAGE">Gracias por realizar tu compra con nosotros</p>
                                </div>`;

    // Le agrego un ID al elemento contenedor del modal
    purchaseThanks.setAttribute("id", "myModal");
    // Le agrego una clase al elemento contenedor del modal
    purchaseThanks.classList.add("MODAL");
    // Le agrego el modal al nodo padre
    document.querySelector("main").appendChild(purchaseThanks);
    
    // Creo una variable para almacenar el ID del modal
    let modal = document.getElementById("myModal");
    // Creo una variable para seleccionar el botón para cerrar el modal y lo almaceno
    let closeBtn = document.querySelector(".MODAL__CONTENT__CLOSE");
    // Al botón cerrar le agrego un evento "click", y usando una función anónima le digo que remueva el modal que creé
    closeBtn.addEventListener("click", () => {
        modal.remove();
        }
    );

    // Creo una función para que si el usuario clickea fuera del botón cerrar, el modal se cierre igual
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.remove();
            }
        }
    );

    // Llamo a la función para borrar del carrito los productos que ya se compraron y evitar que se vuelvan a comprar por error
    cartEmpty(e);
}


// Creo una variable para almacenar todos los botones eliminar que tengan la clase "btnEliminarProducto"
let buttonsRemove = document.querySelectorAll(".btnEliminarProducto");

// Les agrego un evento click a todos los botones que almacené dentro de la variable "botonesEliminar" usando un forEach(), y llamo a la función "eliminarProducto" para que se ejecute
buttonsRemove.forEach(element => {
    element.addEventListener("click", productRemove);
})

// Creo la función para eliminar el producto
function productRemove(e) {

    // Creo una variable para almacenar el ID del producto a eliminar, el cual obtengo del array CARRITO que contiene los productos, usando el método findIndex()
    let index = cart.findIndex(cartProduct => cartProduct.id == e.target.id);
    
    // con el método "splice()" elimino del array el producto con el ID que almacené dentro de la variable "Index", y le indico que quiero eliminar solo un(1) elemento del array
    cart.splice(index, 1);

    // Usando el e.target subo hasta el elemento padre y elimino el tr con el producto y todo su contenido usando el método remove()
    e.target.parentNode.parentNode.remove();
    
    // Vuelvo a persistir el CARRITO en localStorage actualizando la cantidad de productos luego de eliminar el que quería
    localStorage.setItem("cart", JSON.stringify(cart));

    // Llamo a la función cartTotalPrice() y actualizo el precio mostrado
    cartTotalPrice(cart);
}


// Creo una variable para almacenar el botón de Vaciar Carrito
let buttonCartEmpty = document.querySelector("#btnVaciarCarrito");

// Le agrego un evento click y le asigno la función
buttonCartEmpty.addEventListener("click", cartEmpty);

// Creo la función Vaciar Carrito
function cartEmpty(){

    // Selecciono el elemento que tiene a todos los productos cargados del carrito
    let cartProductContainer = document.getElementById("productosCarrito");

    // Borro los elementos de la página
    cartProductContainer.remove();
    
    // Vacío el array que contiene los productos
    cart = [];

    // Vuelvo a persistir el CARRITO en localStorage actualizando la cantidad de productos luego de eliminar el que quería
    localStorage.setItem("cart", JSON.stringify(cart));

    // Llamo al ID contenedor e inyecto el precio en el HTML
    document.getElementById("precioTotal").innerHTML = `<span>PRECIO TOTAL: $${cart}</span>`;
    // Le agrego la clase al ID contenedor
    document.getElementById("precioTotal").classList.add("precioTotal");
}


// Creo la función para calcular el precio total de todos los productos del carrito
function cartTotalPrice(cartProducts) {
    
    // Creo una variable donde guardaré el precio total de los productos que contiene el carrito
    let totalCartProducts = 0;
    
    // Creo un for para recorrer el array con los productos en el carrito
    for (let product of cartProducts){
        totalCartProducts += product.price;
    }
    
    // Llamo al ID contenedor e inyecto el precio en el HTML
    document.getElementById("precioTotal").innerHTML = `<span>PRECIO TOTAL: $${totalCartProducts}</span>`;
    // Le agrego la clase al ID contenedor
    document.getElementById("precioTotal").classList.add("precioTotal");
}