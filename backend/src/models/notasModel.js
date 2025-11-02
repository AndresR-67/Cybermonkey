// src/models/notasModel.js
import pool from "../config/db.js";

/* ============================
   FUNCIONES NOTAS
============================ */

// Crear nota rápida para una actividad (RF15)
export const createNota = async ({ id_usuario, id_actividad, contenido }) => {
  const client = await pool.connect();
  try {
    const q = `
      INSERT INTO notas (id_usuario, id_actividad, contenido, fecha_creacion)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [id_usuario, id_actividad, contenido];
    const res = await client.query(q, values);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Listar notas de una actividad
export const getNotasByActividad = async (id_actividad) => {
  const client = await pool.connect();
  try {
    const q = `SELECT * FROM notas WHERE id_actividad = $1 ORDER BY fecha_creacion ASC;`;
    const res = await client.query(q, [id_actividad]);
    return res.rows;
  } finally {
    client.release();
  }
};
