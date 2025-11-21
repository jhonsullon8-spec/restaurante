const db = require("../config/db");

// ✅ Verifica si el comentario le pertenece al usuario logueado
function isOwnerOfComment(req, res, next) {
  const commentId = req.params.id;
  const userId = req.session.user.id;

  const sql = "SELECT usuario_id FROM comentarios WHERE id = ?";
  db.query(sql, [commentId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    const ownerId = results[0].usuario_id;

    if (ownerId !== userId) {
      return res.status(403).json({ error: "No puedes editar este comentario" });
    }

    next();
  });
}

// ✅ Admin puede borrar cualquiera; cliente solo los suyos
function canDeleteComment(req, res, next) {
  const role = req.session.user.role;
  const userId = req.session.user.id;
  const commentId = req.params.id;

  // Si es admin, borrar sin preguntar
  if (role === "admin") return next();

  // Si es cliente, verificar si el comentario es suyo
  const sql = "SELECT usuario_id FROM comentarios WHERE id = ?";
  db.query(sql, [commentId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    const ownerId = results[0].usuario_id;

    if (ownerId !== userId) {
      return res.status(403).json({ error: "No puedes eliminar este comentario" });
    }

    next();
  });
}

module.exports = { isOwnerOfComment, canDeleteComment };
