// src/controllers/actividadController.js
import * as actividadModel from "../models/actividadModel.js";
import * as notasModel from "../models/notasModel.js";
import alertaService from "../services/alertaService.js";
import * as gamificacionService from "../services/gamificacionService.js";
import * as gamificacionModel from "../models/gamificacionModel.js";
import { registrarAccion } from "../services/historialService.js";

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

     // Validar fecha de vencimiento
    if (fecha_vencimiento && new Date(fecha_vencimiento) < new Date()) {
      return res.status(400).json({ message: "La fecha de vencimiento no puede ser pasada" });
    }

    const actividad = await actividadModel.createActividad({
  id_usuario,
  titulo,
  descripcion,
  fecha_vencimiento,
  prioridad,
  completada_historial: false // <<< aseguramos que la actividad nueva nunca haya sido completada
});

    // Registrar acción en historial
    await registrarAccion({
      id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "CREAR",
      titulo: actividad.titulo
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
    await registrarAccion({
      id_usuario: req.user.id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "MODIFICAR",
      titulo: actividad.titulo
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
    try {
      await registrarAccion({
        id_usuario: req.user.id_usuario,
        id_actividad: null,       
        accion: "ELIMINAR",
        titulo: actividad.titulo  // Guardamos el título para estadísticas
      });
    } catch (histErr) {
      console.error("Error al registrar historial de eliminación:", histErr);
    }

    // Borrar la actividad
    await actividadModel.deleteActividad(id);

    res.json({ message: "Actividad eliminada", actividad });
  } catch (err) {
    console.error("Error deleteActividad:", err);
    res.status(500).json({ message: "Error al eliminar actividad" });
  }
};


/**
 * RF13 - Marcar actividad como completada + Gamificación
 */
export const completarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    // Completar la actividad en SQL
    const { actividad, yaHabiaSidoCompletada } = await actividadModel.completarActividad(id, id_usuario);
    if (!actividad) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    // Registrar en historial
    await registrarAccion({
      id_usuario,
      id_actividad: actividad.id_actividad,
      accion: "COMPLETAR",
      titulo: actividad.titulo
    });

    // Procesar XP y logros SOLO si es la primera vez que se completa
    if (!yaHabiaSidoCompletada) {
      try {
        // XP
        const resultadoXP = await gamificacionService.procesarActividadCompletada(id_usuario, actividad);
        console.log("XP otorgado:", resultadoXP.xpOtorgado);

        // Logros
        await gamificacionService.verificarLogros(id_usuario, actividad);
        console.log("Logros verificados");

      } catch (gamiErr) {
        console.warn("Gamificación no procesada:", gamiErr.message);
      }
    }

    return res.json({
      message: "Actividad completada",
      actividad
    });

  } catch (err) {
    console.error("Error completarActividad:", err);
    return res.status(500).json({ message: "Error al completar actividad" });
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
    await registrarAccion({
      id_usuario,
      id_actividad,
      accion: "NOTA",
      titulo: contenido // en notas, mejor usar el contenido de la nota
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

/**
 * RFXX - Actualizar estado de actividad (completada <-> pendiente)
 */
export const actualizarEstadoActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // "completada" o "pendiente"
    const id_usuario = req.user.id_usuario;

    // Validar estado permitido
    if (!["completada", "pendiente"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Obtener actividad
    const actividad = await actividadModel.getActividadById(id);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });
    if (actividad.id_usuario !== id_usuario) return res.status(403).json({ message: "No autorizado" });

    let actividadActualizada;

    if (estado === "completada") {
      // Completar la actividad en SQL
      const { actividad: updatedActividad } = await actividadModel.completarActividad(id, id_usuario);
      actividadActualizada = updatedActividad;

      // Registrar acción en historial
      await registrarAccion({
        id_usuario,
        id_actividad: id,
        accion: "COMPLETAR",
        titulo: actividad.titulo,
      });

      // SUMAR XP siempre, sin importar historial
      try {
        const resultadoXP = await gamificacionService.procesarActividadCompletada(id_usuario, actividadActualizada);
        console.log("XP otorgado:", resultadoXP.xpOtorgado);
      } catch (gamiErr) {
        console.warn("Gamificación no procesada:", gamiErr.message);
      }

    } else if (estado === "pendiente") {
      // Actualizar estado a pendiente
      actividadActualizada = await actividadModel.updateActividad(id, { estado: "pendiente" });

      // Registrar acción en historial
      await registrarAccion({
        id_usuario,
        id_actividad: id,
        accion: "DESHACER_COMPLETAR",
        titulo: actividad.titulo,
      });

      // RESTAR XP solo si la actividad alguna vez estuvo completada
      if (actividad.completada_historial) {
        try {
          const resultadoReversion = await gamificacionService.revertirActividadCompletada(id_usuario, actividadActualizada);
          console.log("XP revertido:", resultadoReversion.nuevoXP);
        } catch (gamiErr) {
          console.warn("Gamificación no revertida:", gamiErr.message);
        }
      }
    }

    return res.json({
      message: `Actividad marcada como ${estado}`,
      actividad: actividadActualizada,
    });

  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return res.status(500).json({ message: "Error al actualizar estado" });
  }
};





