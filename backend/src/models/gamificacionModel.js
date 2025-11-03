// src/models/gamificacionModel.js
import pool from "../config/db.js";

/* ==========================================
   MODELO DE GAMIFICACIÓN (SQL)
   Tablas: usuarios, rachas, medallas, logros,
           usuario_medallas, usuario_logros
========================================== */

/**
 * Obtener el progreso general del usuario (XP, nivel, racha, etc.)
 */
export const getProgresoUsuario = async (id_usuario) => {
  try {
    const query = `
      SELECT u.id_usuario, u.xp_total, u.nivel, 
             COALESCE(r.dias_consecutivos, 0) AS dias_consecutivos,
             r.ultima_fecha, r.actualizado_en
      FROM usuarios u
      LEFT JOIN rachas r ON u.id_usuario = r.id_usuario
      WHERE u.id_usuario = $1;
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error al obtener progreso del usuario:", error);
    throw error;
  }
};

/**
 * Actualizar XP del usuario (sumar o restar)
 */
export const actualizarXP = async (id_usuario, cantidad) => {
  try {
    const query = `
      UPDATE usuarios
      SET xp_total = GREATEST(0, COALESCE(xp_total, 0) + $1)
      WHERE id_usuario = $2
      RETURNING id_usuario, xp_total;
    `;
    const result = await pool.query(query, [cantidad, id_usuario]);
    if (!result.rows[0]) throw new Error("Usuario no encontrado");
    return result.rows[0].xp_total; // 🔹 devolver solo el XP actualizado
  } catch (error) {
    console.error("Error al actualizar XP:", error);
    throw error;
  }
};


/**
 * Actualizar nivel del usuario
 */
export const actualizarNivel = async (id_usuario, nuevoNivel) => {
  try {
    const query = `
      UPDATE usuarios
      SET nivel = $1
      WHERE id_usuario = $2
      RETURNING nivel;
    `;
    const result = await pool.query(query, [nuevoNivel, id_usuario]);
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar nivel:", error);
    throw error;
  }
};

/**
 * Actualizar o insertar racha de usuario
 */
export const actualizarRacha = async (id_usuario, dias_consecutivos, ultima_fecha) => {
  try {
    const query = `
      INSERT INTO rachas (id_usuario, dias_consecutivos, ultima_fecha, actualizado_en)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (id_usuario)
      DO UPDATE SET dias_consecutivos = $2, ultima_fecha = $3, actualizado_en = NOW()
      RETURNING *;
    `;
    const result = await pool.query(query, [id_usuario, dias_consecutivos, ultima_fecha]);
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar racha:", error);
    throw error;
  }
};

/**
 * Asignar una medalla a un usuario
 */
export const asignarMedalla = async (id_usuario, id_medalla) => {
  try {
    const query = `
      INSERT INTO usuario_medallas (id_usuario, id_medalla, fecha_obtenida)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id_usuario, id_medalla) DO NOTHING;
    `;
    await pool.query(query, [id_usuario, id_medalla]);
    return { success: true };
  } catch (error) {
    console.error("Error al asignar medalla:", error);
    throw error;
  }
};

/**
 * Asignar un logro a un usuario
 */
export const asignarLogro = async (id_usuario, id_logro) => {
  try {
    const query = `
      INSERT INTO usuario_logros (id_usuario, id_logro, fecha_obtenido)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id_usuario, id_logro) DO NOTHING;
    `;
    await pool.query(query, [id_usuario, id_logro]);
    return { success: true };
  } catch (error) {
    console.error("Error al asignar logro:", error);
    throw error;
  }
};

/**
 * Obtener medallas y logros del usuario
 */
export const getRecompensasUsuario = async (id_usuario) => {
  try {
    const query = `
      SELECT 
        COALESCE(json_agg(DISTINCT m.*) FILTER (WHERE m.id_medalla IS NOT NULL), '[]') AS medallas,
        COALESCE(json_agg(DISTINCT l.*) FILTER (WHERE l.id_logro IS NOT NULL), '[]') AS logros
      FROM usuarios u
      LEFT JOIN usuario_medallas um ON u.id_usuario = um.id_usuario
      LEFT JOIN medallas m ON um.id_medalla = m.id_medalla
      LEFT JOIN usuario_logros ul ON u.id_usuario = ul.id_usuario
      LEFT JOIN logros l ON ul.id_logro = l.id_logro
      WHERE u.id_usuario = $1;
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows[0];
  } catch (error) {
    console.error("Error al obtener recompensas del usuario:", error);
    throw error;
  }
};

