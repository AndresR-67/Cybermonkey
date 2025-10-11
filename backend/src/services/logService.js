// src/services/logService.js
import LogModel from "../models/logModel.js";

export const createLog = async ({ tabla, operacion, detalle = "", datos_anteriores = null, datos_nuevos = null, usuario_sistema = null, meta = {} }) => {
  const log = new LogModel({
    tabla,
    operacion,
    detalle,
    datos_anteriores,
    datos_nuevos,
    usuario_sistema,
    meta
  });
  return log.save();
};
