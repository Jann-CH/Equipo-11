import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * Rate limiter para endpoints de autenticación.
 * Máximo 10 intentos por IP cada 15 minutos.
 * Previene ataques de fuerza bruta sobre contraseñas.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        success: false,
        message: "Demasiados intentos. Por favor intente nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Reglas de validación para el registro
const registerValidation = [
    body("email")
        .isEmail().withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .isString()
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/\d/).withMessage("La contraseña debe contener al menos un número"),
    body("nombreEmprendimiento")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres")
        .escape(),
];

// Reglas de validación para el login
const loginValidation = [
    body("email")
        .isEmail().withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .isString().withMessage("La contraseña es requerida")
        .notEmpty().withMessage("La contraseña no puede estar vacía"),
];

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login",    authLimiter, loginValidation,    validate, login);
router.post("/logout",   authMiddleware, logout);
router.get("/me",        authMiddleware, getMe);

export default router;

