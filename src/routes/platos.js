const express = require("express");
const router = express.Router();
const platosController = require("../controllers/platosController");
const upload = require("../config/multer");

// 📋 Rutas CRUD
router.get("/", platosController.obtenerPlatos);
router.get("/slug/:slug", platosController.obtenerPlatoPorSlug); // cambio opcional para evitar conflicto
router.post("/", upload.single("imagen"), platosController.crearPlato);
router.put("/:id", upload.single("imagen"), platosController.editarPlato);
router.delete("/:id", platosController.eliminarPlato);

module.exports = router;
