/*
@challenge 
 
@version: v4.0.1
@author: Nahuel Di Biase
@fecha: XX/02/2022
 
History:
- v4.0.0 - Entrega del proyecto final
- v4.0.1 - Cambiados nombres de funciones y variables a inglés
           Agregada validación al form para que solo acepte letras en el nombre
           Agregados links faltantes al menú
           Agregado botón comprar a página carrito y función purchaseCart
           Arreglado problema en eliminar producto, ahora actualiza el precio correctamente
           Agregado modal informando de la compra realizada que aparece luego de clickear el botón comprar
*/

// CÓDIGO DE ACÁ EN ADELANTE


// Creo la clase Producto con sus métodos para cargar los productos
class Product {
    constructor(id, dataId, category, name, image, basePrice, profit) {
        this.id = id;
        this.dataId = dataId;
        this.category = category;
        this.name = name;
        this.image = image;
        this.basePrice = parseFloat(basePrice);
        this.profit = parseFloat(profit);
        this.productPrice = parseFloat((this.basePrice*this.profit).toFixed(2));
    }
    addIva() {
        this.productFinalPrice = this.productPrice * 1.21;
    }
    limitateDecimals(){
        this.productFinalPrice = parseFloat(this.productFinalPrice.toFixed(2));
    }
}


// Creo la clase ProductoCarrito donde guardaré los productos que el usuario sume al carrito para comprar
class CartProduct {
    constructor(id, name, price, image, quantity, subtotal) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = 1;
        this.subtotal = price;
    }
}

// Cuando se cargue el documento, cargame los productos
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
  }
);

// Creo una función para llamar al JSON con los datos
async function loadProducts () {
    let response = await fetch('../data/baseDeProductos.json');
    let bbddProd = await response.json();

    // Creo un ciclo for para crear los productos cuando clickean el botón "Cargar Productos"
    for (const Product of bbddProd) {
    
        // Declaro una variable donde voy a almacenar el precio final de cada producto que se va a mostrar luego en el sitio
        let productFinalPrice = '';

        // Creo una función para calcular el precio final del producto
        function calculateProductFinalPrice() {

            // Declaro una variable para calcular el valor de los productos que me traigo del JSON y luego almacenarlos
            let productPrice = parseFloat(
                    (Product.basePrice * Product.profit).toFixed(2)
                );

            // Declaro una variable y sumo el IVA al precio del producto, para obtener el precio final
            productFinalPrice = productPrice * 1.21;
            
            // Limito los decimales para que solo se muestren 2
            productFinalPrice = parseFloat(productFinalPrice.toFixed(2));
            
            // Retorno la variable para poder mostrarla
            return Math.ceil(productFinalPrice);
        }

        // Llamo a la variable y ejecuto la función para calcular el precio final del producto
        productFinalPrice = calculateProductFinalPrice();
        // console.log(productFinalPrice);
    
        // Creo la variable para almacenar el producto creado
        let productContainer = document.createElement("article");

        // Creo el elemento a inyectar en el HTML
        productContainer.innerHTML = `<img src="${Product.image}" class="PRODUCTO__ITEM__IMG">\n
                                        <h3>${Product.name}</h3>\n
                                        <h4>Categoría: ${Product.category}</h4>\n
                                        <span class="PRODUCTOS__ITEM__COLOR">$${Math.ceil(productFinalPrice)}</span>
                                        <button class="PRODUCTOS__ITEM__BTN" id="${Product.dataId}">Agregar al Carrito</button>`;

        // Le asigno la clase CSS al elemento creado
        productContainer.classList.add("PRODUCTOS__ITEM");

        // Le asigno el atributo categoria
        productContainer.setAttribute("category", `${Product.category}`);

        // Llamo al elemento padre y le asino los hijos
        document.getElementById("listaProductos").appendChild(productContainer);

        // Agrego evento al botón comprar y la función para agregar el producto al carrito
        document.getElementById(`${Product.dataId}`).addEventListener("click", addToCart)

        // Recupero el carrito
        let cartTotal = JSON.parse(localStorage.getItem("cart"));
        // Si la cantidad de productos es mayor a null (null == vacío en este caso), muestro la cantidad de productos que tiene el carrito
        if (cartTotal) {

            totalCart(cartTotal);
        }
    }
}


// Creo un array donde guardaré los productos que el usuario agregue al carrito de compras
let cart = [];

// Creo una función para poder agregar los productos al carrito
function addToCart(e) {

    // Recupero el carrito
    let localCart = JSON.parse(localStorage.getItem("cart"));

    // Si hay algún producto guardado en el carrito antes, lo guardo en el array
    if (localCart) {
        cart = localCart;
    }

    // Busco si el producto que clickea el usuario ya está almacenado
    let index = cart.findIndex(product => product.id == e.target.id);
    
    // Variables para almacenar los datos del producto que necesito operar en el carrito
    // console.log(Number(e.target.parentNode.children[3].textContent.slice(1)))
    let productId = e.target.id;
    let productName = e.target.parentNode.children[1].textContent;
    let productPrice = Number(e.target.parentNode.children[3].textContent.slice(1)); // Capturo el texto con el valor, con el método .splice(1) borro el primer caracter, que es el símbolo $, y con el método Number() lo transformo de string a numer para poder usarlo como tal
    let productImage = e.target.parentNode.children[0].src;

    // Si el producto no está almacenado, lo creo, y si está creado, incremento la cantidad del producto
    if (index == -1) {
        // Pusheo los datos al array para guardarlos
        cart.push (new CartProduct(productId, productName, productPrice, productImage));
    } else {
        // Incremento la cantidad del producto seleccionado
        cart[index].quantity ++;
        // Multiplico precio por cantidad para tener el subtotal
        cart[index].subtotal = cart[index].price * cart[index].quantity;
    }

    // Guardo el CARRITO en el local storage para persistirlo
    localStorage.setItem("cart", JSON.stringify(cart));

    // Llamo a la función cartTotal() para que se ejecute y me sume al total de productos el que agregué
    totalCart(cart);
}

