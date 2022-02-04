/*
@challenge 
 
@version: v4.0.0
@author: Nahuel Di Biase
@fecha: XX/01/2022
 
History:
- v4.0.0 – Entrega del proyecto final
*/

// CÓDIGO DE ACÁ EN ADELANTE


// Creo la clase Producto con sus métodos para cargar los productos
class Producto {
    constructor(id, dataId, categoria, nombre, imagen, precioBase, ganancia) {
        this.id = id;
        this.dataId = dataId;
        this.categoria = categoria;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precioBase = parseFloat(precioBase);
        this.ganancia = parseFloat(ganancia);
        this.precioProducto = parseFloat((this.precioBase*this.ganancia).toFixed(2));
    }
    sumarIva() {
        this.precioFinalProducto = this.precioProducto * 1.21;
    }
    limitarDecimales(){
        this.precioFinalProducto = parseFloat(this.precioFinalProducto.toFixed(2));
    }
}


// Creo la clase ProductoCarrito donde guardaré los productos que el usuario sume al carrito para comprar
class ProductoCarrito {
    constructor(id, nombre, precio, imagen, cantidad, subtotal) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1;
        this.subtotal = precio;
    }
}


// Creo un Array para almacenar los productos cargados
const BASEDEPRODUCTOS = [];
// Instancio los objetos y los pusheo dentro del Array
BASEDEPRODUCTOS.push (new Producto(1,"P1","Procesador", "Procesador Intel Core i7 12700k 12th Gen 3.6Ghz LGA1700", "./media/imgs/ORIGINALES/intel-i7-12th.jpg", 7345, 1.5));
BASEDEPRODUCTOS.push (new Producto(2,"P2","Memoria Ram", "Memoria Corsair Vengeance Pro 2x 8Gb 3600Mhz DDR4", "./media/imgs/ORIGINALES/corsair-vengeance-pro.jpg", 3150, 1.5));
BASEDEPRODUCTOS.push (new Producto(3,"P3","Motherboard", "Mother Aorus B550 Master Socket AM4", "./media/imgs/ORIGINALES/aorus-b550-master.jpg", 5720, 1.5));
BASEDEPRODUCTOS.push (new Producto(4,"P4","SSD", "SSD M.2 NVME Seagate Firecuda 1Tb Gen3 X4", "./media/imgs/ORIGINALES/seagate-firecuda.jpg", 1875, 1.5));
BASEDEPRODUCTOS.push (new Producto(5,"P5","Fuente de Alimentación", "Fuente Seasonic Focus PX-850 850w 80+ Platinum", "./media/imgs/ORIGINALES/seasonic-focus-px850.jpg", 2895, 1.5));
BASEDEPRODUCTOS.push (new Producto(6,"P6","Placa de Video", "Placa de Video Aorus RTX 3080Ti Xtreme 12Gb", "./media/imgs/ORIGINALES/aorus-rtx-3080ti-xtreme-12g.jpg", 15620, 1.5));
BASEDEPRODUCTOS.push (new Producto(7,"P7","Gabinete", "Gabinete Corsair Crystal Series 680X ATX Dual Chamber", "./media/imgs/ORIGINALES/corsair-crystal-series 680x.jpg", 8935, 1.5));
BASEDEPRODUCTOS.push (new Producto(8,"P8","Monitor", "Monitor LG Ultragear 21:9 34 pulgadas 34GP950G-B", "./media/imgs/ORIGINALES/lg-ultragear-34gp950g-b-34.jpg", 19360, 1.5));

// Uso el for ... of para modificarlos usando los métodos de la clase producto
for (const Producto of BASEDEPRODUCTOS) {
    Producto.sumarIva();
    Producto.limitarDecimales();
};

// Recorro el Array con los productos para crearlos
BASEDEPRODUCTOS.forEach(crearProducto);

