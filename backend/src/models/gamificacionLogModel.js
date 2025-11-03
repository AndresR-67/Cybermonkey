// src/models/gamificacionLogModel.js
import mongoose from "mongoose";

const gamificacionLogSchema = new mongoose.Schema({
  usuario_id: { type: Number, required: true },
  tipo: { 
    type: String, 
    enum: ["recompensa", "penalizacion", "racha", "medalla", "logro"], 
    required: true 
  },
  xp: { type: Number, default: 0 },
  detalle: { type: String },
  origen: { 
    type: String, 
    enum: ["actividad", "sistema", "manual"], 
    default: "actividad" 
  },
  meta: { type: Object },
  fecha: { type: Date, default: Date.now }
});

const GamificacionLogModel = mongoose.model("GamificacionLog", gamificacionLogSchema);
export default GamificacionLogModel;
