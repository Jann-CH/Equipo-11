import cloudinary from "../config/cloudinary.config.js";
import { generateFolderName } from "../utils/generateFolderName.util.js";

/**
 * ==================================================
 * files.service.js — Subida de archivos a Cloudinary
 * ==================================================
 **/

/**
 * Sube un buffer de imagen como logo de empresa a Cloudinary.
 * @param {Buffer} fileBuffer - Buffer del archivo (req.file.buffer)
 * @param {string} nombreDeCarpeta - Nombre del emprendimiento
 */
export const uploadLogoService = async (fileBuffer, nombreDeCarpeta) => {
    const nombreFolder = generateFolderName(nombreDeCarpeta);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `empresas/${nombreFolder}/logos`,
                resource_type: "image", // Corregido: era "resource_types" (typo)
                overwrite: true,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        );
        stream.end(fileBuffer);
    });
};

/**
 * Sube un buffer de PDF como presupuesto de empresa a Cloudinary.
 * @param {Buffer} fileBuffer - Buffer del archivo (req.file.buffer)
 * @param {string} nombreDeCarpeta - Nombre del emprendimiento
 */
export const uploadPresupuestoService = async (fileBuffer, nombreDeCarpeta) => {
    const nombreFolder = generateFolderName(nombreDeCarpeta);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `empresas/${nombreFolder}/presupuestos`,
                resource_type: "raw",   // PDFs como raw
                use_filename: true,
                unique_filename: true,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        );
        stream.end(fileBuffer);
    });
};