// src/routes/gamificacionRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import * as gamificacionController from "../controllers/gamificacionController.js";

const router = express.Router();

// ===================== RUTAS DE GAMIFICACIÓN =====================

// Obtener progreso actual del usuario (XP, nivel, racha, etc.)
router.get("/progreso", auth(), gamificacionController.obtenerProgreso);

// Aplicar penalización manual (admin o sistema)
router.post("/penalizacion", auth(["admin"]), gamificacionController.aplicarPenalizacion);

// Registrar recompensa manual (admin)
router.post("/recompensa", auth(["admin"]), gamificacionController.otorgarRecompensa);

// Obtener historial de eventos gamificados (desde Mongo)
router.get("/historial", auth(), gamificacionController.obtenerHistorial);

// Otorgar medalla manual (admin)
router.post("/medalla", auth(["admin"]), gamificacionController.otorgarMedalla);

// Otorgar logro manual (admin)
router.post("/logro", auth(["admin"]), gamificacionController.otorgarLogro);


export default router;
