import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";

/**
 * ==================================================
 * jwt.util.js — Única fuente de verdad para JWT
 * ==================================================
 *
 * Centraliza la configuración del secreto y la
 * expiración. Ningún otro archivo del proyecto
 * debe importar 'jsonwebtoken' directamente.
 */

/**
 * Genera un token JWT firmado.
 * @param {object} payload - Datos a incluir (id, email)
 * @returns {string} Token JWT
 */
export const generarToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
};

/**
 * Verifica y decodifica un token JWT.
 * Lanza un error si el token es inválido o expiró.
 * @param {string} token
 * @returns {object} Payload decodificado
 */
export const verificarToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};