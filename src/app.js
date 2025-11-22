require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const { isAdmin } = require("./middleware/auth");
const app = express();

// ==========================
// 🧩 Middlewares
// ==========================
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "supersecreto123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// ==========================
// 🖼️ Archivos estáticos
// ==========================
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// 🚀 Rutas API
// ==========================
app.use("/api/platos", require("./routes/platos"));
app.use("/api/comentarios", require("./routes/comentarios"));
app.use("/auth", authRoutes);

// Ruta pública SEO-friendly de cada plato
app.get("/plato/:slug", (req, res) => {
  res.sendFile(path.join(publicPath, "plato.html"));
});



// ==========================
// 🌐 Rutas del Frontend
// ==========================

// (PÚBLICAS)
app.get("/", (_, res) => res.sendFile(path.join(publicPath, "index.html")));
app.get("/menu", (_, res) => res.sendFile(path.join(publicPath, "menu.html")));
app.get("/menu/:categoria", (_, res) =>
  res.sendFile(path.join(publicPath, "menu.html"))
);
// Login
app.get("/login", (_, res) =>
  res.sendFile(path.join(publicPath, "login.html"))
);

// Registrar
app.get("/login/registrar", (_, res) =>
  res.sendFile(path.join(publicPath, "registrar.html"))
);

// ========================================
// ✅ ADMIN — MISMAS PÁGINAS, PERO RUTAS ADMIN
// ========================================

// Admin ve el index, pero con URL /admin
app.get("/admin", isAdmin, (req, res) =>
  res.sendFile(path.join(publicPath, "index.html"))
);

// Admin menú principal (con privilegios)
app.get("/admin/menu", isAdmin, (req, res) =>
  res.sendFile(path.join(publicPath, "admin.html"))
);

// Categorías del admin
app.get("/admin/menu/:categoria", isAdmin, (req, res) =>
  res.sendFile(path.join(publicPath, "admin.html"))
);

// ==========================
// 🟢 Servidor
// ==========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
