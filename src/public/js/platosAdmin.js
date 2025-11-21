const API = "/api/platos";
const form = document.getElementById("form-plato");
const idField = document.getElementById("id");
const platosSection = document.getElementById("platos-section");
const formSection = document.getElementById("form-section");
const formTitle = document.getElementById("form-title");

// ==========================
// 📂 Cargar platos
// ==========================
function cargarCategoria(categoria = null) {
  fetch(API)
    .then(res => res.json())
    .then(platos => {
      const container = document.getElementById("platos-container");
      container.innerHTML = "";

      const filtrados = categoria
        ? platos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
        : platos;

      if (filtrados.length === 0) {
        container.innerHTML = "<p>No hay platos en esta categoría.</p>";
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
            </div>

            <div class="acciones">
              <button class="btn-editar">✏️ Editar</button>
              <button class="btn-eliminar">🗑️ Eliminar</button>
            </div>
          </div>
        `;

        div.querySelector(".btn-editar").addEventListener("click", () =>
          editarPlato(plato)
        );
        div.querySelector(".btn-eliminar").addEventListener("click", () => eliminarPlato(plato.id));

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error al cargar los platos:", err);
      document.getElementById("platos-container").innerHTML = "<p>⚠️ Error al cargar los platos.</p>";
    });
}

// ==========================
// ✏️ Editar / Nuevo plato
// ==========================
function editarPlato(plato) {
  idField.value = plato.id;
  document.getElementById("nombre").value = plato.nombre;
  document.getElementById("descripcion").value = plato.descripcion;
  document.getElementById("precio").value = plato.precio;
  document.getElementById("categoria").value = plato.categoria;


  formTitle.textContent = "✏️ Editar Plato";
  platosSection.classList.add("hidden");
  formSection.classList.remove("hidden");
}

function nuevoPlato() {
  idField.value = "";
  form.reset();
  formTitle.textContent = "➕ Nuevo Plato";
  platosSection.classList.add("hidden");
  formSection.classList.remove("hidden");
}

// ==========================
// 💾 Guardar / Actualizar con FormData
// ==========================
form.addEventListener("submit", e => {
  e.preventDefault();

  const id = idField.value;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/${id}` : API;

  const formData = new FormData(form);

  fetch(url, {
    method,
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      alert("✅ Cambios guardados correctamente");
      volverLista();
      cargarCategoria();
    })
    .catch(err => console.error("Error al guardar:", err));
});

// ==========================
// 🗑️ Eliminar plato
// ==========================
function eliminarPlato(id) {
  if (confirm("¿Seguro que quieres eliminar este plato?")) {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => cargarCategoria())
      .catch(err => console.error("Error al eliminar:", err));
  }
}

// ==========================
// 🔙 Volver a lista
// ==========================
function volverLista() {
  formSection.classList.add("hidden");
  platosSection.classList.remove("hidden");
}
