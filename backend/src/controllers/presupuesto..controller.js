import {
    createPresupuestoCompletoService,
    getPresupuestoByIdService,
} from "../services/presupuesto.service.js";
import { AppError } from "../utils/AppError.util.js";

/**
 * POST /api/presupuestos
 * Crea un presupuesto completo con sus ítems de detalle.
 */
export const createPresupuesto = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;
        const nombreEmprendimiento = req.usuario.nombre_emprendimiento;

        let detalles;
        try {
            detalles =
                typeof req.body.detalles === "string"
                    ? JSON.parse(req.body.detalles)
                    : req.body.detalles;
        } catch {
            return next(new AppError("El campo 'detalles' no es un JSON válido", 400));
        }

        const datosPresupuesto = {
            usuarioId,
            clienteId: req.body.cliente_id,
            fechaVencimiento: req.body.fecha_vencimiento,
            estado: req.body.estado,
            detalles,
        };

        const resultado = await createPresupuestoCompletoService(
            datosPresupuesto,
            req.file,
            nombreEmprendimiento
        );

        res.status(201).json({ success: true, presupuesto: resultado });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/presupuestos/:id
 * Obtiene un presupuesto con sus detalles.
 */
export const getPresupuestoById = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id; 
        const { id } = req.params;
        
        const presupuesto = await getPresupuestoByIdService(id, usuarioId);

        if (!presupuesto) {
            return next(new AppError("Presupuesto no encontrado", 404));
        }

        res.json({ success: true, presupuesto });
    } catch (error) {
        next(error);
    }
};