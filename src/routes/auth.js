const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Registrar usuario (cliente)
router.post("/registrar", authController.registrar);

// ✅ Login
router.post("/login", authController.login);

// ✅ Logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "No se pudo cerrar sesión" });

    // Limpiar cookie de sesión
    res.clearCookie("connect.sid");
    res.json({ ok: true, mensaje: "Sesión cerrada" });
  });
});

module.exports = router;
