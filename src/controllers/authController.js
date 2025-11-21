const db = require("../config/db");

exports.login = (req, res) => {
  const { usuario, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";

  db.query(sql, [usuario, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al validar" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = results[0];

    // ✅ Guardar sesión correctamente
    req.session.user = {
      id: user.id,
      usuario: user.usuario,
      role: user.rol  // <-- este es tu campo real
    };

    // ✅ Devolver información necesaria al frontend
    res.json({
      ok: true,
      id: user.id,
      usuario: user.usuario,
      role: user.rol
    });
  });
};

exports.registrar = (req, res) => {
  const { usuario, password } = req.body;

  // Verificar si el usuario ya existe
  const sqlCheck = "SELECT * FROM usuarios WHERE usuario = ?";
  db.query(sqlCheck, [usuario], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Insertar nuevo usuario con rol cliente
    const sqlInsert = "INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, 'cliente')";
    db.query(sqlInsert, [usuario, password], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "Error al registrar" });
      }

      res.json({ ok: true, mensaje: "Cuenta creada exitosamente" });
    });
  });
};

