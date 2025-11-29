// src/api/usuarioApi.js

const API_URL = `${import.meta.env.VITE_API_URL}/usuarios`;

// Obtener token del localStorage
const getToken = () => localStorage.getItem("token");

// Headers con autenticación
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`
});

// ===================== PERFIL =====================

// Obtener perfil del usuario
export const obtenerPerfil = async () => {
  const response = await fetch(`${API_URL}/perfil`, {
    method: "GET",
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al obtener perfil");
  }

  return response.json();
};

// Actualizar información del perfil
export const actualizarPerfil = async (datos) => {
  const response = await fetch(`${API_URL}/perfil`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al actualizar perfil");
  }

  return response.json();
};

// Cambiar contraseña
export const cambiarContrasena = async (contrasenaActual, nuevaContrasena) => {
  try {
    const response = await fetch(`${API_URL}/perfil/contrasena`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        contrasena_actual: contrasenaActual,
        nueva_contrasena: nuevaContrasena
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || "Error al cambiar contraseña");
    }

    return data;
  } catch (error) {
    console.error("Error en cambiarContrasena:", error);
    throw error;
  }
};

// Eliminar cuenta propia
export const eliminarCuenta = async (contrasena) => {
  try {
    const response = await fetch(`${API_URL}/perfil`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ contrasena })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || "Error al eliminar cuenta");
    }

    return data;
  } catch (error) {
    console.error("Error en eliminarCuenta:", error);
    throw error;
  }
};

// Cambiar foto de perfil
export const cambiarFotoPerfil = async (nuevaFotoURL) => {
  const response = await fetch(`${API_URL}/perfil/foto`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ nuevaFotoURL })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al cambiar foto");
  }

  return response.json();
};
