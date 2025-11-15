import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

// Configuración del pool de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario para Render
  },
  max: 20, // máximo de clientes en el pool
  idleTimeoutMillis: 30000, // tiempo máximo que un cliente puede estar idle antes de ser cerrado
  connectionTimeoutMillis: 5000, // timeout para conectarse a la DB
});

// Listener global de errores de clientes inactivos
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

// Función para probar la conexión inicial
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Conectado a la base de datos PostgreSQL");
    client.release(); // liberar cliente de pool inmediatamente
  } catch (err) {
    console.error("Error de conexión inicial a la DB:", err.message);
  }
}

// Ejecutar prueba inicial
testConnection();

// Exportar el pool para consultas
export default pool;
