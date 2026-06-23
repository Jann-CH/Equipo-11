import { Router } from "express";
import { createCliente, getClientes } from "../controllers/cliente.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware); 
router.post("/", createCliente);
router.get("/", getClientes);

export default router;