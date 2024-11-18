// Carga del sonido de compra
const clickSound = new Audio("sonidos/sonido-cash.mp3");

// Variables globales
let carrito = [];
let totalPrecio = 0;

// Actualiza el carrito visual y el contador
function actualizarCarrito() {
    const carritoItems = document.getElementById("carrito-items");
    const totalPrecioElement = document.getElementById("total-precio");
    const carritoContador = document.getElementById("carrito-contador");

    // Limpia el contenido del carrito
    carritoItems.innerHTML = "";

    carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("carrito-item");
        item.innerHTML = `
            <span>${producto.nombre} - S/${producto.precio.toFixed(2)}</span>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">❌</button>
        `;
        carritoItems.appendChild(item);
    });

    // Actualiza el precio total
    totalPrecioElement.textContent = `Total: S/${totalPrecio.toFixed(2)}`;

    // Actualiza el contador del carrito
    carritoContador.textContent = carrito.length;

    // Guardar en Local Storage
    guardarCarritoEnLocalStorage();
}

// Guardar el carrito en el Local Storage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar el carrito desde el Local Storage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        totalPrecio = carrito.reduce((acc, producto) => acc + producto.precio, 0);
        actualizarCarrito();
    }
}

// Añade un producto al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);
    totalPrecio += producto.precio;

    // Reinicia el vuelto a cero si se ha realizado un pago previo
    const vueltoElement = document.getElementById("vuelto");
    vueltoElement.textContent = "Vuelto: S/0.00";

    // Reproduce el sonido de compra
    clickSound.play();

    actualizarCarrito();
}


// Elimina un producto del carrito
function eliminarDelCarrito(index) {
    totalPrecio -= carrito[index].precio;
    carrito.splice(index, 1);

    actualizarCarrito();
}

// Muestra y oculta el carrito
document.getElementById("carrito-flotante").addEventListener("click", () => {
    const carritoDetalles = document.getElementById("carrito-detalles");
    carritoDetalles.style.display =
        carritoDetalles.style.display === "block" ? "none" : "block";
});

// Función de pago
document.getElementById("btn-pagar").addEventListener("click", () => {
    const montoPagoInput = document.getElementById("monto-pago");
    const montoPago = parseFloat(montoPagoInput.value);

    if (isNaN(montoPago) || montoPago <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
    }

    if (montoPago >= totalPrecio) {
        const vuelto = (montoPago - totalPrecio).toFixed(2);

        // Mostrar el vuelto
        const vueltoElement = document.getElementById("vuelto");
        vueltoElement.textContent = `Vuelto: S/${vuelto}`;

        // Vaciar carrito
        carrito = [];
        totalPrecio = 0;
        actualizarCarrito();

        // Limpiar el campo de pago
        montoPagoInput.value = "";
    } else {
        alert("El monto ingresado no es suficiente para completar la compra.");
    }
});

// Cargar el carrito al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarCarritoDesdeLocalStorage();
});
// Botón para cerrar el carrito
document.getElementById("cerrar-carrito").addEventListener("click", () => {
    const carritoDetalles = document.getElementById("carrito-detalles");
    carritoDetalles.style.display = "none";
});
