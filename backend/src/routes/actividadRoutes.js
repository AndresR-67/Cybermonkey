// src/routes/actividadRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import * as actividadController from "../controllers/actividadController.js";

const router = Router();

// RF10 - Crear actividad (autenticado)
router.post("/", auth(), actividadController.createActividad);

// RF11 - Modificar actividad
router.patch("/:id", auth(), actividadController.updateActividad);

// RF12 - Eliminar actividad
router.delete("/:id", auth(), actividadController.deleteActividad);

// RF13 - Marcar actividad como completada
router.patch("/:id/completar", auth(), actividadController.completarActividad);

// RF14 - Listar actividades, opcional por estado
router.get("/", auth(), actividadController.getActividades);

export default router;
