// src/services/gamificacionService.js
import * as gamificacionModel from "../models/gamificacionModel.js";
import GamificacionLogModel from "../models/gamificacionLogModel.js"; // Mongo
import { calcularNivel } from "../utils/niveles.js";

/* ==========================================================
   SERVICIO DE GAMIFICACIÓN (SQL + Mongo para logs)
   Gestiona XP, niveles, penalizaciones, rachas,
   medallas, logros y el registro histórico.
========================================================== */

export const otorgarXP = async (id_usuario, xpGanado, motivo = "") => {
  const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
  if (!progreso) throw new Error("Usuario no encontrado");

  // Actualizar XP y obtener valor real desde SQL
  const nuevoXP = await gamificacionModel.actualizarXP(id_usuario, xpGanado);

  // Recalcular nivel
  const { nivel, titulo } = calcularNivel(nuevoXP);

  if (nivel !== progreso.nivel) {
    await gamificacionModel.actualizarNivel(id_usuario, nivel);
  }

  // Registrar log en Mongo
  await GamificacionLogModel.create({
    usuario_id: id_usuario,
    tipo: "recompensa",
    xp: xpGanado,
    detalle: motivo || `Ganó ${xpGanado} XP`,
    origen: "actividad",
    meta: { total_resultante: nuevoXP },
  });

  return { nuevoXP, nivel, titulo };
};



export const aplicarPenalizacion = async (id_usuario, tipo, motivo) => {
  const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
  if (!progreso) throw new Error("Usuario no encontrado");

  let xpPerdido;
  switch (tipo) {
    case "falla_tarea":
      xpPerdido = 10;
      break;
    case "inactividad":
      xpPerdido = 20;
      break;
    case "mala_conducta":
      xpPerdido = 30;
      break;
    default:
      xpPerdido = 5;
  }

  // Actualizar XP en SQL y obtener valor actualizado
  const resultado = await gamificacionModel.actualizarXP(id_usuario, -xpPerdido);
  const nuevoXP = resultado.xp_total;

  // Registrar log en Mongo
  await GamificacionLogModel.create({
    usuario_id: id_usuario,
    tipo: "penalizacion",
    xp: -xpPerdido,
    detalle: motivo || `Perdió ${xpPerdido} XP (${tipo})`,
    origen: "sistema",
    meta: { total_resultante: nuevoXP },
  });

  return { nuevoXP, xpPerdido };
};

/**
 * Actualizar o reiniciar racha de usuario
 */
export const actualizarRachaUsuario = async (id_usuario, fechaActual = new Date()) => {
  const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
  if (!progreso) throw new Error("Usuario no encontrado");

  const ultima = progreso.ultima_fecha ? new Date(progreso.ultima_fecha) : null;
  const diferencia = ultima ? (fechaActual - ultima) / (1000 * 60 * 60 * 24) : null;

  let nuevaRacha = 1;

  if (diferencia !== null) {
    if (diferencia <= 1.5) nuevaRacha = progreso.dias_consecutivos + 1;
    else nuevaRacha = 1;
  }

  const racha = await gamificacionModel.actualizarRacha(id_usuario, nuevaRacha, fechaActual);

  // Log en Mongo
  await GamificacionLogModel.create({
    usuario_id: id_usuario,
    tipo: "racha",
    detalle: `Racha actualizada: ${nuevaRacha} días`,
    origen: "sistema",
    meta: { dias_consecutivos: nuevaRacha },
  });

  return racha;
};

/**
 * Asignar medalla a un usuario
 */
export const otorgarMedalla = async (id_usuario, id_medalla) => {
  await gamificacionModel.asignarMedalla(id_usuario, id_medalla);

  await GamificacionLogModel.create({
    usuario_id: id_usuario,
    tipo: "medalla",
    detalle: `Obtuvo una nueva medalla (ID: ${id_medalla})`,
    origen: "sistema",
  });

  return { message: "Medalla asignada correctamente" };
};

/**
 * Asignar logro a un usuario
 */
export const otorgarLogro = async (id_usuario, id_logro) => {
  await gamificacionModel.asignarLogro(id_usuario, id_logro);

  await GamificacionLogModel.create({
    usuario_id: id_usuario,
    tipo: "logro",
    detalle: `Obtuvo un nuevo logro (ID: ${id_logro})`,
    origen: "sistema",
  });

  return { message: "Logro asignado correctamente" };
};

/**
 * Obtener progreso + recompensas del usuario
 */
export const obtenerProgresoCompleto = async (id_usuario) => {
  const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
  const recompensas = await gamificacionModel.getRecompensasUsuario(id_usuario);
  return { ...progreso, ...recompensas };
};

/**
 * Procesar XP al completar una actividad
 */
export const procesarActividadCompletada = async (id_usuario, actividad) => {
  if (!actividad) throw new Error("Actividad inválida");

  // Definir XP según prioridad
  let xpGanado = 0;
  switch ((actividad.prioridad || "").toLowerCase()) {
    case "baja":
      xpGanado = 5;
      break;
    case "media":
      xpGanado = 10;
      break;
    case "alta":
      xpGanado = 15;
      break;
    default:
      xpGanado = 5; // default en caso de no tener prioridad
  }

  // Otorgar XP
  const resultado = await otorgarXP(
    id_usuario,
    xpGanado,
    `Completó la actividad: "${actividad.titulo}" (Prioridad: ${actividad.prioridad})`
  );

  return resultado; // { nuevoXP, nivel, titulo }
};
