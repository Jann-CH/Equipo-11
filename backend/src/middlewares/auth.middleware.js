import { verificarToken } from "../utils/jwt.util.js";
import { findUserByIdRepository } from "../repositories/usuario.repository.js";

/**
 * ==================================================
 * Middleware: authMiddleware
 * ==================================================
 **/
export const authMiddleware = async (req, res, next) => {
    try {
        /* =========================================
            1. LEER TOKEN (Cookie o Header)
        ========================================= */
        const cookieToken = req.cookies?.auth_token;
        const headerToken = req.headers.authorization?.split(" ")[1];
        const token = cookieToken || headerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No autenticado. Por favor inicie sesión.",
            });
        }

        /* =========================================
            2. VERIFICAR Y DECODIFICAR
        ========================================= */
        const decoded = verificarToken(token);

        /* =========================================
            3. VERIFICAR QUE EL USUARIO EXISTE
        ========================================= */
        const usuario = await findUserByIdRepository(decoded.id);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado o dado de baja.",
            });
        }

        /* =========================================
            4. INYECTAR EN EL REQUEST
        ========================================= */
        req.usuario = usuario;
        req.auth = { id: usuario.id };

        next();

    } catch (error) {
        // No exponer detalles del error JWT al cliente
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado. Por favor inicie sesión nuevamente.",
        });
}
};