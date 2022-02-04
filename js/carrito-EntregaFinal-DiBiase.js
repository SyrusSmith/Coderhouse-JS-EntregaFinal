document.addEventListener('DOMContentLoaded', () => {
    carritoPrecioTotal(carrito);
});

// Recupero el carrito del local storage y lo guardo para operarlo
let carrito = JSON.parse(localStorage.getItem("carrito"));

// Recorro el carrito, y si tiene productos creo en el HTML cada producto que contenga
if (carrito) {
    carrito.forEach(crearProductoCarrito);
}

// Creo una función para inyectar en el HTML cada producto
function crearProductoCarrito (productoCarrito) {

    // Declaro una Variable para poder crear el elemento que va a contener a los productos que cree
    let contenedorProductoCarrito = document.createElement("tr");

    // Inyecto el HTML con los parámetros de cada producto que contenga el carrito
    contenedorProductoCarrito.innerHTML = 
        `<td><img src="${productoCarrito.imagen}"></td>
        <td>${productoCarrito.nombre}</td>
        <td>$${productoCarrito.precio}</td>
        <td>${productoCarrito.cantidad}</td>
        <td>$${productoCarrito.subtotal}</td>
        <td><button id="${productoCarrito.id}" class="btnEliminarProducto">Eliminar</button></td>`;

    // Llamo mediante ID al elemento donde se van a crear los productos, y le agrego cada hijo contenedor de cada producto
    document.getElementById("productosCarrito").appendChild(contenedorProductoCarrito);

    // let iconoCarrito = document.getElementById("carritoDisplay");
    // iconoCarrito.innerHTML = `<img src="../media/icons/Carrito.svg" alt="Ícono Carrito de Compras"><span>${TOTALPRODUCTOSCARRITO}</span>`;
}


// Creo una variable para almacenar todos los botones eliminar que tengan la clase "btnEliminarProducto"
let botonesEliminar = document.querySelectorAll(".btnEliminarProducto");

// Les agrego un evento click a todos los botones que almacené dentro de la variable "botonesEliminar" usando un forEach(), y llamo a la función "eliminarProducto" para que se ejecute
botonesEliminar.forEach(elemento => {
    elemento.addEventListener("click", eliminarProducto);
})

// Creo la función para eliminar el producto
function eliminarProducto(e) {

    // Creo una variable para almacenar el ID del producto a eliminar, el cual obtengo del array CARRITO que contiene los productos, usando el método findIndex()
    let index = carrito.findIndex(productoCarrito => productoCarrito.id == e.target.id);
    
    // con el método "splice()" elimino del array el producto con el ID que almacené dentro de la variable "Index", y le indico que quiero eliminar solo un(1) elemento del array
    carrito.splice(index, 1);

    // Usando el e.target subo hasta el elemento padre y elimino el tr con el producto y todo su contenido usando el método remove()
    e.target.parentNode.parentNode.remove();
    
    // Vuelvo a persistir el CARRITO en localStorage actualizando la cantidad de productos luego de eliminar el que quería
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Creo una variable para almacenar el botón de Vaciar Carrito
let btnVaciarCarrito = document.querySelector("#btnVaciarCarrito");

// Le agrego un evento click y le asigno la función
btnVaciarCarrito.addEventListener("click", vaciarCarrito);

// Creo la función Vaciar Carrito
function vaciarCarrito(){

    // Selecciono el elemento que tiene a todos los productos cargados del carrito
    let contenedorProductoCarrito = document.getElementById("productosCarrito");
    // Borro los elementos de la página
    contenedorProductoCarrito.remove();
    
    // Vacío el array que contiene los productos
    carrito = [];
    // Vuelvo a persistir el CARRITO en localStorage actualizando la cantidad de productos luego de eliminar el que quería
    localStorage.setItem("carrito", JSON.stringify(carrito));

    document.getElementById("precioTotal").innerHTML = `<span>PRECIO TOTAL: $${carrito}</span>`;
    document.getElementById("precioTotal").classList.add("precioTotal");
}


// Creo la función para calcular el precio total de todos los productos del carrito
function carritoPrecioTotal(productosCarrito) {
    
    // Creo una variable donde guardaré el precio total de los productos que contiene el carrito
    let totalProductosCarrito = 0;
    
    // Creo un for para recorrer el array con los productos en el carrito
    for (let producto of productosCarrito){
        totalProductosCarrito += producto.precio;
    }
    
    document.getElementById("precioTotal").innerHTML = `<span>PRECIO TOTAL: $${totalProductosCarrito}</span>`;
    document.getElementById("precioTotal").classList.add("precioTotal");
}