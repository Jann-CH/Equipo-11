import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.config.js";

// =========================
// Importación de Rutas
// =========================
import authRoutes from "./routes/auth.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import itemRoutes from "./routes/item.routes.js";
import presupuestoRoutes from "./routes/presupuesto.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* =========================
SEGURIDAD — Cabeceras HTTP
========================= */

// Helmet configura automáticamente cabeceras de seguridad HTTP:
// Content-Security-Policy, X-Frame-Options, HSTS, X-XSS-Protection, etc.
app.use(helmet());

/* =========================
CORS — Configuración restrictiva
========================= */

const allowedOrigins = [
    env.FRONTEND_URL,               // Variable de entorno (ej: http://localhost:3000)
    "https://app.innovalab.com",    // Dominio de producción
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Permitir requests sin origin (Postman, apps mobile nativas, curl)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS: Origen no permitido: ${origin}`));
            }
        },
        credentials: true, // Requerido para que las cookies HttpOnly funcionen
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* =========================
Middlewares Globales
========================= */

// cookieParser debe ir ANTES de las rutas para que req.cookies esté disponible
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan: formato detallado en desarrollo, formato estándar en producción
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

/* =========================
Ruta raíz
========================= */

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "API de InnovaLab funcionando correctamente",
        version: "1.0.0",
    });
});

/* =========================
Rutas
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/presupuestos", presupuestoRoutes);

/* ==============================
HEALTH CHECK
============================== */

app.get("/api/health", (_req, res) =>
    res.status(200).json({ ok: true, env: env.NODE_ENV })
);

/* =========================
Manejo de errores 404
========================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
});

/* ==============================
ERROR HANDLER GLOBAL
============================== */

app.use(errorHandler);

export default app;
