// ===============================
// 🎬 ANIMACIONES DE ENTRADA
// ===============================
gsap.from(".login-container", { duration: 1, y: 60, opacity: 0, ease: "power3.out" });
gsap.from(".ola", { duration: 3, opacity: 0, stagger: 0.5, y: 100, ease: "power2.out" });

// ===============================
// 🔐 MANEJO DE LOGIN
// ===============================
const form = document.getElementById("form-login");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");
    const loginContainer = document.querySelector(".login-container");

    // Validación básica
    if (!usuario || !password) {
      msg.textContent = "Por favor, completa todos los campos.";
      return;
    }

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
        credentials: "include" // 🔹 IMPORTANTE para sesión
      });

      const data = await res.json();

      if (res.ok) {
        // 🔹 Guardar información del usuario en localStorage y variable global
        const user = { id: data.id, usuario: data.usuario, role: data.role };
        window.usuario = user;
        localStorage.setItem("usuario", JSON.stringify(user));

        // 🔹 Redirigir según rol
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }

      } else {
        // Error de login
        msg.textContent = data.error || "Credenciales incorrectas.";
        loginContainer.classList.add("shake-error");
        setTimeout(() => loginContainer.classList.remove("shake-error"), 500);
      }

    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      msg.textContent = "Error de conexión con el servidor.";
    }
  });
}
