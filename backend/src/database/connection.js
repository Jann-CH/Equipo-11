import pg from "pg";
import { env } from "../config/env.config.js";

const { Pool } = pg;

const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,

    // Configuración de producción
    max: 20,                         // Máximo de conexiones simultáneas
    idleTimeoutMillis: 30_000,       // Liberar conexiones inactivas tras 30s
    connectionTimeoutMillis: 2_000,  // Error si no conecta en 2s

    // SSL obligatorio en producción
    ssl: env.NODE_ENV === "production"
        ? { rejectUnauthorized: true }
        : false,
});

// Loguear errores de conexiones idle para detectar problemas silenciosos
pool.on("error", (err) => {
    console.error("Error inesperado en cliente PostgreSQL idle:", err.message);
});

export default pool;