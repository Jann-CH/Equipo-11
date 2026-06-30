import { registerService, loginService } from "../services/auth.service.js";
import { env } from "../config/env.config.js";

/**
 * Opciones compartidas para la cookie de autenticación.
 * Se centralizan aquí para que login y logout usen
 * exactamente la misma configuración.
 */
const COOKIE_OPTIONS = {
    httpOnly: true,  // Inaccesible desde JavaScript del navegador
    secure: env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict", // Defensa contra CSRF
    maxAge: 60 * 60 * 1000, // 1 hora en milisegundos
    path: "/",
};

/**
 * POST /api/auth/register
 * Registra un nuevo usuario.
 */
export const register = async (req, res, next) => {
    try {
        const user = await registerService(req.body);
        res.status(201).json({ success: true, user });
    } catch (error) {
        next(error); 
    }
};

/**
 * POST /api/auth/login
 * Autentica al usuario y emite el JWT como Cookie HttpOnly.
 * El token NUNCA se envía en el body de la respuesta.
 */
export const login = async (req, res, next) => {
    try {
        const result = await loginService(req.body);

        // Emitir el token como Cookie HttpOnly
        // El navegador la gestiona automáticamente y
        // ningún script de JS puede leerla
        res.cookie("auth_token", result.token, COOKIE_OPTIONS);

        res.json({
            success: true,
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/logout
 * Cierra la sesión eliminando la cookie del navegador.
 */
export const logout = (_req, res) => {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
    res.json({ success: true, message: "Sesión cerrada correctamente" });
};

/**
 * GET /api/auth/me
 * Retorna los datos del usuario autenticado.
 * Protegida por authMiddleware.
 */
export const getMe = (req, res) => {
    res.json({ success: true, user: req.usuario });
};