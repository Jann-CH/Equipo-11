import { AppError } from "../utils/AppError.util.js";

/**
 * ==================================================
 * Middleware global de manejo de errores
 * ==================================================
 **/
export const errorHandler = (error, req, res, next) => {
    // Errores operacionales: son errores de negocio esperados
    if (error instanceof AppError && error.isOperational) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    // Errores de Multer (tipos de archivo, tamaño)
    if (error.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: `Error en la subida del archivo: ${error.message}`,
        });
    }

    // Errores no operacionales: loguear en servidor, respuesta genérica al cliente
    console.error("[ERROR NO OPERACIONAL]", {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
    });

    return res.status(500).json({
        success: false,
        message: "Error interno del servidor. Por favor intente más tarde.",
    });
};