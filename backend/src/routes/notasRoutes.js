// src/routes/notasRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import * as notasController from "../controllers/notasController.js";

const router = Router({ mergeParams: true }); // mergeParams para usar id_actividad de la ruta padre

// RF15 - Crear nota rápida para una actividad
router.post("/", auth(), notasController.createNota);

// Listar notas de una actividad
router.get("/", auth(), notasController.getNotas);

export default router;
