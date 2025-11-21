const express = require("express");
const router = express.Router();

const comentariosController = require("../controllers/comentariosController");




// Middlewares
const { requireLogin } = require("../middleware/auth");
const { isOwnerOfComment, canDeleteComment  } = require("../middleware/permisosComentarios");

// ==============================
// 🔹 Obtener comentarios (público)
// ==============================
router.get("/", comentariosController.obtenerComentarios);

// ==============================
// 🔹 Crear comentario (cliente logueado)
// ==============================
router.post("/", requireLogin, comentariosController.guardarComentario);

// ==============================
// 🔹 Editar comentario (solo dueño)
// ==============================
router.put("/:id", requireLogin, isOwnerOfComment, comentariosController.editarComentario);

// ==============================
// 🔹 Eliminar comentario (dueño o admin)
// ==============================
router.delete("/:id", requireLogin, canDeleteComment , comentariosController.eliminarComentario);

module.exports = router;
