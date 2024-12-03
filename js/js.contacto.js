// Obtener elementos
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const form = document.querySelector("form");

// Función para mostrar el modal
function showModal() {
    modal.style.display = "flex"; // Mostrar el modal
}

// Función para cerrar el modal y limpiar el formulario
function closeModal() {
    modal.style.display = "none"; // Ocultar el modal
    form.reset(); // Limpia todos los campos del formulario
}

// Detectar envío del formulario
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar el envío real del formulario (puedes eliminar esto si deseas enviarlo al servidor)
    showModal(); // Muestra el modal
});

// Cerrar modal al hacer clic en el botón de cerrar
closeBtn.addEventListener("click", closeModal);

// Cerrar modal al hacer clic fuera de la ventana modal
window.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});