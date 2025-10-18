import express from "express";
import { getLogs, deleteLogs } from "../controllers/logController.js";

const router = express.Router();

router.get("/", getLogs);       // GET /api/logs
router.delete("/", deleteLogs); // DELETE /api/logs?tabla=usuarios&dias

export default router;
