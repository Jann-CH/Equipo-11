import multer from "multer";
import { AppError } from "../utils/AppError.util.js";

/**
 * ==================================================
 * Middleware de subida de archivos (Multer)
 * ==================================================
 **/

const ALLOWED_MIME_TYPES = {
    // Imágenes (para logos)
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    // Documentos (para presupuestos PDF)
    "application/pdf": ".pdf",
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES[file.mimetype]) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                `Tipo de archivo no permitido: "${file.mimetype}". Solo se aceptan: JPEG, PNG, WEBP y PDF.`,
                400
            ),
            false
        );
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});