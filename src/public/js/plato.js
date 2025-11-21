// Obtener el slug de la URL
const pathParts = window.location.pathname.split("/");
const slug = pathParts[pathParts.length - 1];

fetch(`/api/platos/slug/${slug}`)
  .then(res => {
    if (!res.ok) throw new Error("Plato no encontrado");
    return res.json();
  })
  .then(data => {
    document.getElementById("plato-nombre").textContent = data.nombre;
    document.getElementById("plato-descripcion").textContent = data.descripcion;
    document.getElementById("plato-precio").textContent = "S/ " + data.precio;
    document.getElementById("plato-img").src = data.imagen;
    document.getElementById("plato-img").alt = data.nombre;
  })
  .catch(err => {
    console.error("❌ ERROR FETCH:", err);
    document.getElementById("plato-nombre").textContent = "Plato no encontrado";
  });
