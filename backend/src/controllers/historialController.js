// src/controllers/historialController.js
import { getHistorialByUsuario } from "../models/historialModel.js";

export const listarHistorial = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const historial = await getHistorialByUsuario(id_usuario);
    return res.json({ historial });
  } catch (error) {
    console.error("Error listarHistorial:", error);
    return res.status(500).json({ message: "Error al obtener historial" });
  }
};
