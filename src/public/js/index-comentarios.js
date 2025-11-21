// ============================
// 💬 SECCIÓN DE COMENTARIOS
// ============================

// Referencias a elementos del DOM
const form = document.getElementById("form-comentario");
const lista = document.getElementById("lista-comentarios");
const filtros = document.querySelectorAll(".filter-btn");

// Recuperar usuario desde localStorage (persistencia)
const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

// 👉 OCULTAR FORMULARIO SI ES ADMIN
if (usuario && usuario.role === "admin") {
  if (form) form.remove();
}


if (!usuario) {
  if (form) {
    Array.from(form.elements).forEach(el => el.disabled = true);

    const aviso = document.createElement("p");
    aviso.textContent = "Para escribir un comentario, debes iniciar sesión.";
    aviso.classList.add("aviso-login");  // <-- aquí usamos la clase CSS
    form.parentNode.insertBefore(aviso, form);
  }
}



const isAdmin = usuario && usuario.role === "admin";

// ============================
// 📝 EVENTO: Envío del formulario de comentario
// ============================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const comentario = document.getElementById("comentario").value.trim();
    const estrellas = document.querySelector('input[name="estrellas"]:checked')?.value;

    if (!estrellas) {
      alert("Por favor selecciona una puntuación.");
      return;
    }

    try {
      const res = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre,
          comentario,
          estrellas,
          usuario_id: usuario.id // ✅ importante
        })
      });

      const data = await res.json();
      alert(data.mensaje);
      form.reset();
      cargarComentarios();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Hubo un problema al enviar el comentario.");
    }
  });
}

// ============================
// 🔄 FUNCIÓN: Cargar y mostrar comentarios
// ============================
async function cargarComentarios(filtro = "all") {
  if (!lista) return;

  try {
    const res = await fetch("/api/comentarios", { credentials: "include" });
    const comentarios = await res.json();

    const filtrados = filtro === "all"
      ? comentarios
      : comentarios.filter(c => c.estrellas == filtro);

    lista.innerHTML = filtrados.map(c => `
      <div class="comentario" data-id="${c.id}">
        <div class="cabecera-comentario">
          <strong>${c.nombre}</strong>
          <span class="estrellas">${"⭐".repeat(c.estrellas)}</span>
        </div>
        <p>${c.comentario}</p>
        <small>${new Date(c.fecha).toLocaleDateString()}</small>

 ${usuario && Number(usuario.id) === Number(c.usuario_id)
  ? `
    <div class="comentario-botones">
      <button class="btn-editar" data-id="${c.id}">Editar</button>
      <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
    </div>
  `
  : isAdmin
    ? `<div class="comentario-botones">
        <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
       </div>`
    : ""
}


      </div>
    `).join("");

    if (filtrados.length === 0) {
      lista.innerHTML = "<p class='sin-comentarios'>No hay comentarios con esa puntuación.</p>";
    }

  } catch (error) {
    console.error("Error al cargar comentarios:", error);
  }
}

// ============================
// 🚀 EVENTO: Eliminar y editar comentarios
// ============================
if (lista) {
  lista.addEventListener("click", async (e) => {
    const eliminarBtn = e.target.closest(".btn-eliminar");
    const editarBtn = e.target.closest(".btn-editar");

    // ======================
    // Eliminar comentario
    // ======================
    if (eliminarBtn) {
      const id = eliminarBtn.dataset.id;
      if (!id) return;

      if (confirm("¿Deseas eliminar este comentario?")) {
        try {
          const res = await fetch(`/api/comentarios/${id}`, {
            method: "DELETE",
            credentials: "include"
          });

          const data = await res.json();
          alert(data.mensaje);
          cargarComentarios();
        } catch (error) {
          console.error(error);
          alert("No se pudo eliminar el comentario.");
        }
      }
      return;
    }

    // ======================
    // Editar comentario
    // ======================
    if (editarBtn) {
      const id = editarBtn.dataset.id;

      const nuevo = prompt("Edita tu comentario:");
      if (!nuevo || nuevo.trim() === "") {
        alert("El comentario no puede estar vacío.");
        return;
      }

      try {
        const res = await fetch(`/api/comentarios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comentario: nuevo.trim() })
        });

        const data = await res.json();
        alert(data.mensaje);
        cargarComentarios();
      } catch (error) {
        console.error(error);
        alert("No se pudo editar.");
      }
    }
  });
}

// ============================
// ⭐ EVENTOS: Filtrar comentarios por cantidad de estrellas
// ============================
filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const estrellas = btn.dataset.estrellas;
    cargarComentarios(estrellas);
  });
});

// ============================
// 🚀 CARGA INICIAL
// ============================
cargarComentarios();