// Desarrollo la función para crear los productos en el HTML en base a los objetos creados con la Clase Producto y luego almacenados en el Array
function crearProducto(Producto) {
    // Creo la variable para almacenar el producto creado
    let contenedorProducto = document.createElement("article");

    // Creo el elemento a inyectar en el HTML
    contenedorProducto.innerHTML = `<img src="${Producto.imagen}" class="PRODUCTO__ITEM__IMG">\n
                                    <h3>${Producto.nombre}</h3>\n
                                    <h4>Categoría: ${Producto.categoria}</h4>\n
                                    <span class="PRODUCTOS__ITEM__COLOR">$${Math.ceil(Producto.precioFinalProducto)}</span>
                                    <button class="PRODUCTOS__ITEM__BTN" id="${Producto.dataId}">COMPRAR</button>`;

    // Le asigno la clase CSS al elemento creado
    contenedorProducto.classList.add("PRODUCTOS__ITEM");

    // Le asigno el atributo categoria
    contenedorProducto.setAttribute("category", `${Producto.categoria}`);

    // Llamo al elemento padre y le asino los hijos
    document.getElementById("listaProductos").appendChild(contenedorProducto);

    // Agrego evento al botón comprar y la función para agregar el producto al carrito
    document.getElementById(`${Producto.dataId}`).addEventListener("click", agregarAlCarrito)

    // Recupero el carrito
    let carritoLocal = JSON.parse(localStorage.getItem("carrito"));
    // Si la cantidad de productos es mayor a null (null == vacío en este caso), muestro la cantidad de productos que tiene el carrito
    if (carritoLocal) {

        carritoTotal(carritoLocal);
    }
}


// Creo un array donde guardaré los productos que el usuario agregue al carrito de compras
let carrito = [];

// Creo una función para poder agregar los productos al carrito
function agregarAlCarrito(e) {

    // Recupero el carrito
    let carritoLocal = JSON.parse(localStorage.getItem("carrito"));

    // Si hay algún producto guardado en el carrito antes, lo guardo en el array
    if (carritoLocal) {
        carrito = carritoLocal;
    }

    // Busco si el producto que clickea el usuario ya está almacenado
    let index = carrito.findIndex(producto => producto.id == e.target.id);
    
    // Variables para almacenar los datos del producto que necesito operar en el carrito
    // console.log(Number(e.target.parentNode.children[3].textContent.slice(1)))
    let idProducto = e.target.id;
    let nombreProducto = e.target.parentNode.children[1].textContent;
    let precioProducto = Number(e.target.parentNode.children[3].textContent.slice(1)); // Capturo el texto con el valor, con el método .splice(1) borro el primer caracter, que es el símbolo $, y con el método Number() lo transformo de string a numer para poder usarlo como tal
    let imagenProducto = e.target.parentNode.children[0].src;

    // Si el producto no está almacenado, lo creo, y si está creado, incremento la cantidad del producto
    if (index == -1) {
        // Pusheo los datos al array para guardarlos
        carrito.push (new ProductoCarrito(idProducto, nombreProducto, precioProducto, imagenProducto));
    } else {
        // Incremento la cantidad del producto seleccionado
        carrito[index].cantidad ++;
        // Multiplico precio por cantidad para tener el subtotal
        carrito[index].subtotal = carrito[index].precio * carrito[index].cantidad;
    }

    // Guardo el CARRITO en el local storage para persistirlo
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Llamo a la función carritoTotal() para que se ejecute y me sume al total de productos el que agregué
    carritoTotal(carrito);
}

// Creo una función para obtener el total de productos en el carrito y mostrarlos en el botón con el ícono del carrito en el NAV
function carritoTotal(productosCarrito) {

    // Llamo mediante ID al ícono del carrito, donde luego mostraré la cantidad de productos que contiene
    let iconoCarrito = document.getElementById("carritoDisplay");

    // Creo una variable donde guardaré la cantidad total de productos que contiene el carrito
    let totalProductosCarrito = 0;

    // Creo un for para recorrer el array con los productos en el carrito
    for (let producto of productosCarrito){
        totalProductosCarrito += producto.cantidad;
    }

    // Creo primero el innerHTML vacío para que se borre lo que haya, y luego reemplazo con el valor total
    iconoCarrito.innerHTML = "";
    iconoCarrito.innerHTML = `<img src="./media/icons/Carrito.svg" alt="Ícono Carrito de Compras"><p class="contadorCarrito">${totalProductosCarrito}</p>`;

    // Guardo los datos en localStorage para poder mostrarlos en la página carrito
    localStorage.setItem("totalProductosCarrito", JSON.stringify(totalProductosCarrito));
}


