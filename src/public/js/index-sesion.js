// ============================
// 🔐 MANEJO DE SESIÓN
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const btnSesion = document.getElementById("btn-sesion");
  const enlaceMenu = document.getElementById("enlace-menu");
  const btnVolver = document.getElementById("btn-volver");

  // Obtener usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  // Si no existen los elementos, terminamos
  if (!btnSesion || !enlaceMenu) return;

  // ======================================
  // ✅ ADMIN
  // ======================================
  if (usuario && usuario.role === "admin") {
    btnSesion.textContent = "CERRAR SESIÓN";
    enlaceMenu.href = "/admin/menu";

    // 🔹 CAMBIO: Usar POST y limpiar sesión correctamente
    btnSesion.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/auth/logout", { method: "POST", credentials: "include" });
        const data = await res.json();
        if (data.ok) {
          localStorage.removeItem("usuario"); // 🔹 CAMBIO: limpiar localStorage
          window.location.href = "/";
        } else {
          alert(data.error || "No se pudo cerrar sesión.");
        }
      } catch (err) {
        console.error(err);
        alert("Error al cerrar sesión.");
      }
    });

    if (btnVolver) {
      btnVolver.addEventListener("click", () => (window.location.href = "/admin"));
    }

    return;
  }

  // ======================================
  // ✅ USUARIO NORMAL (NO ADMIN)
  // ======================================
  if (usuario) {
    btnSesion.textContent = "CERRAR SESIÓN";
    enlaceMenu.href = "/menu";

    // 🔹 CAMBIO: Usar POST y limpiar sesión correctamente
    btnSesion.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/auth/logout", { method: "POST", credentials: "include" });
        const data = await res.json();
        if (data.ok) {
          localStorage.removeItem("usuario"); // 🔹 CAMBIO: limpiar localStorage
          window.location.href = "/";
        } else {
          alert(data.error || "No se pudo cerrar sesión.");
        }
      } catch (err) {
        console.error(err);
        alert("Error al cerrar sesión.");
      }
    });
  } else {
    // Si no hay usuario
    btnSesion.textContent = "INICIAR SESIÓN";
    enlaceMenu.href = "/menu";

    btnSesion.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/login";
    });
  }

  // Botón volver al inicio
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      if (usuario && usuario.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    });
  }
});
