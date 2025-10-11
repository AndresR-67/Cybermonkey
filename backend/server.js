import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import pool from "./src/config/db.js";
import connectMongo from "./src/config/mongo.js";
import routes from "./src/routes/index.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
pool.connect()
  .then(client => {
    console.log("Conectado a PostgreSQL");
    client.release();
  })
  .catch(err => console.error("Error conectando a PostgreSQL:", err.message));

// Conexión MongoDB
connectMongo();

// 🔗 Rutas API
app.use("/api", routes);

// Servidor HTTP
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});