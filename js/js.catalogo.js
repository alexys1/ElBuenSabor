const searchButton = document.getElementById("botonFiltrar");
const clearButton = document.getElementById("botonBorrarFiltro");
const searchInput = document.getElementById("buscador");
const productList = document.querySelectorAll(".producto");
const popup = document.getElementById("popup");
const popupBackground = document.getElementById("popup-background");

// Mostrar ventana emergente
function showPopup(message) {
  popup.innerHTML = `
    <img src="img/triste.png" alt="Carita triste" />
    <h2>¡Lo sentimos!</h2>
    <p>${message}</p>
    <button onclick="closePopup()">Cerrar</button>
  `;
  popup.style.display = "block";
  popupBackground.style.display = "block";
}

// Cerrar ventana emergente
function closePopup() {
  popup.style.display = "none";
  popupBackground.style.display = "none";
}

// Función de búsqueda
searchButton.addEventListener("click", () => {
  const searchText = searchInput.value.toLowerCase();
  let found = false;

  productList.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    const productCategory = product.dataset.categoria.toLowerCase();

    if (productName.includes(searchText) || productCategory.includes(searchText)) {
      product.style.display = "block";
      found = true;
    } else {
      product.style.display = "none";
    }
  });

  if (!found) {
    showPopup("No encontramos resultados para tu búsqueda. Intenta con otra palabra.");
  }
});

// Función para borrar filtro
// Seleccionar el botón de borrar filtro
const botonBorrarFiltro = document.getElementById('botonBorrarFiltro');

// Función para borrar el filtro y restablecer la categoría a "Todos"
botonBorrarFiltro.addEventListener('click', () => {
    // Mostrar todos los productos
    productos.forEach((producto) => {
        producto.style.display = 'block';
    });

    // Limpiar el texto del buscador
    buscador.value = '';

    // Restablecer la barra activa a la categoría "Todos"
    categorias.forEach((categoria) => categoria.classList.remove('active'));
    const categoriaTodos = document.querySelector('[data-categoria="todos"]');
    categoriaTodos.classList.add('active');
});

// Seleccionar todas las categorías
const categorias = document.querySelectorAll('.categorias li');
const productos = document.querySelectorAll('.producto');

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    productos.forEach((producto) => {
        const categoriaProducto = producto.getAttribute('data-categoria');
        
        // Mostrar todos si la categoría seleccionada es "todos"
        if (categoria === 'todos' || categoriaProducto === categoria) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// Añadir evento de clic a cada categoría
categorias.forEach((categoria) => {
    categoria.addEventListener('click', () => {
        // Obtener la categoría seleccionada
        const categoriaSeleccionada = categoria.getAttribute('data-categoria');
        
        // Filtrar productos
        filtrarPorCategoria(categoriaSeleccionada);
        
        // Opcional: resaltar la categoría activa
        categorias.forEach((cat) => cat.classList.remove('active'));
        categoria.classList.add('active');
    });
});


