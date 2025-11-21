// ===============================
// 🔐 MANEJO DE REGISTRO
// ===============================

const form = document.getElementById("form-registrar");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if (!usuario || !password) {
      msg.textContent = "Completa todos los campos.";
      return;
    }

    try {
      const res = await fetch("/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
      });

      const data = await res.json();

      if (res.ok) {
        msg.textContent = "✅ Cuenta creada correctamente. Redirigiendo al login...";
        setTimeout(() => window.location.href = "/login", 1500);
      } else {
        msg.textContent = data.error || "No se pudo registrar.";
      }
    } catch (err) {
      console.error(err);
      msg.textContent = "Error de conexión con el servidor.";
    }
  });
}
