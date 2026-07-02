import cloudinary from "../config/cloudinary.config.js";
import { generateFolderName } from "../utils/generateFolderName.util.js";
/**
 * COMO EXPORTALO PARA USARLO EN LOS MODULOS SERVICE QUE LLEVA LA LOGICA.
 * Importación con llaves {}
 * Se utiliza cuando el archivo exporta elementos por nombre (Named Export).
 * import {
 *     uploadLogoService,
 *     uploadPdfService
 * } from "./file.service.js";
 */

/**
 * ==========================================================
 * SUBIR LOGO DE UNA EMPRESA
 * ==========================================================
 */
export const uploadLogoService = async (
    file,
    nombreDeCarpeta,
) => {

    //convierto el nombre de la carpeta " Panaderi Pepito " en Panaderia-Pepito.
    const nombreFolder = await generateFolderName(nombreDeCarpeta);

    // Sube la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(
        file,
        {
            // Ruta donde se almacenará el logo
            //empresa/panaderia-pepito/logo
            folder: `empresas/${nombreFolder}/logos`,
            // Indica que el archivo es una imagen
            resource_types: "image",
            // Si existe un logo con el mismo nombre
            // Cloudinary lo reemplazará
            overwrite: true,

        }
    );
    // Retornamos únicamente los datos que
    // normalmente se guardan en PostgretSQL

    return {
        public_id: result.public_id,
        url: result.secure_url,
    }

}

/**
 * ==========================================================
 * SUBIR PDF DE PRESUPUESTO
 * ==========================================================
 */

export const uploadPresupuestoService = async (
    filePath,
    nombreDeCarpeta,
    creacionFecha,
) => {
    //convierto el nombre de la carpeta " Panaderi Pepito " en Panaderia-Pepito.
    const nombreFolder = await generateFolderName(nombreDeCarpeta);
    // Sube el PDF a Cloudinary
    const result = await cloudinary.uploader.upload(
        filePath,
        {

            // Ruta donde se almacenarán
            // los presupuestos de la empresa
            // empresas/panaderia-san-martin/presupuestos
            folder: `empresas/${nombreFolder}/presupuestos/${creacionFecha}`,
            // Los PDFs se almacenan como RAW
            resource_type: "raw",
            // Mantiene el nombre del archivo original
            use_filename: true,
            // Evita conflictos de nombres
            unique_filename: true

        }
    );

    return {
        public_id: result.public_id,
        url: result.secure_url
    };
}