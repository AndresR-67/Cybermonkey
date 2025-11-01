// src/middleware/auth.js
import { verifyToken } from "../utils/jwt.js";
import { findById } from "../models/usuarioModel.js";

/**
 * Middleware de autenticación y autorización
 * - auth()              → solo requiere usuario autenticado
 * - auth(['admin'])     → requiere rol específico
 * - auth(['admin','usuario']) → múltiples roles
 */
export default function auth(requiredRoles = null) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      let token = null;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (req.cookies?.token) {
        token = req.cookies.token;
      }

      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
      }

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado." });
      }

      // Buscar usuario en la base de datos
      const user = await findById(decoded.id_usuario);
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado." });
      }

      req.user = {
        id_usuario: user.id_usuario,
        username: user.username,
        id_rol: user.id_rol,
        correo: user.correo,
      };

      // Verificación de roles
      if (requiredRoles && Array.isArray(requiredRoles)) {
        const roleMap = {
          1: "admin",
          2: "usuario",
        };

        const userRoleName = roleMap[user.id_rol] || "usuario";

        if (!requiredRoles.includes(userRoleName)) {
          return res.status(403).json({ message: "No tienes permiso para acceder a esta ruta." });
        }
      }

      next();
    } catch (err) {
      console.error("Error en middleware auth:", err);
      return res.status(500).json({ message: "Error interno en autenticación." });
    }
  };
}