// Creo una función para obtener el total de productos en el carrito y mostrarlos en el botón con el ícono del carrito en el NAV
function totalCart(cartProducts) {

    // Llamo mediante ID al ícono del carrito, donde luego mostraré la cantidad de productos que contiene
    let cartIcon = document.getElementById("carritoDisplay");

    // Creo una variable donde guardaré la cantidad total de productos que contiene el carrito
    let cartTotalProducts = 0;

    // Creo un for para recorrer el array con los productos en el carrito
    for (let product of cartProducts){
        cartTotalProducts += product.quantity;
    }

    // Creo primero el innerHTML vacío para que se borre lo que haya, y luego reemplazo con el valor total
    cartIcon.innerHTML = "";
    cartIcon.innerHTML = `<img src="../media/icons/carrito.svg" alt="Ícono Carrito de Compras"><p class="contadorCarrito">${cartTotalProducts}</p>`;

    // Guardo los datos en localStorage para poder mostrarlos en la página carrito
    localStorage.setItem("cartTotalProducts", JSON.stringify(cartTotalProducts));
}


// Creo un botón con jQuery mediante el cual se van a cargar más productos a la página
$("#cargarProductos").append(
    `<button class="cargarProductos__BTN-Load">Cargar Más Productos</button>`
)

// Capturo el botón en una variable
let buttonLoadProducts = document.getElementById("cargarProductos");

// Agrego el evento click al botón y qué va a pasar cuando lo clickeen
buttonLoadProducts.addEventListener("click", (e) => {
    bringProducts();
})

// Creo una función para llamar al JSON con los datos
async function bringProducts () {
    let response = await fetch('../data/base-de-productos.json');
    let bbddProd = await response.json();

    // Creo un ciclo for para crear los productos cuando clickean el botón "Cargar Productos"
    for (const Product of bbddProd) {
    
        // Declaro una variable donde voy a almacenar el precio final de cada producto que se va a mostrar luego en el sitio
        let productFinalPrice = '';

        // Creo una función para calcular el precio final del producto
        function calculateProductFinalPrice() {

            // Declaro una variable para calcular el valor de los productos que me traigo del JSON y luego almacenarlos
            let productPrice = parseFloat(
                    (Product.basePrice * Product.profit).toFixed(2)
                );

            // Declaro una variable y sumo el IVA al precio del producto, para obtener el precio final
            let productFinalPrice = productPrice * 1.21;
            
            // Limito los decimales para que solo se muestren 2
            productFinalPrice = parseFloat(productFinalPrice.toFixed(2));
            
            // Retorno la variable para poder mostrarla
            return Math.ceil(productFinalPrice);
        }

        // Llamo a la variable y ejecuto la función para calcular el precio final del producto
        productFinalPrice = calculateProductFinalPrice();
        
    
        // Creo los elementos con jQuery
        $("#listaProductos").append(
            `<article class="PRODUCTOS__ITEM" category="${Product.category}">
                <img src="${Product.image}" class="PRODUCTO__ITEM__IMG">\n
                <h3>${Product.name}</h3>\n
                <h4>Categoría: ${Product.category}</h4>\n
                <span class="PRODUCTOS__ITEM__COLOR">$${productFinalPrice}</span>
                <button class="PRODUCTOS__ITEM__BTN" id="${Product.dataId}">Agregar al Carrito</button>
            </article>`
        );
    
        // Agrego evento al botón comprar y la función para agregar el producto al carrito
        $(`#${Product.dataId}`).on('click', addToCart)
    }
}


// FILTRAR PRODUCTOS
// Cuando cargue el documento, cargo por defecto todos los productos
window.onload = () => {
    // Le agrego una clase al botón "todos" para marcar que son los que se están mostrando
    $('.FILTROS__BTN[category="todos"]').addClass('ACTIVE');

    // Llamó a los elementos con class "FILTROS__BTN", les agrego un llamado mediante "click", y les paso la función a ejecutar
    $('.FILTROS__BTN').click(function() {
        // Creo una variable donde guardo el atributo "category" del elemento clickeado
        let productCategory = $(this).attr('category');

        // Capturo los elementos con clase "FILTROS__BTN" y le borro la clase "ACTIVE" al que la tenga asignada
        $('.FILTROS__BTN').removeClass('ACTIVE');
        // Capturo el elemento clickeado y le asigno la clase "ACTIVE" para mostrar que esa es la categoría de los productos que se muestran
        $(this).addClass('ACTIVE');

        // Oculto todos los elementos que contengan la clase ".PRODUCTOS__ITEM"
        $('.PRODUCTOS__ITEM').hide();
        // Y después muestro soolo los productos que tienen la categoría que el usuario quiere ver
        $(`.PRODUCTOS__ITEM[category="${productCategory}"]`).show();
    })

    // Seteo que por defecto se muestren todas las categorías cuando el usuario abre la página
    $('.FILTROS__BTN[category="todos"]').click(function() {
        $('.PRODUCTOS__ITEM').show();
    })
}