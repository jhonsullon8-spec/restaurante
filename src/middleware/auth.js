// ✅ Verifica si hay usuario logueado
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Debes iniciar sesión." });
    }
    next();
}

// ✅ Verifica si el usuario es admin
function isAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado (solo admin)." });
    }
    next();
}

// ✅ Alias para compatibilidad si usabas esAdmin
const esAdmin = isAdmin;

// ✅ Exportación correcta
module.exports = { requireLogin, isAdmin, esAdmin };
