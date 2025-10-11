// src/models/logModel.js
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  tabla: { type: String, required: true }, // e.g., 'usuarios'
  operacion: { type: String, required: true }, // LOGIN, LOGOUT, CREATE, UPDATE, DELETE
  detalle: { type: String },
  datos_anteriores: { type: mongoose.Schema.Types.Mixed },
  datos_nuevos: { type: mongoose.Schema.Types.Mixed },
  usuario_sistema: { type: String }, // id_usuario, username o 'sistema'
  fecha: { type: Date, default: () => new Date() },
  meta: { type: mongoose.Schema.Types.Mixed } // ip, userAgent, resultado, tokenExp, etc.
}, { collection: "event_logs" });

const LogModel = mongoose.model("Log", LogSchema);
export default LogModel;
