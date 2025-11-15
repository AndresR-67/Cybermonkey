import pool from "../config/db.js";
export const registrarAccion = async ({ id_usuario, id_actividad, accion, titulo }) => {
  const client = await pool.connect();
  try {
    const q = `
      INSERT INTO historial (id_usuario, id_actividad, accion, titulo, fecha)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [id_usuario, id_actividad, accion, titulo];
    const res = await client.query(q, values);
    return res.rows[0];
  } finally {
    client.release();
  }
};
