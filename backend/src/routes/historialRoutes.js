// src/routes/historialRoutes.js
import { Router } from "express";
import { listarHistorial } from "../controllers/historialController.js";
import auth from "../middleware/auth.js";

const router = Router();

// GET /api/historial -> historial del usuario autenticado
router.get("/", auth(), listarHistorial);

export default router;
