import express from "express";
import MensajeMotivacional from "../models/mensajeModel.js";
const router = express.Router();

router.get("/:categoria", async (req, res) => {
  try {
    const { categoria } = req.params;

    const mensajes = await MensajeMotivacional.aggregate([
      { $match: { categoria, activo: true } },
      { $sample: { size: 1 } }
    ]);

    if (mensajes.length === 0) {
      return res.json({ mensaje: "¡Buen trabajo!" });
    }

    return res.json({ mensaje: mensajes[0].texto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener mensaje motivacional" });
  }
});

export default router;
