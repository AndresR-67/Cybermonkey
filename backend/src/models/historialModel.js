// src/models/historialModel.js
import pool from "../config/db.js";

/* ============================
   FUNCIONES HISTORIAL
============================ */

// Registrar acción en el historial
export const createHistorial = async ({ id_usuario, id_actividad, accion }) => {
  const client = await pool.connect();
  try {
    const q = `
      INSERT INTO historial (id_usuario, id_actividad, accion, fecha)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [id_usuario, id_actividad, accion];
    const res = await client.query(q, values);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Obtener historial por usuario
export const getHistorialByUsuario = async (id_usuario) => {
  const client = await pool.connect();
  try {
    const q = `
      SELECT h.*, a.titulo
      FROM historial h
      LEFT JOIN actividades a ON h.id_actividad = a.id_actividad
      WHERE h.id_usuario = $1
      ORDER BY h.fecha DESC;
    `;
    const res = await client.query(q, [id_usuario]);
    return res.rows;
  } finally {
    client.release();
  }
};
