// src/models/alertaModel.js
import mongoose from "mongoose";

const alertaSchema = new mongoose.Schema({
  actividad_id: { type: Number, required: true },
  usuario_id: { type: Number, required: true },
  tipo: { type: String, enum: ["vencimiento","recordatorio"], required: true },
  mensaje: { type: String, required: true },
  fecha_generada: { type: Date, default: Date.now },
  leida: { type: Boolean, default: false },
});

export default mongoose.model("Alerta", alertaSchema);
