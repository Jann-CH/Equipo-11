import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// =========================
// Importación de Rutas
// =========================
import authRoutes from "./routes/auth.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import itemRoutes from "./routes/item.routes.js";
import presupuestoRoutes from "./routes/presupuesto.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

/* =========================
Middlewares Globales
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* =========================
Ruta de prueba
========================= */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API funcionando correctamente",
    });
});

/* =========================
Rutas
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);       // <-- Nueva ruta de Clientes
app.use("/api/items", itemRoutes);             // <-- Nueva ruta de Items (Catálogo)
app.use("/api/presupuestos", presupuestoRoutes); // <-- Nueva ruta de Presupuestos

/* ==============================
HEALTH CHECK
============================== */

app.get("/api/health", (_req, res) =>
    res.status(200).json({ ok: true })
);

/* =========================
Manejo de errores 404
========================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
    });
});

/* ==============================
ERROR HANDLER GLOBAL
============================== */

app.use(errorHandler);

export default app;
