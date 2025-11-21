const db = require("../config/db");

// ============================
// 📝 GUARDAR COMENTARIO (Cliente logueado)
// ============================
exports.guardarComentario = (req, res) => {
  const { nombre, comentario, estrellas } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: "Debes iniciar sesión para comentar" });
  }

  const usuarioId = req.session.user.id;

  const sql = `
    INSERT INTO comentarios (nombre, comentario, estrellas, usuario_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nombre, comentario, estrellas, usuarioId], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al guardar" });
    }

    res.json({ mensaje: "Comentario guardado con éxito!" });
  });
};

// ============================
// 🔹 OBTENER COMENTARIOS (Público)
// ============================
exports.obtenerComentarios = (req, res) => {
  const sql = "SELECT * FROM comentarios ORDER BY fecha DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener comentarios" });
    res.json(results);
  });
};

// ============================
// ✏️ EDITAR COMENTARIO (Solo dueño)
// ============================
exports.editarComentario = (req, res) => {
  const commentId = req.params.id;
  const { comentario } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: "Debes iniciar sesión." });
  }

  if (!comentario || comentario.trim() === "") {
    return res.status(400).json({ error: "El comentario no puede estar vacío" });
  }

  const usuarioId = req.session.user.id;

  // Verificar que el comentario sea del usuario
  const sqlCheck = "SELECT usuario_id FROM comentarios WHERE id = ?";

  db.query(sqlCheck, [commentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al validar comentario" });

    if (results.length === 0) return res.status(404).json({ error: "Comentario no encontrado" });

    const propietarioId = results[0].usuario_id;

    if (usuarioId !== propietarioId) {
      return res.status(403).json({ error: "Solo puedes editar tu propio comentario" });
    }

    // Actualizar comentario
    const sqlUpdate = "UPDATE comentarios SET comentario = ? WHERE id = ?";

    db.query(sqlUpdate, [comentario.trim(), commentId], err2 => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "Error al actualizar comentario" });
      }

      res.json({ ok: true, mensaje: "Comentario editado correctamente" });
    });
  });
};

// ============================
// 🗑 ELIMINAR COMENTARIO
// Admin elimina cualquiera, cliente solo el suyo
// ============================
exports.eliminarComentario = (req, res) => {
  const commentId = req.params.id;

  if (!req.session.user) {
    return res.status(401).json({ error: "Debes iniciar sesión." });
  }

  const role = req.session.user.role;
  const usuarioId = req.session.user.id;

  if (role === "admin") {
    // 🔹 Admin elimina directo
    const sqlDelete = "DELETE FROM comentarios WHERE id = ?";
    db.query(sqlDelete, [commentId], (err, result) => {
      if (err) return res.status(500).json({ error: "Error al eliminar" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Comentario no encontrado" });
      }

      // 🔹 SALIMOS aquí, no se ejecuta más código
      return res.json({ mensaje: "Comentario eliminado por admin" });
    });
    return; // 🔹 importante para que no siga con la lógica de cliente
  }

  // 🔹 Cliente: verificar que es dueño
  const sqlCheck = "SELECT usuario_id FROM comentarios WHERE id = ?";
  db.query(sqlCheck, [commentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al validar propiedad" });

    if (results.length === 0) return res.status(404).json({ mensaje: "Comentario no encontrado" });

    if (results[0].usuario_id !== usuarioId) {
      return res.status(403).json({ mensaje: "No puedes eliminar comentarios que no son tuyos" });
    }

    const sqlDelete = "DELETE FROM comentarios WHERE id = ?";
    db.query(sqlDelete, [commentId], err2 => {
      if (err2) return res.status(500).json({ error: "Error al eliminar comentario" });

      return res.json({ mensaje: "Comentario eliminado por el usuario" });
    });
  });
};

