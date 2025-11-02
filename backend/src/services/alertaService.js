// src/services/alertaService.js
import Alerta from "../models/alertaModel.js";

/* ============================
   SERVICIO DE ALERTAS
============================ */

const alertaService = {};

/**
 * RF16 - Generar alerta de vencimiento
 * - Se ejecuta automáticamente al crear o actualizar una actividad
 * - Si la fecha de vencimiento está dentro de 48 horas, se genera alerta
 */
alertaService.generarAlertaVencimiento = async (actividad) => {
  try {
    const now = new Date();
    const fechaVenc = new Date(actividad.fecha_vencimiento);
    const diffHoras = (fechaVenc - now) / (1000 * 60 * 60);

    // Solo alertas para actividades que vencen en las próximas 48 horas y aún no completadas
    if (diffHoras > 0 && diffHoras <= 48 && actividad.estado !== "completada") {
      const mensaje = `La actividad "${actividad.titulo}" vence el ${fechaVenc.toLocaleString()}.`;

      const alerta = new Alerta({
        actividad_id: actividad.id_actividad,
        usuario_id: actividad.id_usuario,
        tipo: "vencimiento",
        mensaje,
      });

      await alerta.save();
      console.log("Alerta de vencimiento creada:", mensaje);
    }
  } catch (err) {
    console.error("Error generarAlertaVencimiento:", err);
  }
};

/**
 * RF17 - Generar recordatorio
 * - Por ahora solo se plantea la función
 * - Podría ser usado con cron o disparado manualmente
 */
alertaService.generarRecordatorio = async (actividad) => {
  try {
    const mensaje = `Recordatorio: la actividad "${actividad.titulo}" está próxima a vencerse.`;

    const alerta = new Alerta({
      actividad_id: actividad.id_actividad,
      usuario_id: actividad.id_usuario,
      tipo: "recordatorio",
      mensaje,
    });

    await alerta.save();
    console.log("Recordatorio creado:", mensaje);
  } catch (err) {
    console.error("Error generarRecordatorio:", err);
  }
};

export default alertaService;
