import { Router } from "express";
import { body } from "express-validator";

import { createCliente, getClientes } from "../controllers/cliente.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

// Todas las rutas de clientes requieren autenticación
router.use(authMiddleware);

// Reglas de validación para crear cliente
const createClienteValidation = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre del cliente es obligatorio")
        .isLength({ max: 100 }).withMessage("El nombre no puede superar 100 caracteres")
        .escape(),
    body("apellido")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("El apellido no puede superar 100 caracteres")
        .escape(),
    body("email")
        .optional()
        .isEmail().withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("cuit")
        .optional()
        .trim()
        .isLength({ max: 20 }).withMessage("El CUIT no puede superar 20 caracteres")
        .escape(),
    body("telefono")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("El teléfono no puede superar 50 caracteres")
        .escape(),
];

router.post("/", createClienteValidation, validate, createCliente);
router.get("/", getClientes);

export default router;