import { uploadPresupuestoService } from "./files.service.js";
import { AppError } from "../utils/AppError.util.js";

import {
    createPresupuestoTransaccionRepository,
    findPresupuestoConDetallesRepository,
    addPdfRepository,
    findPresupuestoConClienteRepository,
    findPresupuestosConFiltrosRepository,
    contarPresupuestosConFiltrosRepository,
    getDashboardDataRepository,
    getBudgetRepository,
} from "../repositories/presupuesto.repository.js";

import { verifyUserByIdExistsRepository } from "../repositories/usuario.repository.js";
import { findItemsByIdsRepository } from "../repositories/item.repository.js";

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
export const createPresupuestoCompletoService = async ({
    usuarioId,
    clienteId,
    fecha,
    fechaVencimiento,
    estado,
    observaciones,
    detalles
}) => {
    // 1. Validaciones de negocio
    if (!detalles || detalles.length === 0) {
        throw new AppError("No se puede generar un presupuesto sin ítems cargados", 400);
    }

    const estadoFinal = estado || "Borrador";

    if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
        throw new AppError(`Estado inválido: "${estadoFinal}".`, 400);
    }

    // 2. Buscar los items reales del usuario
    // Traemos nombre y precio actual desde la tabla items.
    const itemsIds = detalles.map(det => det.item_id);

    const items = await findItemsByIdsRepository(itemsIds, usuarioId);

    if (items.length !== detalles.length) {
        throw new AppError("Uno o más items no existen o no pertenecen al usuario", 400);
    }

    // 3. Crear detalles congelando el precio actual
    let subtotalCalculado = 0;

    const detallesProcesados = detalles.map(det => {
        const item = items.find(i => i.id === det.item_id);

        const subtotalItem = Number(det.cantidad) * Number(item.precio);

        subtotalCalculado += subtotalItem;

        return {
            item_id: item.id,
            nombre_item: item.nombre,
            cantidad: Number(det.cantidad),
            precio_unitario: Number(item.precio),
            subtotal: subtotalItem
        };
    });

    // 4. Total final
    const total = subtotalCalculado;

    // 5. Delegar transacción al repositorio
    return await createPresupuestoTransaccionRepository({
        usuarioId,
        clienteId,
        fecha,
        fechaVencimiento,
        estado: estadoFinal,
        observaciones,
        subtotal: subtotalCalculado,
        total,
        detallesProcesados
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

/**
 * GUARDAR PDF
 */
export const addPdfService = async ({ usuarioId, presupuestoId }, file) => {
    const cliente = await findPresupuestoConClienteRepository(presupuestoId, usuarioId);

    if (!cliente)
        throw new AppError("El presupuesto no existe", 404);

    if (!file)
        throw new AppError("No se encuentra el archivo", 400);

    const nombreDelCliente = `${cliente.cliente_nombre}_${cliente.cliente_apellido}`;

    const creacionFecha = new Date().toISOString().split("T")[0];

    const uploadResult = await uploadPresupuestoService(file.buffer, nombreDelCliente, creacionFecha);

    return await addPdfRepository({
        usuarioId,
        presupuestoId,
        pdf_url: uploadResult.url,
        pdf_public_id: uploadResult.public_id,
        estado: "Guardado"
    });
};

/**
 * ==================================================
 * SERVICE: FILTRADO POR FECHA ESTADO MONTO Y CLIENTE
 * ==================================================
 **/
export const filtroPresupuestoService = async (usuarioId, pagina = 1, limite = 10, filtro = {}) => {
    const skip = (pagina - 1) * limite;

    const presupuestos = await findPresupuestosConFiltrosRepository(usuarioId, filtro, limite, skip);

    const total = await contarPresupuestosConFiltrosRepository(usuarioId, filtro);

    return {
        data: presupuestos,
        meta: {
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};

/**
 * DASHBOARD
 * SUMA TOTAL DE PRESUPUESTO
 * CANTIDAD DE PRESUPUESTO ESTADOS
 * ACTIVIDAD SEMANAL
 */


export const getDashboardDataService = async ( usuarioId, periodo ) => {

    // 1. Verificamos si el usuario existe
    const existeUsuario = await verifyUserByIdExistsRepository(usuarioId);

    if (!existeUsuario) {
        throw new AppError("El usuario no existe", 404);
    }
    return await getDashboardDataRepository(usuarioId);
};
   
export const getBudgetService = async (usuarioId, page, limit) => {
    const parsedLimit = limit ? parseInt(limit, 10) : null;

    const parsedPage = page ? parseInt(page, 10) : 1;

    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : 0;

    const presupuestos = await getBudgetRepository(usuarioId, parsedLimit, offset);

    return {
        paginaActual: parsedPage,
        limite: parsedLimit,
        data: presupuestos
    };
};