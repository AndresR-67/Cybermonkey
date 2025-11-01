// src/controllers/usuarioController.js
import {
  createUser,
  findAllUsers,
  findById,
  findByCorreoOrUsername,
  updateUser,
  deleteUser,
  updatePassword,
  updateFotoPerfil
} from "../models/usuarioModel.js";

import LogModel from "../models/logModel.js";
import bcrypt from "bcrypt";

// ===================== USUARIO ESTÁNDAR =====================

// Obtener perfil propio
export const obtenerPerfil = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario; // viene del token JWT
    const usuario = await findById(id_usuario);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el perfil", details: err.message });
  }
};

// Modificar perfil (nombre, apellidos, correo, etc.)
export const actualizarPerfil = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const campos = req.body;

    const antes = await findById(id_usuario);
    const actualizado = await updateUser(id_usuario, campos);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "UPDATE",
      detalle: "Actualización de perfil estándar",
      datos_anteriores: antes,
      datos_nuevos: actualizado,
      usuario_sistema: id_usuario.toString(),
    });

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el perfil", details: err.message });
  }
};

// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const { contrasena_actual, nueva_contrasena } = req.body;

    const usuario = await findById(id_usuario);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(contrasena_actual, usuario.contrasena);
    if (!coincide) return res.status(400).json({ error: "Contraseña actual incorrecta" });

    const hash = await bcrypt.hash(nueva_contrasena, 10);
    const actualizado = await updatePassword(id_usuario, hash);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "UPDATE",
      detalle: "Cambio de contraseña",
      usuario_sistema: id_usuario.toString(),
    });

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al cambiar contraseña", details: err.message });
  }
};

// Cambiar foto de perfil (por URL)
export const cambiarFotoPerfil = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const { nuevaFotoURL } = req.body;

    const antes = await findById(id_usuario);
    const actualizado = await updateFotoPerfil(id_usuario, nuevaFotoURL);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "UPDATE",
      detalle: "Cambio de foto de perfil",
      datos_anteriores: antes,
      datos_nuevos: actualizado,
      usuario_sistema: id_usuario.toString(),
    });

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al cambiar la foto", details: err.message });
  }
};

// ===================== ADMINISTRADOR =====================

// Crear usuario (admin)
export const adminCrearUsuario = async (req, res) => {
  try {
    const { nombres, apellidos, username, correo, contrasena, id_rol, estado } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);
    const nuevo = await createUser({ nombres, apellidos, username, correo, contrasena: hash, id_rol, estado });

    await LogModel.create({
      tabla: "usuarios",
      operacion: "CREATE",
      detalle: "Creación de usuario por admin",
      datos_nuevos: nuevo,
      usuario_sistema: req.user?.id_usuario.toString(),
    });

    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario", details: err.message });
  }
};

// Listar usuarios (admin)
export const adminListarUsuarios = async (req, res) => {
  try {
    const usuarios = await findAllUsers();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error al listar usuarios", details: err.message });
  }
};

// Modificar usuario (admin)
export const adminActualizarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const campos = req.body;
    const antes = await findById(id_usuario);
    const actualizado = await updateUser(id_usuario, campos);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "UPDATE",
      detalle: "Actualización de usuario por admin",
      datos_anteriores: antes,
      datos_nuevos: actualizado,
      usuario_sistema: req.user?.id_usuario.toString(),
    });

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario", details: err.message });
  }
};

// Eliminar usuario (admin)
export const adminEliminarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const eliminado = await deleteUser(id_usuario);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "DELETE",
      detalle: "Eliminación de usuario por admin",
      datos_anteriores: eliminado,
      usuario_sistema: req.user?.id_usuario.toString(),
    });

    res.json({ mensaje: "Usuario eliminado", eliminado });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario", details: err.message });
  }
};
