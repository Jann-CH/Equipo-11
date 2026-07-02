import { body } from "express-validator"; 

// Reglas de validación para el registro: Define qué debe cumplir cada campo
export const registerValidation = [
    body("email") // Valida el campo 'email' del JSON enviado
        .isEmail().withMessage("Debe ser un email válido") // Verifica formato de email
        .normalizeEmail(), // Limpia el email (ej: minúsculas, elimina puntos extra)
    body("password") // Valida el campo 'password'
        .isString() // Asegura que sea texto
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres") // Longitud mínima
        .matches(/\d/).withMessage("La contraseña debe contener al menos un número"), // Expresión regular para asegurar un dígito
    body("nombreEmprendimiento") // Valida el campo 'nombreEmprendimiento'
        .trim() // Quita espacios en blanco al inicio y final
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres") // Rango de longitud
        .escape(), // Escapa caracteres especiales (seguridad contra inyección XSS)
];

// Reglas de validación para el inicio de sesión: Define qué debe cumplir cada campo
export const loginValidation = [
    body("email")
        .isEmail().withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .isString()
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
];  