// src/services/gamificacionService.js

import * as gamificacionModel from "../models/gamificacionModel.js";
import GamificacionLogModel from "../models/gamificacionLogModel.js"; // Mongo
import { calcularNivel } from "../utils/niveles.js";
import MensajeMotivacional from "../models/mensajeModel.js";
import {
  getProgresoUsuario,
  asignarLogro,
  getTareasCompletadasEntreHoras,
  getTareasEnIntervalo,
  getTareasTotales,
  getTareasDificilesCompletadas
} from "../models/gamificacionModel.js";



/* ==========================================================
   SERVICIO DE GAMIFICACIÓN (SQL + Mongo para logs)
   Gestiona XP, niveles, penalizaciones, rachas, medallas,
   logros y el registro histórico.
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

  // Actualizar XP en SQL
  const resultado = await gamificacionModel.actualizarXP(
    id_usuario,
    -xpPerdido
  );
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
export const actualizarRachaUsuario = async (
  id_usuario,
  fechaActual = new Date()
) => {
  const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
  if (!progreso) throw new Error("Usuario no encontrado");

  const ultima = progreso.ultima_fecha
    ? new Date(progreso.ultima_fecha)
    : null;

  const diferencia = ultima
    ? (fechaActual - ultima) / (1000 * 60 * 60 * 24)
    : null;

  let nuevaRacha = 1;

  if (diferencia !== null) {
    if (diferencia <= 1.5) nuevaRacha = progreso.dias_consecutivos + 1;
    else nuevaRacha = 1;
  }

  const racha = await gamificacionModel.actualizarRacha(
    id_usuario,
    nuevaRacha,
    fechaActual
  );

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
  const recompensas = await gamificacionModel.getRecompensasUsuario(
    id_usuario
  );

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
    case "baja": xpGanado = 5; break;
    case "media": xpGanado = 10; break;
    case "alta": xpGanado = 15; break;
    default: xpGanado = 5;
  }

  // Otorgar XP
  const resultado = await otorgarXP(
    id_usuario,
    xpGanado,
    `Completó la actividad: "${actividad.titulo}" (Prioridad: ${actividad.prioridad})`
  );

  // Obtener mensaje motivacional
  const mensaje = await obtenerMensajeMotivacional("completada", "es");

  // Verificar y asignar medallas automáticamente
  const nuevasMedallas = await verificarMedallas(id_usuario);
  const nuevosLogros = await verificarLogros(id_usuario);
  if (nuevasMedallas.length > 0) {
    console.log(`Medallas obtenidas por ${id_usuario}:`, nuevasMedallas);
  }

  return { ...resultado, mensaje, xpOtorgado: xpGanado, nuevasMedallas, nuevosLogros };
};

export const obtenerMensajeMotivacional = async (
  categoria = "completada",
  idioma = "es"
) => {
  try {
    const mensajes = await MensajeMotivacional.find({
      categoria,
      idioma,
      activo: true,
    });

    if (!mensajes || mensajes.length === 0) {
      return "¡Buen trabajo! Sigue avanzando, vas por buen camino.";
    }

    const random = mensajes[Math.floor(Math.random() * mensajes.length)];
    return random.texto;
  } catch (err) {
    console.error("Error al obtener mensaje motivacional:", err);
    return "¡Sigue adelante! Cada paso cuenta.";
  }
};

export const revertirActividadCompletada = async (id_usuario, actividad) => {
  if (!actividad) throw new Error("Actividad inválida");

  let xpOtorgado = 0;

  switch ((actividad.prioridad || "").toLowerCase()) {
    case "baja":
      xpOtorgado = 5;
      break;
    case "media":
      xpOtorgado = 10;
      break;
    case "alta":
      xpOtorgado = 15;
      break;
    default:
      xpOtorgado = 5;
  }

  // Restar XP
  const resultado = await otorgarXP(
    id_usuario,
    -xpOtorgado,
    `Se desmarcó la actividad: "${actividad.titulo}" (Prioridad: ${actividad.prioridad})`
  );

  // Log explícito de reversión
  await GamificacionLogModel.create({
    usuario_id: id_usuario,
    tipo: "reversión",
    xp: -xpOtorgado,
    detalle: `Reversión de XP por desmarcar actividad: "${actividad.titulo}"`,
    origen: "actividad",
    meta: { total_resultante: resultado.nuevoXP },
  });

  return resultado;
};


/**
 * Verifica todas las medallas disponibles y asigna al usuario
 * si cumple los criterios.
 * 
 * Los criterios se esperan como JSON, por ejemplo:
 * { "xp_minimo": 50, "racha_minima": 5 }
 */
