import { uploadPresupuestoService } from "./files.service.js";
import { AppError } from "../utils/AppError.util.js";
import {
    createPresupuestoTransaccionRepository,
    findPresupuestoConDetallesRepository,
} from "../repositories/presupuesto.repository.js";

/**
 * Estados válidos del presupuesto.
 * Cualquier valor fuera de esta lista será rechazado.
 */
const ESTADOS_VALIDOS = ["Borrador", "Guardado", "Enviado", "Aceptado", "Rechazado"];
/**
 * ==================================================
 * SERVICE: Crear presupuesto completo
 * ==================================================
 **/
export const createPresupuestoCompletoService = async (
    { 
        usuarioId, 
        clienteId, 
        fechaVencimiento, 
        estado, 
        detalles 
    },
    file,
    nombreEmprendimiento
) => {
    // 1. Validaciones de negocio
    // Un presupuesto sin ítems no tiene sentido: cortamos acá antes de tocar
    // Cloudinary o la base de datos.
    if (!detalles || detalles.length === 0) {
        throw new AppError("No se puede generar un presupuesto sin ítems cargados", 400);
    }

    // Si no viene estado desde el front, arranca como Borrador por defecto.
    const estadoFinal = estado || "Borrador";
    // Rechazamos cualquier valor que no esté en la lista blanca de estados
    // permitidos (evita que llegue un string cualquiera y rompa el CHECK de la DB
    // con un error feo de Postgres en vez de un error de negocio prolijo).
    if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
        throw new AppError(
            `Estado inválido: "${estadoFinal}". Los valores permitidos son: ${ESTADOS_VALIDOS.join(", ")}.`,
            400
        );
    }

    // 2. Cálculo de subtotales y total en el backend (nunca confiar en el frontend)
    // Aunque el front ya calculó y mostró estos números en pantalla, NO nos fiamos:
    // alguien podría mandar un total manipulado directo a la API. Los recalculamos acá.
    let subtotalCalculado = 0;
    const detallesProcesados = detalles.map((det) => {
        const itemSubtotal = Number(det.cantidad) * Number(det.precio_unitario);
        subtotalCalculado += itemSubtotal;
        // Devolvemos el detalle original + el subtotal ya calculado por línea,
        // así el repositorio no tiene que recalcular nada, solo insertar.
        return { ...det, subtotal: itemSubtotal };
    });
    // Por ahora total = subtotal (sin descuento ni IVA aplicados todavía en este flujo).
    const totalCalculado = subtotalCalculado;

    // 3. Subida del PDF a Cloudinary (si se adjuntó uno)
    let pdfUrl = null;
    let pdfPublicId = null;

    if (file) {
        const creacionFecha = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const uploadResult = await uploadPresupuestoService(file.buffer, nombreEmprendimiento, creacionFecha);
        pdfUrl = uploadResult.url;
        pdfPublicId = uploadResult.public_id;
    }

    // 4. Delegar la transacción ACID al repositorio
    // IMPORTANTE: las claves de este objeto tienen que llamarse EXACTAMENTE igual
    // que los nombres que el repositorio destructura (subtotal, total, detalles),
    // no como se llaman las variables acá adentro (subtotalCalculado, etc.).
    // Antes esto estaba desalineado y el repositorio recibía 'undefined'.
    return await createPresupuestoTransaccionRepository({
        usuarioId,
        clienteId,
        fechaVencimiento,
        subtotal: subtotalCalculado,   
        total: totalCalculado,         
        estado: estadoFinal,
        pdfUrl,
        pdfPublicId,
        detalles: detallesProcesados,  
    });
};

/**
 * ==================================================
 * SERVICE: Obtener presupuesto por ID
 * ==================================================
 **/
export const getPresupuestoByIdService = async (presupuestoId, usuarioId) => {
    // Este service no tiene lógica propia todavía, solo delega al repositorio.
    // Lo dejamos como función separada (en vez de llamar al repositorio directo
    // desde el controller) para poder sumarle reglas de negocio más adelante
    // (ej: chequear permisos, formatear la respuesta) sin tocar el controller.
    return await findPresupuestoConDetallesRepository(presupuestoId, usuarioId);
};