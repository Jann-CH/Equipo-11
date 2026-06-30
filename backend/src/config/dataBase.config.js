import pool from "../database/connection.js";

export const connectDB = async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("✅ PostgreSQL conectado:", result.rows[0].now);
    } catch (error) {
        console.error("❌ Error de conexión a PostgreSQL:", error.message);
        process.exit(1);
    }
};