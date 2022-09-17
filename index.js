class Manga {
    constructor(id, marca, formato, titulo, autor, stock, precio){
        this.id = id;
        this.marca = marca;
        this.formato = formato;
        this.titulo = titulo;
        this.autor = autor;
        this.stock = stock;
        this.precio = precio;
    }
    venta(cantidad){
        this.stock -= cantidad;
    }
}

const manga = [
    new Manga(1, "Ivrea", "b6 doble", "Shaman king", "Hiroyuki Takei", 30, 1700),
    new Manga(2, "Ivrea", "tanko", "Chainsaw man", "Tatsuki Fujimoto", 15, 750),
    new Manga(3, "Panini", "tanko", "Berserk", "Kentaro Miura", 10, 1100),
    new Manga(4, "Ivrea", "b6", "Mushihime", "Masaya Hokazono", 15, 850),
    new Manga(5, "Ivrea", "b6", "Alice in Borderland", "Haro Aso", 14, 1700)
];

class Precios {
    constructor(marca, formato, precio){
        this.marca = marca;
        this.formato = formato;
        this.precio = precio;
    }
};

const preciosMarca = [
    new Precios("Ivrea", "tanko", 750),
    new Precios("Ivrea", "b6", 850),
    new Precios("Ivrea", "b6 doble", 1700),
    new Precios("Ivrea", "a5", 2000),
    new Precios("Panini", "tanko", 1100),
    new Precios("Panini", "b6 doble", 1700),
    new Precios("Panini", "a5", 1900),
    new Precios("Ovni press", "b6", 990),
    new Precios("Ovni press", "b6 doble", 1750)
];

let carrito = [];

const contenedor = document.getElementById("contenedor");
const carritoComprasHTML = document.getElementById("carrito");
const totalCompra = document.getElementById("total");
const vaciar = document.getElementById("boton-vaciar");
const agregarNuevoManga = document.getElementById("agregar-manga");
const formulario = document.getElementById("formulario");

manga.forEach(producto => {
    const div = document.createElement(`div`);
    if (producto.stock > 0){
        let divHTML = `
        <div class="mostrar-productos">
            <h3 class="titulo-manga">"${producto.titulo}"</h3>
            <p>Autor: ${producto.autor}<br>
            Editorial: ${producto.marca} <br>
            Formato: ${producto.formato}<br>
            Precio: <b>$${producto.precio}</b></p>
            <button id="agregar-prod", onclick="agregarProducto(${producto.id})">Agregar al carrito</button>
        </div>
        `;
        div.innerHTML +=divHTML;
    }
    contenedor.append(div);
});

const agregarProducto = (id) => {
    let producto = manga.find((producto) => producto.id === id);
    let productoEnCarrito = carrito.find(producto => producto.id === id);
    if (productoEnCarrito){
        producto.cantidad++;
    } else {
        producto.cantidad = 1
        carrito.push(producto);
    }
    renderizarCarrito();
    calcularTotal();
} 

let renderizarCarrito = () =>{
    let carritoHTML = "";
    carrito.forEach((prod, id) => {
        carritoHTML += `
        <div class="prod-en-carrito">
            <h3>"${prod.titulo}"</h3>
            <p>Precio: ${prod.precio}<br>
            Cantidad: ${prod.cantidad}<br>
            <button onclick="eliminarProdCarrito(${id})">Eliminar</button>
        </div>            
        `
    });
    carritoComprasHTML.innerHTML = carritoHTML;
}

let calcularTotal = () => {
    let total = 0;
    carrito.forEach(prod => {
        total += prod.precio * prod.cantidad;
    });
    totalCompra.innerHTML = `<b>$${total}</b>`
}

let eliminarProdCarrito = (id) => {
    carrito[id].cantidad--;
    if(carrito[id].cantidad === 0){
        carrito.splice(id, 1);
    }
    renderizarCarrito();
    calcularTotal();
}

let vaciarCarrito = () => {
    carrito = [];
    renderizarCarrito();
    calcularTotal();
}

vaciar.addEventListener("click", vaciarCarrito);

let nuevoManga = () =>{
    const div = document.createElement(`div`)
    let cargarHTML = `
    <form id="formulario-carga"><!--marca, formato, titulo, autor, stock, precio-->
        <label for="marca">Marca: </label>
        <select id="marca" name="marca" required>
            <option>Ivrea</option>
            <option>Panini</option>
            <option>Ovni press</option>
        </select><br>
        <label for="formato">Formato: </label>
        <select id="formato" name="formato" required>
            <option>tanko</option>
            <option>b6</option>
            <option>b6 doble</option>
            <option>a5</option>
        </select><br>
        <label for="titulo">Titulo:</label>
        <input id="titulo" name="titulo" type="text" required><br>
        <label for="autor">Autor:</label>
        <input id="autor" name="autor" type="text" required><br>
        <label for="stock">Stock:</label>
        <input id="stock" name="stock" type="number" min="0" required><br>
        <button type="submit">Cargar</button>
    </form>
    
    `
    formulario.append(div);
    formulario.innerHTML = cargarHTML;
}

agregarNuevoManga.addEventListener("click", nuevoManga);

formulario.addEventListener("submit", (e) =>{
    e.preventDefault();
    let numId = manga.length +1;
    let ingresoMarca = document.getElementById("marca").value;
    let ingresoFormato = document.getElementById("formato").value;
    let ingresoTitulo = document.getElementById("titulo").value;
    let ingreoAutor = document.getElementById("autor").value;
    let ingresoStock = document.getElementById("stock").value;
    manga.push(
        new Manga(
            numId,
            ingresoMarca, 
            ingresoFormato,
            ingresoTitulo,
            ingreoAutor,
            ingresoStock,
            0
        )
    );

    let producto = preciosMarca.find(item => (item.marca === manga[numId-1].marca) && (item.formato === manga[numId-1].formato))
    manga[numId-1].precio = producto.precio;
    agregarAlListado(numId-1);
    formulario.innerHTML = ""; 
} )

let agregarAlListado = (id) => {
    const div = document.createElement(`div`);
    if (manga[id].stock > 0){
        let divHTML = `
        <div class="mostrar-productos">
            <h3 class="titulo-manga">"${manga[id].titulo}"</h3>
            <p>Autor: ${manga[id].autor}<br>
            Editorial: ${manga[id].marca} <br>
            Formato: ${manga[id].formato}<br>
            Precio: <b>$${manga[id].precio}</b></p>
            <button id="agregar-prod", onclick="agregarProducto(${manga[id].id})">Agregar al carrito</button>
        </div>
        `;
        div.innerHTML +=divHTML;
    }
    contenedor.append(div);    
}