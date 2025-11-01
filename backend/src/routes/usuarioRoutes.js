// src/routes/usuarioRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  obtenerPerfil,
  actualizarPerfil,
  cambiarContrasena,
  cambiarFotoPerfil,
  adminCrearUsuario,
  adminListarUsuarios,
  adminActualizarUsuario,
  adminEliminarUsuario,
} from "../controllers/usuarioController.js";

const router = express.Router();

// ===================== RUTAS DE USUARIO =====================

// Obtener el perfil propio
router.get("/perfil", auth(), obtenerPerfil);

// Actualizar perfil propio
router.put("/perfil", auth(), actualizarPerfil);

// Cambiar contraseña
router.put("/perfil/contrasena", auth(), cambiarContrasena);

// Cambiar foto de perfil
router.put("/perfil/foto", auth(), cambiarFotoPerfil);

// ===================== RUTAS DE ADMINISTRADOR =====================

// Crear usuario nuevo
router.post("/", auth(["admin"]), adminCrearUsuario);

// Listar todos los usuarios
router.get("/", auth(["admin"]), adminListarUsuarios);

// Actualizar usuario por ID
router.put("/:id_usuario", auth(["admin"]), adminActualizarUsuario);

// Eliminar usuario por ID
router.delete("/:id_usuario", auth(["admin"]), adminEliminarUsuario);

export default router;
