import LogModel from "../models/logModel.js";


export const getLogs = async (req, res) => {
  try {
    const { tabla, operacion, usuario, fecha_inicio, fecha_fin } = req.query;

    const filtros = {};
    if (tabla) filtros.tabla = tabla;
    if (operacion) filtros.operacion = operacion;
    if (usuario) filtros.usuario_sistema = usuario;
    if (fecha_inicio || fecha_fin) {
      filtros.fecha = {};
      if (fecha_inicio) filtros.fecha.$gte = new Date(fecha_inicio);
      if (fecha_fin) filtros.fecha.$lte = new Date(fecha_fin);
    }

    const logs = await LogModel.find(filtros).sort({ fecha: -1 });
    res.json({ total: logs.length, logs });
  } catch (error) {
    console.error("Error obteniendo logs:", error);
    res.status(500).json({ message: "Error interno al obtener los logs." });
  }
};

/**
 * Eliminar logs antiguos o por filtro
 * (por ejemplo, logs de más de 30 días o de una tabla específica)
 */
export const deleteLogs = async (req, res) => {
  try {
    const { tabla, dias } = req.query;
    const filtros = {};

    if (tabla) filtros.tabla = tabla;
    if (dias) {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - Number(dias));
      filtros.fecha = { $lte: fechaLimite };
    }

    const result = await LogModel.deleteMany(filtros);
    res.json({ message: "Logs eliminados correctamente.", eliminados: result.deletedCount });
  } catch (error) {
    console.error("Error eliminando logs:", error);
    res.status(500).json({ message: "Error interno al eliminar los logs." });
  }
};