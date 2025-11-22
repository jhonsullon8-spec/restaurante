require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la DB:", err);
    return;
  }
  console.log("✅ Conexión MySQL Railway exitosa");
});

module.exports = db;
