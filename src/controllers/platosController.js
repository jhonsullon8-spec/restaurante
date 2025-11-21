const db = require("../config/db");
const fs = require("fs");
const path = require("path");

function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")                     // elimina acentos
    .replace(/[\u0300-\u036f]/g, "")     // elimina diacríticos
    .replace(/[^\w\s-]/g, "")            // elimina símbolos raros
    .trim()
    .replace(/\s+/g, "-");               // espacios → guiones
}

// =======================
// OBTENER TODOS LOS PLATOS
// =======================
exports.obtenerPlatos = (req, res) => {
  const sql = "SELECT * FROM menu ORDER BY fecha_creacion DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener los platos" });
    res.json(results);
  });
};

// =======================
// OBTENER PLATO POR SLUG
// =======================
exports.obtenerPlatoPorSlug = (req, res) => {
  const { slug } = req.params;
  const sql = "SELECT * FROM menu WHERE slug=?";
  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener el plato" });
    if (results.length === 0) return res.status(404).json({ error: "Plato no encontrado" });
    res.json(results[0]);
  });
};

// =======================
// CREAR PLATO
// =======================
exports.crearPlato = (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = generarSlug(nombre);

  const sql = `
    INSERT INTO menu (nombre, descripcion, precio, categoria, imagen, slug)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nombre, descripcion, precio, categoria, imagen, slug], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al guardar el plato" });
    res.json({ mensaje: "Plato agregado con éxito!", slug, id: result.insertId });
  });
};

// =======================
// EDITAR PLATO
// =======================
exports.editarPlato = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria } = req.body;
  const slug = generarSlug(nombre);
  const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : null;

  const sqlBuscar = "SELECT imagen FROM menu WHERE id=?";
  db.query(sqlBuscar, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo imagen actual" });
    if (results.length === 0) return res.status(404).json({ error: "Plato no encontrado" });

    let imagenActual = results[0].imagen;

    // Determinar qué imagen guardar
    const imagenFinal = nuevaImagen ? nuevaImagen : imagenActual;

    const sqlUpdate = `
      UPDATE menu 
      SET nombre=?, descripcion=?, precio=?, categoria=?, imagen=?, slug=?
      WHERE id=?
    `;

    db.query(sqlUpdate, [nombre, descripcion, precio, categoria, imagenFinal, slug, id], err => {
      if (err) return res.status(500).json({ error: "Error al actualizar el plato" });

      // Si se subió nueva imagen → eliminar la anterior
      if (nuevaImagen && imagenActual) {
        const nombreViejo = imagenActual.replace("/uploads/", "");
        const rutaVieja = path.join(__dirname, "../uploads", nombreViejo);
        fs.unlink(rutaVieja, err => {
          if (err) console.log("⚠️ No se pudo eliminar la imagen anterior:", err);
          else console.log("🗑️ Imagen anterior eliminada:", nombreViejo);
        });
      }

      res.json({ mensaje: "Plato actualizado con éxito!" });
    });
  });
};

// =======================
// ELIMINAR PLATO
// =======================
exports.eliminarPlato = (req, res) => {
  const { id } = req.params;

  const sqlBuscar = "SELECT imagen FROM menu WHERE id=?";
  db.query(sqlBuscar, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo imagen" });
    if (results.length === 0) return res.status(404).json({ error: "Plato no encontrado" });

    let nombreImagen = results[0].imagen;

    // Quitar "/uploads/" para tener solo el nombre
    if (nombreImagen) {
      nombreImagen = nombreImagen.replace("/uploads/", "");
    }

    const sqlEliminar = "DELETE FROM menu WHERE id=?";
    db.query(sqlEliminar, [id], err => {
      if (err) return res.status(500).json({ error: "Error al eliminar el plato" });

      if (nombreImagen) {
        const ruta = path.join(__dirname, "../uploads", nombreImagen);
        fs.unlink(ruta, err => {
          if (err) console.log("⚠️ No se pudo eliminar la imagen:", err);
          else console.log("🗑️ Imagen eliminada:", nombreImagen);
        });
      }

      res.json({ mensaje: "Plato e imagen eliminados con éxito!" });
    });
  });
};
