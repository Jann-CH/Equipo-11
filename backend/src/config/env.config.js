/**
 * ==================================================
 * env.config.js — Validación de variables de entorno
 * ==================================================
 *
 * Se importa PRIMERO en server.js para garantizar
 * que la aplicación no arranque con configuración
 * incompleta o incorrecta.
 *
 * Si falta alguna variable requerida → process.exit(1)
 * con un mensaje claro que indica qué falta.
 */
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    PORT: z.coerce.number().default(3000),

    // URL del frontend (para CORS)
    FRONTEND_URL: z.string().url("FRONTEND_URL debe ser una URL válida"),

    // Base de datos
    DB_HOST: z.string().min(1, "DB_HOST es requerido"),
    DB_PORT: z.coerce.number().default(5432),
    DB_USER: z.string().min(1, "DB_USER es requerido"),
    DB_PASSWORD: z.string().min(1, "DB_PASSWORD es requerido"),
    DB_NAME: z.string().min(1, "DB_NAME es requerido"),

    // JWT
    JWT_SECRET: z
        .string()
        .min(32, "JWT_SECRET debe tener al menos 32 caracteres por seguridad"),
    JWT_EXPIRES_IN: z
        .string()
        .regex(
            /^\d+[smhd]$/,
            'JWT_EXPIRES_IN: formato inválido. Usa "1h", "7d", "30m", "3600s"'
        )
        .default("1h"),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME es requerido"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY es requerido"),
    CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET es requerido"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Error crítico: Variables de entorno inválidas o faltantes:");
    console.error(
        JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
    );
    process.exit(1);
}

export const env = parsed.data;
