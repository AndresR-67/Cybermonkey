// src/controllers/authController.js
import bcrypt from "bcrypt";
import { createUser, findByCorreoOrUsername, findById } from "../models/usuarioModel.js";
import { signToken } from "../utils/jwt.js";
import { createLog } from "../services/logService.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { nombres, apellidos, username, correo, contrasena, foto_perfil, id_rol } = req.body;
    if (!nombres || !apellidos || !username || !correo || !contrasena) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // Verificar si existe
    const existing = await findByCorreoOrUsername(correo) || await findByCorreoOrUsername(username);
    if (existing) {
      return res.status(409).json({ message: "Usuario o correo ya registrado." });
    }

    const hashed = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const newUser = await createUser({ nombres, apellidos, username, correo, contrasena: hashed, foto_perfil, id_rol });

    // Log: creación usuario
    await createLog({
      tabla: "usuarios",
      operacion: "CREATE",
      detalle: `Registro de usuario ${username}`,
      datos_nuevos: { id_usuario: newUser.id_usuario, username: newUser.username, correo: newUser.correo },
      usuario_sistema: username
    });

    return res.status(201).json({ user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, contrasena } = req.body; // identifier = correo o username
    if (!identifier || !contrasena) {
      return res.status(400).json({ message: "Faltan credenciales." });
    }

    const user = await findByCorreoOrUsername(identifier);
    if (!user) {
      // log intento fallido
      await createLog({
        tabla: "usuarios",
        operacion: "LOGIN",
        detalle: `Intento de login fallido - usuario no encontrado: ${identifier}`,
        usuario_sistema: identifier,
        meta: { resultado: "fail" }
      });
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      await createLog({
        tabla: "usuarios",
        operacion: "LOGIN",
        detalle: `Intento de login fallido - contraseña incorrecta: ${identifier}`,
        usuario_sistema: user.username || user.correo,
        meta: { resultado: "fail" }
      });
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const payload = { id_usuario: user.id_usuario, username: user.username, id_rol: user.id_rol };
    const token = signToken(payload);

    // Log login exitoso
    await createLog({
      tabla: "usuarios",
      operacion: "LOGIN",
      detalle: `Login exitoso: ${user.username}`,
      usuario_sistema: user.username,
      meta: { resultado: "success", ip: req.ip, userAgent: req.headers["user-agent"] }
    });

    // Responder token y user 
    const safeUser = {
      id_usuario: user.id_usuario,
      nombres: user.nombres,
      apellidos: user.apellidos,
      username: user.username,
      correo: user.correo,
      foto_perfil: user.foto_perfil,
      fecha_creacion: user.fecha_creacion,
      id_rol: user.id_rol,
      estado: user.estado
    };

    return res.json({ token, user: safeUser });
   } catch (err) {
  console.error("Error en login:", err);
  return res.status(500).json({ message: "Error en el servidor." });
}

};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    let usuario_sistema = "desconocido";
    if (req.user) usuario_sistema = req.user.username || `id:${req.user.id_usuario}`;

    // Log evento logout
    await createLog({
      tabla: "usuarios",
      operacion: "LOGOUT",
      detalle: `Logout: ${usuario_sistema}`,
      usuario_sistema,
      meta: { ip: req.ip, userAgent: req.headers["user-agent"], tokenProvided: Boolean(token) }
    });

    
    return res.json({ message: "Logout OK. Elimine el token en cliente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export const profile = async (req, res) => {
  try {
    const id = req.user?.id_usuario;
    if (!id) return res.status(400).json({ message: "Usuario no identificado." });
    const user = await findById(id);
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};
