// src/controllers/usuarioController.js
import {
  createUser,
  findAllUsers,
  findById,
  findByIdWithPassword,
  findByCorreoOrUsername,
  updateUser,
  deleteUser,
  updatePassword,
  updateFotoPerfil
} from "../models/usuarioModel.js";
import * as gamificacionService from "../services/gamificacionService.js";
import * as gamificacionModel from "../models/gamificacionModel.js";
import { calcularNivel } from "../utils/niveles.js";
import LogModel from "../models/logModel.js";
import bcrypt from "bcrypt";

// ===================== USUARIO ESTÁNDAR =====================

// Obtener perfil propio (extendido con gamificación)
export const obtenerPerfil = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const usuario = await findById(id_usuario);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Obtener progreso (xp, racha, nivel SQL) + recompensas (medallas, logros)
    const [progreso, recompensas] = await Promise.all([
      gamificacionModel.getProgresoUsuario(id_usuario),
      gamificacionModel.getRecompensasUsuario(id_usuario),
    ]);

    // Calcular nivel completo desde XP total
    const nivelInfo = calcularNivel(progreso?.xp_total || 0);

    // Construir perfil extendido COMPLETO
    const perfilExtendido = {
      id_usuario: usuario.id_usuario,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      username: usuario.username,
      correo: usuario.correo,
      foto_perfil: usuario.foto_perfil,
      fecha_creacion: usuario.fecha_creacion,
      id_rol: usuario.id_rol,
      rol_nombre: usuario.rol_nombre,
      estado: usuario.estado,

      // === GAMIFICACIÓN ===
      xp_total: progreso?.xp_total || 0,
      racha_actual: progreso?.dias_consecutivos || 0,

      // Nivel y progreso visual
      nivel_actual: nivelInfo.nivel,
      titulo_nivel: nivelInfo.titulo,
      xp_min_nivel: nivelInfo.xp_min,
      xp_max_nivel: nivelInfo.xp_max,
      xp_faltante: nivelInfo.xp_faltante,
      progreso_nivel: nivelInfo.porcentaje_progreso,

      // Recompensas
      medallas: recompensas?.medallas || [],
      logros: recompensas?.logros || [],
    };

    res.json(perfilExtendido);

  } catch (err) {
    console.error("Error obtenerPerfil:", err);
    res.status(500).json({
      error: "Error al obtener el perfil",
      details: err.message,
    });
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
    console.log("=== CAMBIAR CONTRASEÑA INICIADO ===");
    const id_usuario = req.user?.id_usuario;
    console.log("ID Usuario:", id_usuario);
    
    const { contrasena_actual, nueva_contrasena } = req.body;
    console.log("Datos recibidos:", { 
      tiene_actual: !!contrasena_actual, 
      tiene_nueva: !!nueva_contrasena 
    });

    const usuario = await findByIdWithPassword(id_usuario);
    console.log("Usuario encontrado:", usuario ? "SÍ" : "NO");
    
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    console.log("Comparando contraseñas...");
    const coincide = await bcrypt.compare(contrasena_actual, usuario.contrasena);
    console.log("Contraseña coincide:", coincide);
    
    if (!coincide) return res.status(400).json({ error: "Contraseña actual incorrecta" });

    console.log("Hasheando nueva contraseña...");
    const hash = await bcrypt.hash(nueva_contrasena, 10);
    console.log("Hash generado");
    
    console.log("Actualizando contraseña en BD...");
    const actualizado = await updatePassword(id_usuario, hash);
    console.log("Contraseña actualizada:", actualizado);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "UPDATE",
      detalle: "Cambio de contraseña",
      usuario_sistema: id_usuario.toString(),
    });

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("❌ ERROR EN CAMBIAR CONTRASEÑA:", err);
    console.error("Stack:", err.stack);
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

// Eliminar cuenta propia
export const eliminarCuentaPropia = async (req, res) => {
  try {
    console.log("=== ELIMINAR CUENTA INICIADO ===");
    const id_usuario = req.user?.id_usuario;
    console.log("ID Usuario:", id_usuario);
    
    const { contrasena } = req.body;
    console.log("Contraseña recibida:", contrasena ? "SÍ" : "NO");

    const usuario = await findByIdWithPassword(id_usuario);
    console.log("Usuario encontrado:", usuario ? "SÍ" : "NO");
    
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Verificar contraseña antes de eliminar
    console.log("Verificando contraseña...");
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    console.log("Contraseña coincide:", coincide);
    
    if (!coincide) return res.status(400).json({ error: "Contraseña incorrecta" });

    console.log("Intentando eliminar usuario...");
    const eliminado = await deleteUser(id_usuario);
    console.log("Usuario eliminado:", eliminado);

    await LogModel.create({
      tabla: "usuarios",
      operacion: "DELETE",
      detalle: "Usuario eliminó su propia cuenta",
      datos_anteriores: eliminado,
      usuario_sistema: id_usuario.toString(),
    });

    res.json({ mensaje: "Cuenta eliminada correctamente" });
  } catch (err) {
    console.error("❌ ERROR EN ELIMINAR CUENTA:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({ error: "Error al eliminar cuenta", details: err.message });
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