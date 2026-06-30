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
    { usuarioId, clienteId, fechaVencimiento, estado, detalles },
    file,
    nombreEmprendimiento
) => {
    // 1. Validaciones de negocio
    if (!detalles || detalles.length === 0) {
        throw new AppError("No se puede generar un presupuesto sin ítems cargados", 400);
    }

    const estadoFinal = estado || "Borrador";
    if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
        throw new AppError(
            `Estado inválido: "${estadoFinal}". Los valores permitidos son: ${ESTADOS_VALIDOS.join(", ")}.`,
            400
        );
    }

    // 2. Cálculo de subtotales y total en el backend (nunca confiar en el frontend)
    let subtotalCalculado = 0;
    const detallesProcesados = detalles.map((det) => {
        const itemSubtotal = Number(det.cantidad) * Number(det.precio_unitario);
        subtotalCalculado += itemSubtotal;
        return { ...det, subtotal: itemSubtotal };
    });
    const totalCalculado = subtotalCalculado;

    // 3. Subida del PDF a Cloudinary (si se adjuntó uno)
    let pdfUrl = null;
    if (file) {
        const uploadResult = await uploadPresupuestoService(file.buffer, nombreEmprendimiento);
        pdfUrl = uploadResult.url;
    }

    // 4. Delegar la transacción ACID al repositorio
    return await createPresupuestoTransaccionRepository({
        usuarioId,
        clienteId,
        fechaVencimiento,
        subtotalCalculado,
        totalCalculado,
        estado: estadoFinal,
        pdfUrl,
        detallesProcesados,
    });
};

/**
 * ==================================================
 * SERVICE: Obtener presupuesto por ID
 * ==================================================
 **/
export const getPresupuestoByIdService = async (presupuestoId, usuarioId) => {
    return await findPresupuestoConDetallesRepository(presupuestoId, usuarioId);
};