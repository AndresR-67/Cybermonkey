// src/controllers/notasController.js
import * as notasModel from "../models/notasModel.js";
import { createHistorial } from "../models/historialModel.js";

/* ============================
   CONTROLADOR NOTAS
============================ */

/**
 * RF15 - Crear nota rápida para una actividad
 */
export const createNota = async (req, res) => {
  try {
    const { id_actividad } = req.params;
    const { contenido } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!contenido || contenido.trim() === "") {
      return res.status(400).json({ message: "El contenido de la nota no puede estar vacío" });
    }

    const nota = await notasModel.createNota({ id_usuario, id_actividad, contenido });

    // Registrar acción en historial
    await createHistorial({
      id_usuario,
      id_actividad,
      accion: "NOTA"
    });

    res.status(201).json({ message: "Nota creada", nota });
  } catch (err) {
    console.error("Error createNota:", err);
    res.status(500).json({ message: "Error al crear la nota" });
  }
};

/**
 * Listar todas las notas de una actividad
 */
export const getNotas = async (req, res) => {
  try {
    const { id_actividad } = req.params;
    const notas = await notasModel.getNotasByActividad(id_actividad);
    res.json({ notas });
  } catch (err) {
    console.error("Error getNotas:", err);
    res.status(500).json({ message: "Error al obtener las notas" });
  }
};
