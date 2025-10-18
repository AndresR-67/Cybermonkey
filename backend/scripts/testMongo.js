// scripts/testMongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

//  Resolver ruta absoluta al backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//  Cargar variables desde backend/.env
dotenv.config({ path: join(__dirname, "../.env") });

//  Mostrar qué valor carga
console.log("Variable MONGO_URI:", process.env.MONGO_URI);

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("ERROR: No se encontró MONGO_URI en el archivo .env");
  process.exit(1);
}

//  Probar conexión a MongoDB
async function testMongo() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(uri, {});

    console.log("Conexión exitosa a MongoDB");

    // Crear modelo de prueba
    const testSchema = new mongoose.Schema({
      mensaje: String,
      fecha: { type: Date, default: Date.now },
    });

    const Test = mongoose.model("TestConexion", testSchema);

    // Guardar documento
    const doc = await Test.create({ mensaje: "Prueba exitosa desde testMongo.js" });
    console.log("Documento guardado:", doc);

    // Cerrar conexión
    await mongoose.connection.close();
    console.log("Conexión cerrada con éxito");
  } catch (err) {
    console.error("Error al conectar o guardar:", err);
  }
}

testMongo();
