import { Router } from "express";

import { 
    createPresupuesto, 
    getPresupuestoById,
    addPdfController,
    filtroPresuestoController,
    getDashboardController,
    getBudgetController,
} from "../controllers/presupuesto.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateUUID } from "../middlewares/validateUUID.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Todas las rutas de presupuestos requieren autenticación
router.use(authMiddleware);

// ==========================================
// 1. RUTAS ESTÁTICAS (PRIMERO)
// ==========================================

// Ruta para el dashboard general
router.get("/dashboard", getDashboardController);

// Ruta para la lista con paginación
router.get("/lista", getBudgetController);

// Ruta para listar/filtrar presupuestos en general
router.get("/", filtroPresuestoController);


// ==========================================
// 2. RUTAS DINÁMICAS Y DE ACCIÓN (DESPUÉS)
// ==========================================

// Crear un presupuesto
router.post("/", createPresupuesto);

// Ruta para actualizar PDF
router.put("/:presupuestoId/pdf", upload.single("pdf"), addPdfController);

// Ruta por ID (DEBE IR AL FINAL para que no intercepte a /dashboard o /lista)
router.get("/:id", validateUUID, getPresupuestoById);

export default router;