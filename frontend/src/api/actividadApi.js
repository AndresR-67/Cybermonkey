// src/api/actividadApi.js

const BASE_URL = "http://localhost:3000/api";

// ===== Helpers =====
const getToken = () => localStorage.getItem("token");

const request = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ===== Actividades =====
export const getActividades = async () => {
  return await request("/actividades", { method: "GET" });
};

export const createActividad = async ({ titulo, descripcion, prioridad, fecha_vencimiento }) => {
  return await request("/actividades", {
    method: "POST",
    body: JSON.stringify({ titulo, descripcion, prioridad, fecha_vencimiento })
  });
};

export const updateActividad = async (id, { titulo, descripcion, prioridad, fecha_vencimiento }) => {
  return await request(`/actividades/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ titulo, descripcion, prioridad, fecha_vencimiento })
  });
};

export const completeActividad = async (id) => {
  return await request(`/actividades/${id}/completar`, { method: "PATCH" });
};

export const deleteActividad = async (id) => {
  return await request(`/actividades/${id}`, { method: "DELETE" });
};

// ===== Notas =====
export const addNota = async (actividadId, contenido) => {
  return await request(`/actividades/${actividadId}/notas`, {
    method: "POST",
    body: JSON.stringify({ contenido }) // genera { contenido: "..." }
  });
};

export const getNotas = async (actividadId) => {
  return await request(`/actividades/${actividadId}/notas`, { method: "GET" });
};

// ===== Historial =====
export const getHistorial = async () => {
  return await request("/historial", { method: "GET" });
};
