// backend/scripts/seedMensajesMotivacionales.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import MensajeMotivacional from "../src/models/mensajeModel.js";

dotenv.config();

const mensajes = [
  // ============================
  //   MENSAJES DE TAREA COMPLETADA
  // ============================
  {
    categoria: "completada",
    texto: "¡Excelente! Completaste una tarea más, sigue así.",
    idioma: "es",
  },
  {
    categoria: "completada",
    texto: "Buen trabajo, cada paso suma hacia tus metas.",
    idioma: "es",
  },

  // ============================
  //         LOGRO
  // ============================
  {
    categoria: "logro",
    texto: "¡Nuevo logro desbloqueado! Estás avanzando de forma increíble.",
    idioma: "es",
  },
  {
    categoria: "logro",
    texto: "Tu esfuerzo está dando frutos. ¡Bien hecho!",
    idioma: "es",
  },

  // ============================
  //       PENALIZACION
  // ============================
  {
    categoria: "penalizacion",
    texto: "No pasa nada, cada caída es una oportunidad para levantarte más fuerte.",
    idioma: "es",
  },
  {
    categoria: "penalizacion",
    texto: "Las penalizaciones son parte del camino. Retoma el ritmo cuando estés listo.",
    idioma: "es",
  },

  // ============================
  //          SUBIDA DE NIVEL
  // ============================
  {
    categoria: "nivel",
    texto: "¡Has alcanzado un nuevo nivel! Tu progreso es impresionante.",
    idioma: "es",
  },
  {
    categoria: "nivel",
    texto: "Nivel superior alcanzado. ¡Estás subiendo como la espuma!",
    idioma: "es",
  },

  // ============================
  //            RACHAS
  // ============================
  {
    categoria: "racha",
    texto: "¡Mantienes una racha increíble! No te detengas.",
    idioma: "es",
    meta: { minRacha: 3 }
  },
  {
    categoria: "racha",
    texto: "Ya son varios días seguidos de avance. ¡Felicidades!",
    idioma: "es",
    meta: { minRacha: 5 }
  },

  // ============================
  //        GENERICOS
  // ============================
  {
    categoria: "generico",
    texto: "No importa el ritmo, lo importante es seguir avanzando.",
    idioma: "es",
  },
  {
    categoria: "generico",
    texto: "Eres capaz de mucho más de lo que crees.",
    idioma: "es",
  },
];

async function seed() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Eliminando datos antiguos...");
    await MensajeMotivacional.deleteMany({});

    console.log("Insertando mensajes motivacionales...");
    await MensajeMotivacional.insertMany(mensajes);

    console.log("✔ Mensajes motivacionales insertados correctamente.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al insertar mensajes:", err);
    process.exit(1);
  }
}

seed();
