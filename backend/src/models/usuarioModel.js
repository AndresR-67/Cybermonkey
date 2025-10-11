// src/models/usuarioModel.js
import pool from "../config/db.js";

/**
 * * columnas usadas:
 * id_usuario, nombres, apellidos, username, correo, contrasena, foto_perfil, fecha_creacion, id_rol, estado
 */

export const createUser = async ({ nombres, apellidos, username, correo, contrasena, foto_perfil = null, id_rol = null }) => {
  const client = await pool.connect();
  try {
    const q = `
      INSERT INTO usuarios (nombres, apellidos, username, correo, contrasena, foto_perfil, id_rol)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id_usuario, nombres, apellidos, username, correo, foto_perfil, fecha_creacion, id_rol, estado;
    `;
    const values = [nombres, apellidos, username, correo, contrasena, foto_perfil, id_rol];
    const res = await client.query(q, values);
    return res.rows[0];
  } finally {
    client.release();
  }
};

export const findByCorreoOrUsername = async (identifier) => {
  const client = await pool.connect();
  try {
    const q = `SELECT * FROM usuarios WHERE correo = $1 OR username = $1 LIMIT 1;`;
    const res = await client.query(q, [identifier]);
    return res.rows[0];
  } finally {
    client.release();
  }
};

export const findById = async (id) => {
  const client = await pool.connect();
  try {
    const q = `SELECT id_usuario, nombres, apellidos, username, correo, foto_perfil, fecha_creacion, id_rol, estado FROM usuarios WHERE id_usuario = $1 LIMIT 1;`
    const res = await client.query(q, [id]);
    return res.rows[0];
  } finally {
    client.release();
  }
};

