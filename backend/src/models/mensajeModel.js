// src/models/mensajeModel.js
import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  categoria: {
    type: String,
    enum: ["completada", "logro", "penalizacion", "nivel", "racha", "generico"],
    required: true,
    index: true
  },
  texto: { type: String, required: true },
  idioma: { type: String, default: "es" },
  activo: { type: Boolean, default: true },
  meta: { type: Object, default: null }, // uso opcional: {minNivel:.., prioridad:.., ...}
  creado_en: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("MensajeMotivacional", mensajeSchema);
