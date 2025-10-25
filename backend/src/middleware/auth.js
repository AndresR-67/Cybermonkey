// src/middleware/auth.js
import { verifyToken } from "../utils/jwt.js";
import { findById } from "../models/usuarioModel.js";

/**
 * auth middleware: verifica JWT 
 *   app.get('/ruta', auth(), handler) // solo autenticado
 *   app.get('/admin', auth(['admin']), handler) // roles (usa nombres en la tabla roles)
 */
export default function auth(requiredRoles = null) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      let token = null;
      if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
      
      if (!token && req.cookies) token = req.cookies.token;

      if (!token) return res.status(401).json({ message: "No token provided." });

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado." });
      }

      // obtener usuario actual desde DB
      const user = await findById(decoded.id_usuario);
      if (!user) return res.status(401).json({ message: "Usuario no encontrado." });

      req.user = {
        id_usuario: user.id_usuario,
        username: user.username,
        id_rol: user.id_rol,
        correo: user.correo
      };

      if (requiredRoles && Array.isArray(requiredRoles)) {
        
        if (!requiredRoles.includes(user.id_rol) && !requiredRoles.includes(user.username)) {
          return res.status(403).json({ message: "No tienes permiso para acceder." });
        }
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error en el middleware de autenticación." });
    }
  };
}
