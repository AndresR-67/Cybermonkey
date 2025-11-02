// src/controllers/actividadController.js
import * as actividadModel from "../models/actividadModel.js";
import * as notasModel from "../models/notasModel.js";
import alertaService from "../services/alertaService.js";
import { createHistorial } from "../models/historialModel.js";

/* ============================
   CONTROLADOR ACTIVIDADES
============================ */

/**
 * RF10 - Crear actividad
 */
export const createActividad = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_vencimiento, prioridad } = req.body;
    const id_usuario = req.user.id_usuario;

    const actividad = await actividadModel.createActividad({
      id_usuario,
      titulo,
      descripcion,
      fecha_vencimiento,
      prioridad,
    });

    // Registrar acción en historial
    await createHistorial({
      id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "CREAR"
    });

    // Generar alerta automáticamente si la fecha está próxima
    await alertaService.generarAlertaVencimiento(actividad);

    res.status(201).json({ message: "Actividad creada", actividad });
  } catch (err) {
    console.error("Error createActividad:", err);
    res.status(500).json({ message: "Error al crear actividad" });
  }
};

/**
 * RF11 - Modificar actividad
 */
export const updateActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    const actividad = await actividadModel.updateActividad(id, fieldsToUpdate);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });

    // Registrar acción en historial
    await createHistorial({
      id_usuario: req.user.id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "MODIFICAR"
    });

    // Re-evaluar alerta si fecha_vencimiento o prioridad cambió
    if (fieldsToUpdate.fecha_vencimiento || fieldsToUpdate.prioridad) {
      await alertaService.generarAlertaVencimiento(actividad);
    }

    res.json({ message: "Actividad actualizada", actividad });
  } catch (err) {
    console.error("Error updateActividad:", err);
    res.status(500).json({ message: "Error al actualizar actividad" });
  }
};

/**
 * RF12 - Eliminar actividad
 */
export const deleteActividad = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la actividad antes de eliminarla
    const actividad = await actividadModel.getActividadById(id);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });

    // Registrar acción en historial antes de borrar
    await createHistorial({
      id_usuario: req.user.id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "ELIMINAR"
    });

    // Borrar la actividad
    await actividadModel.deleteActividad(id);

    res.json({ message: "Actividad eliminada", actividad });
  } catch (err) {
    console.error("Error deleteActividad:", err);
    res.status(500).json({ message: "Error al eliminar actividad" });
  }
};


/**
 * RF13 - Marcar actividad como completada
 */
export const completarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    const actividad = await actividadModel.completarActividad(id, id_usuario);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });

    // Registrar acción en historial
    await createHistorial({
      id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "COMPLETAR"
    });

    res.json({ message: "Actividad completada", actividad });
  } catch (err) {
    console.error("Error completarActividad:", err);
    res.status(500).json({ message: "Error al completar actividad" });
  }
};

/**
 * RF14 - Listar actividades (opcional por estado)
 */
export const getActividades = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { estado } = req.query; // 'pendiente' o 'completada', opcional

    const actividades = await actividadModel.getActividadesByUsuario(id_usuario, estado);
    res.json({ actividades });
  } catch (err) {
    console.error("Error getActividades:", err);
    res.status(500).json({ message: "Error al obtener actividades" });
  }
};

/**
 * RF15 - Agregar nota rápida a actividad
 */
export const addNota = async (req, res) => {
  try {
    const { id_actividad } = req.params;
    const { contenido } = req.body;
    const id_usuario = req.user.id_usuario;

    const nota = await notasModel.createNota({ id_usuario, id_actividad, contenido });

    // Registrar acción en historial
    await createHistorial({
      id_usuario,
      id_actividad,
      accion: "NOTA"
    });

    res.status(201).json({ message: "Nota creada", nota });
  } catch (err) {
    console.error("Error addNota:", err);
    res.status(500).json({ message: "Error al agregar nota" });
  }
};

/**
 * Listar notas de una actividad
 */
export const getNotas = async (req, res) => {
  try {
    const { id_actividad } = req.params;
    const notas = await notasModel.getNotasByActividad(id_actividad);
    res.json({ notas });
  } catch (err) {
    console.error("Error getNotas:", err);
    res.status(500).json({ message: "Error al obtener notas" });
  }
};
