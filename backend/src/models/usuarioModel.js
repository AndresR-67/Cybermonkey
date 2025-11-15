// src/models/usuarioModel.js
import pool from "../config/db.js";

/**
 * columnas: id_usuario, nombres, apellidos, username, correo,
 * contrasena, foto_perfil, fecha_creacion, id_rol, estado
 */

/* ============================
   FUNCIONES DE USUARIO
============================ */

// Crear cuenta
export const createUser = async ({
  nombres,
  apellidos,
  username,
  correo,
  contrasena,
  foto_perfil = null,
  id_rol = 2,
  estado = "activo",
}) => {
  const client = await pool.connect();
  try {
    const q = `
      INSERT INTO usuarios (nombres, apellidos, username, correo, contrasena, foto_perfil, id_rol, estado, fecha_creacion)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
      RETURNING id_usuario, nombres, apellidos, username, correo, foto_perfil, fecha_creacion, id_rol, estado;
    `;
    const values = [nombres, apellidos, username, correo, contrasena, foto_perfil, id_rol, estado];
    const res = await client.query(q, values);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en createUser:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Buscar por correo o username
export const findByCorreoOrUsername = async (identifier) => {
  const client = await pool.connect();
  try {
    const q = `
      SELECT u.*, r.nombre AS rol_nombre
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.correo = $1 OR u.username = $1
      LIMIT 1;
    `;
    const res = await client.query(q, [identifier]);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en findByCorreoOrUsername:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Obtener usuario por ID
export const findById = async (id) => {
  const client = await pool.connect();
  try {
    const q = `
      SELECT u.id_usuario, u.nombres, u.apellidos, u.username, u.correo,
             u.foto_perfil, u.fecha_creacion, u.id_rol, r.nombre AS rol_nombre, u.estado
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = $1
      LIMIT 1;
    `;
    const res = await client.query(q, [id]);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en findById:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Actualizar usuario
export const updateUser = async (id_usuario, fieldsToUpdate) => {
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
      UPDATE usuarios
      SET ${campos.join(", ")}
      WHERE id_usuario = $${i}
      RETURNING id_usuario, nombres, apellidos, username, correo, foto_perfil, fecha_creacion, id_rol, estado;
    `;
    valores.push(id_usuario);

    const res = await client.query(q, valores);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en updateUser:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Actualizar contraseña
export const updatePassword = async (id_usuario, nuevaContrasena) => {
  const client = await pool.connect();
  try {
    const q = `
      UPDATE usuarios
      SET contrasena = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, username, correo;
    `;
    const res = await client.query(q, [nuevaContrasena, id_usuario]);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en updatePassword:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Actualizar foto de perfil
export const updateFotoPerfil = async (id_usuario, nuevaFotoURL) => {
  const client = await pool.connect();
  try {
    const q = `
      UPDATE usuarios
      SET foto_perfil = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, username, correo, foto_perfil;
    `;
    const res = await client.query(q, [nuevaFotoURL, id_usuario]);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en updateFotoPerfil:", err);
    throw err;
  } finally {
    client.release();
  }
};

/* ============================
   FUNCIONES ADMIN
============================ */

// Listar usuarios
export const findAllUsers = async () => {
  const client = await pool.connect();
  try {
    const q = `
      SELECT u.id_usuario, u.nombres, u.apellidos, u.username, u.correo, u.foto_perfil,
             u.fecha_creacion, u.id_rol, r.nombre AS rol_nombre, u.estado
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario ASC;
    `;
    const res = await client.query(q);
    return res.rows;
  } catch (err) {
    console.error("❌ Error en findAllUsers:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Eliminar usuario
export const deleteUser = async (id_usuario) => {
  const client = await pool.connect();
  try {
    const q = `
      DELETE FROM usuarios
      WHERE id_usuario = $1
      RETURNING id_usuario, username, correo;
    `;
    const res = await client.query(q, [id_usuario]);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error en deleteUser:", err);
    throw err;
  } finally {
    client.release();
  }
};