export const verificarMedallas = async (id_usuario) => {
  try {
    // Obtener progreso general del usuario
    const progreso = await gamificacionModel.getProgresoUsuario(id_usuario);
    if (!progreso) throw new Error("Usuario no encontrado");

    console.log("Progreso del usuario:", progreso);

    // Obtener todas las medallas
    const medallas = await gamificacionModel.getTodasMedallas();
    console.log(`Total medallas disponibles: ${medallas.length}`);

    // Obtener medallas que ya tiene el usuario
    const medallasUsuario = await gamificacionModel.getRecompensasUsuario(id_usuario)
      .then(r => r.medallas || []);
    console.log("Medallas actuales del usuario:", medallasUsuario.map(m => m.nombre));

    const medallasAsignadas = [];

    for (const medalla of medallas) {
      console.log(`\nVerificando medalla: ${medalla.nombre}`);

      // Saltar si ya tiene la medalla
      if (medallasUsuario.some(mu => mu.id_medalla === medalla.id_medalla)) {
        console.log("-> Usuario ya tiene esta medalla, se salta");
        continue;
      }

      // Manejar criterio que puede ser string JSON o objeto
      let criterio = {};
      try {
        if (!medalla.criterio) {
          criterio = {};
        } else if (typeof medalla.criterio === "string") {
          criterio = JSON.parse(medalla.criterio);
        } else if (typeof medalla.criterio === "object") {
          criterio = medalla.criterio;
        } else {
          criterio = {};
        }
      } catch (err) {
        console.log("Error parseando criterio:", err);
        criterio = {};
      }

      if (!criterio.tipo || criterio.valor === undefined) {
        console.log("-> Criterio inválido, se salta");
        continue;
      }

      let cumpleCriterio = false;

      switch (criterio.tipo) {
        case "xp":
          console.log(`-> Tipo XP: ${progreso.xp_total} >= ${criterio.valor}?`);
          if (progreso.xp_total >= criterio.valor) cumpleCriterio = true;
          break;

        case "nivel":
          console.log(`-> Tipo Nivel: ${progreso.nivel} >= ${criterio.valor}?`);
          if (progreso.nivel >= criterio.valor) cumpleCriterio = true;
          break;

        case "tareas_dificiles":
          const totalDificiles = await gamificacionModel.getTareasDificilesCompletadas(id_usuario);
          console.log(`-> Tipo Tareas Difíciles: ${totalDificiles} >= ${criterio.valor}?`);
          if (totalDificiles >= criterio.valor) cumpleCriterio = true;
          break;

        default:
          console.log(`-> Tipo de criterio desconocido: ${criterio.tipo}`);
          break;
      }

      if (cumpleCriterio) {
        console.log(`-> Cumple criterio, asignando medalla: ${medalla.nombre}`);
        await otorgarMedalla(id_usuario, medalla.id_medalla);
        medallasAsignadas.push(medalla.nombre);
      } else {
        console.log("-> No cumple criterio");
      }
    }

    console.log("\nMedallas asignadas en esta ejecución:", medallasAsignadas);
    return medallasAsignadas;
  } catch (err) {
    console.error("Error en verificarMedallas:", err);
    return [];
  }
};

export const verificarLogros = async (id_usuario) => {
  // Obtener datos base
  const progreso = await getProgresoUsuario(id_usuario);
  const nivel = progreso.nivel || 0;
  const xpTotal = progreso.xp_total || 0;

  // Cantidad total de tareas completadas por el usuario
  const tareasTotales = await getTareasTotales(id_usuario);

  // 1. Tareas entre horas — Night Owl
  const nightOwl = await getTareasCompletadasEntreHoras(id_usuario, "00:00", "03:00");
  if (nightOwl) await asignarLogro(id_usuario, 22);

  // 2. Tareas en intervalo de 60 min — Sprint Master (3 tareas)
  const tareasUltimaHora = await getTareasEnIntervalo(id_usuario, 60);
  if (tareasUltimaHora >= 3) await asignarLogro(id_usuario, 23);

  // 3. Logros por cantidad total de tareas
  if (tareasTotales >= 3) await asignarLogro(id_usuario, 11);   // Organizador
  if (tareasTotales >= 5) await asignarLogro(id_usuario, 9);    // Motivador (adaptado)
  if (tareasTotales >= 7) await asignarLogro(id_usuario, 3);    // “Dedicado diario” adaptado
  if (tareasTotales >= 10) await asignarLogro(id_usuario, 24);  // Trabajador incansable
  if (tareasTotales >= 10) await asignarLogro(id_usuario, 8);   // Trabajo en equipo (adaptado)
  if (tareasTotales >= 10) await asignarLogro(id_usuario, 10);  // Mentor experto (adaptado)
  if (tareasTotales >= 15) await asignarLogro(id_usuario, 7);   // Sin fallas (adaptado)
  if (tareasTotales >= 30) await asignarLogro(id_usuario, 4);   // Imparable (adaptado)
  if (tareasTotales >= 30) await asignarLogro(id_usuario, 13);  // Sin penalizaciones (adaptado)
  if (tareasTotales >= 100) await asignarLogro(id_usuario, 14); // Veterano

  // 4. Niveles
  if (nivel >= 2) await asignarLogro(id_usuario, 1); 
  if (nivel >= 3) await asignarLogro(id_usuario, 2);
  if (nivel >= 5) await asignarLogro(id_usuario, 26); // Ascenso meteórico
  if (nivel >= 6) await asignarLogro(id_usuario, 15); // Leyenda

  // 5. XP totales
  if (xpTotal >= 500) await asignarLogro(id_usuario, 12); // Estrella del mes (adaptado)
  if (xpTotal >= 1000) await asignarLogro(id_usuario, 27); // XP Maestro

  return { success: true };
};








