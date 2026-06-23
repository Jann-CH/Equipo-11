import jwt from "jsonwebtoken";
import {
    findUserByIdRepository
} from "../repositories/usuario.repository.js";

// verificacion del token
export const authMiddleware = async (req, res, next) => {
    // Middleware que valida el token antes de continuar.
    try {
        /* =========================================
            HEADER AUTHORIZATION
        ========================================= */

        // Obtiene el header Authorization del request
        const authHeader = req.headers.authorization;

        // Error si no existe el header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado",
            });
        }
        /* =========================================
            FORMATO:
            Bearer TOKEN
        ========================================= */

        //extraer el token quitando "Bearer"
        const token = authHeader.split(" ")[1];

        // Error si no hay token válido
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token inválido",
            });
        }

        /*==========================================
            VERIFY JWT
        ============================================ */

        // Verifica y decodifica el token usando la clave secreta
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        );
        

        /* =========================================
            BUSCAR USUARIO
        ========================================= */
        /**
         * En PostgreeSQL buyscamos mediante repositorios
        */

        const usuario = await findUserByIdRepository(decoded.id);
        // Si el usuario no existe
        if(!usuario){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        /* =========================================
            INYECTAR EN REQUEST
        ========================================= */

        req.usuario = usuario; 

        req.auth = {
            id: usuario.id
        }

        next()



    } catch (error) {
        console.log("Error real en el middleware:", error);
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado"
        });
     }
}