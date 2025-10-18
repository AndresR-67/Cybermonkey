import LogModel from "../models/logModel.js";
import mongoose from "mongoose";


export const createLog = async (logData) => {
  try {
    console.log("Intentando guardar log en Mongo:", logData);

    const log = new LogModel({
      tabla: logData.tabla,
      operacion: logData.operacion,
      detalle: logData.detalle || "",
      datos_anteriores: logData.datos_anteriores || null,
      datos_nuevos: logData.datos_nuevos || null,
      usuario_sistema: logData.usuario_sistema || null,
      meta: logData.meta || {}
    });

    console.log("Base actual:", mongoose.connection.name);
    console.log("Colección real:", LogModel.collection.name);
    const saved = await log.save();
    
    return saved;
  } catch (err) {
    console.error("Error guardando log en Mongo:", err);
  }
};
