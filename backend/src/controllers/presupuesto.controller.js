import {
    createPresupuestoCompletoService,
    getPresupuestoByIdService,
    addPdfService,
    filtroPresupuestoService,
    getDashboardDataService,
    getBudgetService,
    updateStateService,
    getPublicPresupuestoService,
    updatePublicStateService,
} from "../services/presupuesto.service.js";

import {
    findPresupuestoConDetallesRepository,
    addPdfRepository,
} from "../repositories/presupuesto.repository.js";

import { generarPresupuestoPDF } from "../services/pdf.service.js";
import { uploadPresupuestoService } from "../services/files.service.js";

import { AppError } from "../utils/AppError.util.js";

/**
 * POST /api/presupuestos
 * Crea presupuesto + genera PDF
 */
export const createPresupuesto = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;

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
            fecha: req.body.fecha,
            fechaVencimiento: req.body.fecha_vencimiento,
            estado: req.body.estado,
            observaciones: req.body.observaciones,
            detalles,
        };

        // Crear presupuesto en BD
        const resultado = await createPresupuestoCompletoService(datosPresupuesto);

        // Traer datos completos para PDF
        const presupuestoCompleto = await findPresupuestoConDetallesRepository(
            resultado.id,
            usuarioId
        );

        // Generar PDF
        const pdfBuffer = await generarPresupuestoPDF(presupuestoCompleto);

        // ===============================
        // SUBIR A CLOUDINARY
        // ===============================
        const nombreCliente = `${presupuestoCompleto.cliente_nombre}_${presupuestoCompleto.cliente_apellido}`;
        const fechaCreacion = new Date().toISOString().split("T")[0];

        const upload = await uploadPresupuestoService(
            pdfBuffer,
            nombreCliente,
            fechaCreacion
        );

        // Guardar URL PDF
        await addPdfRepository({
            usuarioId,
            presupuestoId: resultado.id,
            pdf_url: upload.url,
            pdf_public_id: upload.public_id,
            estado: resultado.estado,
        });

        res.status(201).json({
            success: true,
            message: "Se creó un nuevo presupuesto",
            presupuesto: {
                ...resultado,
                pdf_url: upload.url,
                pdf_public_id: upload.public_id,
                cliente_telefono: presupuestoCompleto.cliente_telefono,
                
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/presupuestos/:id
 */
export const getPresupuestoById = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;
        const { id } = req.params;

        const presupuesto = await getPresupuestoByIdService(id, usuarioId);

        if (!presupuesto) {
            return next(new AppError("Presupuesto no encontrado", 404));
        }

        res.status(200).json({
            success: true,
            presupuesto,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Guardar PDF manualmente
 */
export const addPdfController = async (req, res, next) => {
    try {
        const { presupuestoId } = req.params;
        const file = req.file;
        const usuarioId = req.auth.id;

        const pdf = await addPdfService({ usuarioId, presupuestoId }, file);

        res.status(200).json({
            success: true,
            message: "Se guardó el PDF",
            data: pdf,
        });
    } catch (error) {
        next(error);
    }
};

export const filtroPresuestoController = async (req, res, next) => {
    try {
        const { pagina = 1, limite = 10, filtro = "{}" } = req.query;
        const usuarioId = req.auth.id;

        let filtrosObj;
        try {
            filtrosObj = typeof filtro === "string" ? JSON.parse(filtro) : filtro;
        } catch {
            return next(new AppError("Formato de filtro inválido", 400));
        }

        const data = await filtroPresupuestoService(
            usuarioId,
            Number(pagina),
            Number(limite),
            filtrosObj
        );

        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

export const getDashboardController = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;
        const { periodo = "semanal" } = req.query;

        const data = await getDashboardDataService(usuarioId, periodo);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const getBudgetController = async (req, res, next) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const usuarioId = req.auth.id;

        const data = await getBudgetService(usuarioId, page, limit);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const downloadPdfController = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;
        const { id } = req.params;

        const presupuestoCompleto =
            await findPresupuestoConDetallesRepository(
                id,
                usuarioId
            );

        if (!presupuestoCompleto) {
            return next(
                new AppError("Presupuesto no encontrado", 404)
            );
        }

        const pdfBuffer =
            await generarPresupuestoPDF(presupuestoCompleto);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Presupuesto-${id}.pdf"`
        );

        res.send(pdfBuffer);

    } catch (error) {
        next(error);
    }
};

export const updateStateController = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;
        const { id: presupuestoId } = req.params;
        const { estado } = req.body;

        console.log("Usuario ID, ", usuarioId, " Presupuesto: ",presupuestoId, " estado: ",estado);

        const presupuestoActualizado = await updateStateService(estado, presupuestoId, usuarioId);
        
        res.status(200).json({
            success: true,
            message: "Se actualizó el estado del presupuesto exitosamente",
            presupuesto: presupuestoActualizado,
        });

    } catch (err) {
        next(err);
    } 
};


export const getPublicPresupuestoController = async (
    req,
    res,
    next
) => {
    try {
        const { id: presupuestoId } = req.params;

        const presupuesto =
            await getPublicPresupuestoService(
                presupuestoId
            );

        res.status(200).json({
            success: true,
            presupuesto,
        });

    } catch (error) {
        next(error);
    }
};

export const updatePublicStateController = async (
    req,
    res,
    next
) => {
    try {

        const { id: presupuestoId } = req.params;
        const { estado } = req.body;


        await updatePublicStateService(
            presupuestoId,
            estado
        );


        const presupuesto =
            await getPublicPresupuestoService(
                presupuestoId
            );


        res.status(200).json({
            success: true,
            message: "Estado actualizado correctamente.",
            presupuesto,
        });


    } catch (error) {
        next(error);
    }
};