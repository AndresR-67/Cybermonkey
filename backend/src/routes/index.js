// src/routes/index.js
import express from "express";

// Importar tus subrutas
import authRoutes from "./authRoutes.js";
import logRoutes from "./logRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
//import actividadRoutes from "./actividadRoutes.js";
//Simport gamificacionRoutes from "./gamificacionRoutes.js";

// Inicializar router
const router = express.Router();

// Prefijos de API
router.use("/auth", authRoutes);
router.use("/logs", logRoutes);
router.use("/usuarios", usuarioRoutes);
//router.use("/actividades", actividadRoutes);
//router.use("/gamificacion", gamificacionRoutes);

// Ruta base de prueba
router.get("/", (req, res) => {
  res.json({
    status: "API funcionando correctamente",
    message: "Bien",
  });
});

export default router;
