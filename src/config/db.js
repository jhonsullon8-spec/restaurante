const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restaurante"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

module.exports = db;
