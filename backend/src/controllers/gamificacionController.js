// src/controllers/gamificacionController.js
import * as gamificacionService from "../services/gamificacionService.js";
import * as gamificacionModel from "../models/gamificacionModel.js";
import GamificacionLogModel from "../models/gamificacionLogModel.js";
import { calcularNivel } from "../utils/niveles.js";

/* ==========================================================
   CONTROLADOR DE GAMIFICACIÓN
   Endpoints para progreso, penalizaciones, recompensas,
   medallas, logros y logs de usuario.
========================================================== */

/**
 * Obtener progreso completo del usuario actual
 */
export const obtenerProgreso = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
    if (!progreso) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { nivel, titulo } = calcularNivel(progreso.xp_total || 0);

    // Obtener medallas y logros actuales del usuario
    const recompensas = await gamificacionModel.getRecompensasUsuario(id_usuario);

    res.json({
      id_usuario,
      xp_total: progreso.xp_total || 0,
      nivel,
      titulo,
      dias_consecutivos: progreso.dias_consecutivos || 0,
      ultima_fecha: progreso.ultima_fecha,
      medallas: recompensas.medallas || [],
      logros: recompensas.logros || [],
    });
  } catch (err) {
    console.error("Error obtenerProgreso:", err);
    res.status(500).json({ message: "Error al obtener progreso", error: err.message });
  }
};

/**
 * Aplicar penalización manual (solo admin)
 */
export const aplicarPenalizacion = async (req, res) => {
  try {
    const { id_usuario, tipo, motivo } = req.body;
    const resultado = await gamificacionService.aplicarPenalizacion(id_usuario, tipo, motivo);
    res.json({ message: "Penalización aplicada", ...resultado });
  } catch (err) {
    console.error("Error aplicarPenalizacion:", err);
    res.status(500).json({ message: "Error al aplicar penalización", error: err.message });
  }
};

/**
 * Otorgar XP manual (solo admin)
 */
export const otorgarRecompensa = async (req, res) => {
  try {
    const { id_usuario, xp, motivo } = req.body;
    const resultado = await gamificacionService.otorgarXP(id_usuario, xp, motivo);
    res.json({ message: "Recompensa otorgada", ...resultado });
  } catch (err) {
    console.error("Error otorgarRecompensa:", err);
    res.status(500).json({ message: "Error al otorgar recompensa", error: err.message });
  }
};

/**
 * Otorgar medalla manual (solo admin)
 */
export const otorgarMedalla = async (req, res) => {
  try {
    const { id_usuario, id_medalla } = req.body;
    const resultado = await gamificacionService.otorgarMedalla(id_usuario, id_medalla);
    res.json({ message: "Medalla otorgada", ...resultado });
  } catch (err) {
    console.error("Error otorgarMedalla:", err);
    res.status(500).json({ message: "Error al otorgar medalla", error: err.message });
  }
};

/**
 * Otorgar logro manual (solo admin)
 */
export const otorgarLogro = async (req, res) => {
  try {
    const { id_usuario, id_logro } = req.body;
    const resultado = await gamificacionService.otorgarLogro(id_usuario, id_logro);
    res.json({ message: "Logro otorgado", ...resultado });
  } catch (err) {
    console.error("Error otorgarLogro:", err);
    res.status(500).json({ message: "Error al otorgar logro", error: err.message });
  }
};

/**
 * Obtener historial de eventos gamificados (Mongo)
 */
export const obtenerHistorial = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const logs = await GamificacionLogModel.find({ usuario_id: id_usuario })
      .sort({ fecha: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    console.error("Error obtenerHistorial:", err);
    res.status(500).json({ message: "Error al obtener historial", error: err.message });
  }
};
