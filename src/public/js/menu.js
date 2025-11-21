const API = "/api/platos";

// ✅ Normalizar categorías: "Plato-Principal" → "plato principal"
function normalizarCategoria(cat) {
  return cat.replace(/-/g, " ").toLowerCase();
}

// 📌 Cargar platos por categoría
function cargarCategoria(categoria = null) {
  fetch(API)
    .then(res => res.json())
    .then(platos => {
      const container = document.getElementById("platos-container");
      container.innerHTML = "";

      const filtrados = categoria
        ? platos.filter(p =>
          p.categoria.toLowerCase() === normalizarCategoria(categoria)
        )
        : platos;

      if (filtrados.length === 0) {
        container.innerHTML = "<p>No hay platos disponibles en esta categoría.</p>";
        return;
      }

      filtrados.forEach(plato => {
        const div = document.createElement("div");
        div.classList.add("plato-card");
        div.innerHTML = `
  <div class="plato-imagen-contenedor">
    <img src="${plato.imagen}" alt="${plato.nombre}" class="plato-img">
    <span class="plato-categoria-badge">${plato.categoria}</span>
  </div>

  <div class="plato-contenido">
    <h3 class="plato-nombre">${plato.nombre}</h3>
    <p class="plato-desc">${plato.descripcion}</p>

    <div class="plato-footer">
      <div class="plato-precio-contenedor">
        <span class="plato-precio-label">Precio</span>
        <span class="plato-precio">S/ ${plato.precio}</span>
      </div>
      <a class="btn-ver-plato" href="/plato/${plato.slug}">
        <span>Ver Plato</span>
        <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  </div>
`;

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error al cargar platos:", err);
    });
}

// 📌 Detectar categoría desde la URL
function detectarCategoriaDesdeURL() {
  const path = window.location.pathname;

  if (path.startsWith("/menu/categorias/")) {
    const categoria = decodeURIComponent(path.split("/")[3]);
    cargarCategoria(categoria);
  } else {
    cargarCategoria();
  }
}

// 📌 Interceptar clics en las categorías
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sidebar a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const url = e.target.getAttribute("href");
      history.pushState({}, "", url);
      detectarCategoriaDesdeURL();
    });
  });

  window.addEventListener("popstate", detectarCategoriaDesdeURL);

  const btnVolver = document.getElementById("btn-volver");
  if (btnVolver) {
    btnVolver.onclick = () => (window.location.href = "/");
  }

  detectarCategoriaDesdeURL();
});
