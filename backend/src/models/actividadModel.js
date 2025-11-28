// src/models/actividadModel.js
import pool from "../config/db.js";

/* ============================
   FUNCIONES ACTIVIDAD
============================ */

// Crear una nueva actividad (RF10)
export const createActividad = async ({ id_usuario, titulo, descripcion, fecha_vencimiento, prioridad }) => {
  const client = await pool.connect();
  try {
    const q = `
      INSERT INTO actividades (id_usuario, titulo, descripcion, fecha_vencimiento, prioridad, estado, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, 'pendiente', NOW())
      RETURNING *;
    `;
    const values = [id_usuario, titulo, descripcion, fecha_vencimiento, prioridad];
    const res = await client.query(q, values);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Listar actividades de un usuario (RF14)
export const getActividadesByUsuario = async (id_usuario, estado = null) => {
  const client = await pool.connect();
  try {
    let q = `SELECT * FROM actividades WHERE id_usuario = $1`;
    const values = [id_usuario];

    if (estado) {
      q += ` AND estado = $2`;
      values.push(estado);
    }

    q += ` ORDER BY fecha_vencimiento ASC;`;
    const res = await client.query(q, values);
    return res.rows;
  } finally {
    client.release();
  }
};

// Obtener actividad por ID
export const getActividadById = async (id_actividad) => {
  const client = await pool.connect();
  try {
    const q = `SELECT * FROM actividades WHERE id_actividad = $1 LIMIT 1;`;
    const res = await client.query(q, [id_actividad]);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Actualizar actividad (RF11)
export const updateActividad = async (id_actividad, fieldsToUpdate) => {
  const client = await pool.connect();
  try {
    const campos = [];
    const valores = [];
    let i = 1;

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      campos.push(`${key} = $${i}`);
      valores.push(value);
      i++;
    }

    if (campos.length === 0) return null;

    const q = `
      UPDATE actividades
      SET ${campos.join(", ")}
      WHERE id_actividad = $${i}
      RETURNING *;
    `;
    valores.push(id_actividad);
    const res = await client.query(q, valores);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Eliminar actividad (RF12)
export const deleteActividad = async (id_actividad) => {
  const client = await pool.connect();
  try {
    const q = `DELETE FROM actividades WHERE id_actividad = $1 RETURNING *;`;
    const res = await client.query(q, [id_actividad]);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Marcar actividad como completada (RF13 + RF18: insert en historial)
export const completarActividad = async (id_actividad, id_usuario, xpOtorgado = 0) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Obtener la actividad
    const resActividad = await client.query(
      `SELECT * FROM actividades WHERE id_actividad = $1`,
      [id_actividad]
    );
    const actividad = resActividad.rows[0];
    if (!actividad) throw new Error("Actividad no encontrada");

    // Calcular si ya había sido completada antes
    const yaHabiaSidoCompletada = actividad.completada_historial;

    // Actualizar estado y fecha completada + xp_otorgado
    const q1 = `
      UPDATE actividades
      SET estado = 'completada',
          fecha_completada = NOW(),
          completada_historial = TRUE,
          xp_otorgado = $2
      WHERE id_actividad = $1
      RETURNING *;
    `;
    const res1 = await client.query(q1, [id_actividad, xpOtorgado]);

    // Registrar en historial
    await client.query(
      `INSERT INTO historial (id_usuario, id_actividad, fecha, accion)
       VALUES ($1, $2, NOW(), 'COMPLETAR')
       RETURNING *;`,
      [id_usuario, id_actividad]
    );

    await client.query("COMMIT");
    return { actividad: res1.rows[0], yaHabiaSidoCompletada };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Revertir actividad a pendiente
export const revertirActividad = async (id_actividad, id_usuario) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const resActividad = await client.query(
      `SELECT * FROM actividades WHERE id_actividad = $1`,
      [id_actividad]
    );
    const actividad = resActividad.rows[0];
    if (!actividad) throw new Error("Actividad no encontrada");

    // Guardar XP que ya se otorgó para evitar restar de más
    const xpRevertido = actividad.xp_otorgado || 0;

    const q1 = `
      UPDATE actividades
      SET estado = 'pendiente',
          xp_revertido = $2
      WHERE id_actividad = $1
      RETURNING *;
    `;
    const res1 = await client.query(q1, [id_actividad, xpRevertido]);

    // Registrar en historial
    await client.query(
      `INSERT INTO historial (id_usuario, id_actividad, fecha, accion)
       VALUES ($1, $2, NOW(), 'DESHACER_COMPLETAR')
       RETURNING *;`,
      [id_usuario, id_actividad]
    );

    await client.query("COMMIT");
    return { actividad: res1.rows[0], xpRevertido };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


