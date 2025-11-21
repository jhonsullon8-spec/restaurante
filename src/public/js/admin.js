// ==========================
// 🔐 Validación de acceso
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuario") || "null");

  if (!user || user.role !== "admin") {
    window.location.href = "/";
    return;
  }

  detectarCategoria();
});

// ==========================
// 📂 Detectar categoría según URL
// ==========================
function detectarCategoria() {
  const path = window.location.pathname;

  if (path.startsWith("/admin/menu/")) {
    const categoria = decodeURIComponent(path.split("/")[3]);
    cargarCategoria(categoria);
  } else {
    cargarCategoria();
  }
}

// ==========================
// 🧭 Navegación SPA
// ==========================
document.querySelectorAll(".sidebar a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const url = link.getAttribute("href"); // mejor link que target
    history.pushState({}, "", url);
    detectarCategoria(); // ✅ corregido
  });
});

window.addEventListener("popstate", detectarCategoria);

// ==========================
// 🏠 Botón volver al inicio
// ==========================
document.getElementById("btn-volver").onclick = () => {
  window.location.href = "/admin"; // ✅ vuelve al index con /admin
};
