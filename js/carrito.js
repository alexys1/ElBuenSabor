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
            <span>${producto.nombre} x${producto.cantidad} - S/${producto.subtotal.toFixed(2)}</span>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">❌</button>
        `;
        carritoItems.appendChild(item);
    });

    // Actualiza el precio total
    totalPrecioElement.textContent = `Total: S/${totalPrecio.toFixed(2)}`;

    // Actualiza el contador del carrito con la suma de las cantidades
    const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    carritoContador.textContent = totalProductos;

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
// Añade un producto al carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.nombre === producto.nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1; // Incrementa la cantidad
        productoExistente.subtotal += producto.precio; // Incrementa el subtotal
    } else {
        carrito.push({
            ...producto,
            cantidad: 1, // Inicializa la cantidad
            subtotal: producto.precio // Inicializa el subtotal
        });
    }

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

// Muestra la boleta emergente tras un pago exitoso

// Muestra la boleta emergente tras un pago exitoso
// Muestra la ventana inicial tras un pago exitoso
function mostrarBoletaEmergente(carritoFinal, totalFinal, vuelto, montoPagado) {
    const sombra = document.createElement("div");
    sombra.id = "boleta-sombra";
    document.body.appendChild(sombra);

    const boleta = document.createElement("div");
    boleta.id = "boleta-emergente";

    boleta.innerHTML = `
        <img src="img/BOLETA.png" alt="Compra Exitosa">
        <h2>¡Gracias por su compra!</h2>
        <p>Tu pago ha sido procesado exitosamente.</p>
        <button id="ver-boleta">Ver Boleta</button>
        <button id="cerrar-boleta">Cerrar</button>
    `;
    document.body.appendChild(boleta);

    // Mostrar boleta
    sombra.style.display = "block";
    boleta.style.display = "block";

    // Evento para cerrar la ventana emergente
    document.getElementById("cerrar-boleta").addEventListener("click", () => {
        sombra.remove();
        boleta.remove();
    });

    // Evento para mostrar los detalles de la boleta
    document.getElementById("ver-boleta").addEventListener("click", () => mostrarDetallesBoleta(carritoFinal, totalFinal, vuelto, montoPagado));
}

// Muestra los detalles de la boleta (se activa con el botón Ver Boleta)
function mostrarDetallesBoleta(carritoFinal, totalFinal, vuelto, montoPagado) {
    const boleta = document.getElementById("boleta-emergente");

    // Crear filas de la tabla
    const filasProductos = carritoFinal.map(producto => `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>S/${producto.precio.toFixed(2)}</td>
            <td>S/${producto.subtotal.toFixed(2)}</td>
        </tr>
    `).join('');

    // Contenido de la boleta
    boleta.innerHTML = `
        <h2>Boleta de Compra</h2>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${filasProductos}
            </tbody>
        </table>
        <div class="totales">
            
            <p><strong>Total:</strong> S/${totalFinal.toFixed(2)}</p>
    <p><strong>Efectivo:</strong> S/${montoPagado.toFixed(2)}</p>
            <p><strong>Vuelto:</strong> S/${vuelto.toFixed(2)}</p>
        </div>
        <button id="cerrar-detalles-boleta">Cerrar</button>
    `;

    // Evento para cerrar los detalles de la boleta
    document.getElementById("cerrar-detalles-boleta").addEventListener("click", () => {
        document.getElementById("boleta-sombra").remove();
        boleta.remove();
    });
}



// Función de pago
function handlePago() {
    const montoPagoInput = document.getElementById("monto-pago");
    const montoPago = parseFloat(montoPagoInput.value);

    // Validar si el monto ingresado es válido
    if (isNaN(montoPago) || montoPago <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return; // Detener la ejecución si el monto no es válido
    }

    // Validar si el monto es suficiente
    if (montoPago < totalPrecio) {
        alert("El monto ingresado no es suficiente para completar la compra.");
        return; // Detener la ejecución si el monto es insuficiente
    }

    // Capturar el vuelto, carrito y total antes de vaciar
    const vuelto = (montoPago - totalPrecio);
    const carritoFinal = [...carrito];
    const totalFinal = totalPrecio;

    // Vaciar el carrito
    carrito = [];
    totalPrecio = 0;
    actualizarCarrito();

    // Mostrar boleta emergente con los datos capturados
    mostrarBoletaEmergente(carritoFinal, totalFinal, vuelto, montoPago);

    // Limpiar el campo de pago
    montoPagoInput.value = "";
}


// Registrar el evento de pago
document.getElementById("btn-pagar").addEventListener("click", handlePago);



// Mostrar y ocultar el carrito
document.getElementById("carrito-flotante").addEventListener("click", () => {
    const carritoDetalles = document.getElementById("carrito-detalles");
    carritoDetalles.style.display =
            carritoDetalles.style.display === "block" ? "none" : "block";
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
