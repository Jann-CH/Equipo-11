import { Router } from "express";
import { body } from "express-validator";

import { createItem, getItems } from "../controllers/item.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

// Todas las rutas de ítems requieren autenticación
router.use(authMiddleware);

// Reglas de validación para crear ítem
const createItemValidation = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre del ítem es obligatorio")
        .isLength({ max: 150 }).withMessage("El nombre no puede superar 150 caracteres")
        .escape(),
    body("descripcion")
        .optional()
        .trim()
        .escape(),
    body("precio")
        .notEmpty().withMessage("El precio es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
];

router.post("/", createItemValidation, validate, createItem);
router.get("/", getItems);

export default router;