// Creo un botón con jQuery mediante el cual se van a cargar más productos a la página
$("#cargarProductos").append(
    `<button class="cargarProductos__BTN-Load">Cargar Más Productos</button>`
)

// Capturo el botón en una variable
let botonCargar = document.getElementById("cargarProductos");

// Agrego el evento click al botón y qué va a pasar cuando lo clickeen
botonCargar.addEventListener("click", (e) => {
    traerProductos();
})

// Creo una función para llamar al JSON con los datos
async function traerProductos () {
    let response = await fetch('./data/base-de-productos.json');
    let bbddProd = await response.json();

    // Creo un ciclo for para crear los productos cuando clickean el botón "Cargar Productos"
    for (const Producto of bbddProd) {
    
        // Declaro una variable donde voy a almacenar el precio final de cada producto que se va a mostrar luego en el sitio
        let precioFinalProducto = '';

        // Creo una función para calcular el precio final del producto
        function calcularPrecioFinalProducto() {

            // Declaro una variable para calcular el valor de los productos que me traigo del JSON y luego almacenarlos
            let precioProducto = parseFloat(
                    (Producto.precioBase * Producto.ganancia).toFixed(2)
                );

            // Declaro una variable y sumo el IVA al precio del producto, para obtener el precio final
            let precioFinalProducto = precioProducto * 1.21;
            
            // Limito los decimales para que solo se muestren 2
            precioFinalProducto = parseFloat(precioFinalProducto.toFixed(2));
            
            // Retorno la variable para poder mostrarla
            return Math.ceil(precioFinalProducto);
        }

        // Llamo a la variable y ejecuto la función para calcular el precio final del producto
        precioFinalProducto = calcularPrecioFinalProducto();
        
    
        // Creo los elementos con jQuery
        $("#listaProductos").append(
            `<article class="PRODUCTOS__ITEM" category="${Producto.categoria}">
                <img src="${Producto.imagen}" class="PRODUCTO__ITEM__IMG">\n
                <h3>${Producto.nombre}</h3>\n
                <h4>Categoría: ${Producto.categoria}</h4>\n
                <span class="PRODUCTOS__ITEM__COLOR">$${precioFinalProducto}</span>
                <button class="PRODUCTOS__ITEM__BTN" id="${Producto.dataId}">Agregar al Carrito</button>
            </article>`
        );
    
        // Agrego evento al botón comprar y la función para agregar el producto al carrito
        $(`#${Producto.dataId}`).on('click', agregarAlCarrito)
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
        let categoriaProducto = $(this).attr('category');

        // Capturo los elementos con clase "FILTROS__BTN" y le borro la clase "ACTIVE" al que la tenga asignada
        $('.FILTROS__BTN').removeClass('ACTIVE');
        // Capturo el elemento clickeado y le asigno la clase "ACTIVE" para mostrar que esa es la categoría de los productos que se muestran
        $(this).addClass('ACTIVE');

        // Oculto todos los elementos que contengan la clase ".PRODUCTOS__ITEM"
        $('.PRODUCTOS__ITEM').hide();
        // Y después muestro soolo los productos que tienen la categoría que el usuario quiere ver
        $(`.PRODUCTOS__ITEM[category="${categoriaProducto}"]`).show();
    })

    // Seteo que por defecto se muestren todas las categorías cuando el usuario abre la página
    $('.FILTROS__BTN[category="todos"]').click(function() {
        $('.PRODUCTOS__ITEM').show();
    })
}