import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import http from "http";

dotenv.config();

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// pool de conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para la conexión con render
  },
});

// Test DB
const testDBConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Conexión a la DB exitosa, hora actual:", result.rows[0].now);
  } catch (err) {
    console.error("Error conectando a la DB:", err.message);
  }
};

// Crear servidor HTTP
const httpServer = http.createServer(app);

// Iniciar servidor
httpServer.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await testDBConnection();
});
