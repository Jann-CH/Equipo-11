import { Router } from "express";
import { createPresupuesto, getPresupuestoById } from "../controllers/presupuesto.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", createPresupuesto);
router.get("/:id", getPresupuestoById);

export default router;