import { createPresupuestoCompletoService } from "../services/presupuesto.service.js";
import { findPresupuestoConDetallesRepository } from "../repositories/presupuesto.repository.js";

export const createPresupuesto = async (req, res) => {
    try {
        const usuarioId = req.auth.id; 
       
        const nombreEmprendimiento = req.usuario.nombre_emprendimiento; 
        
        const datosPresupuesto = {
            usuarioId,
            clienteId: req.body.cliente_id,
            fechaVencimiento: req.body.fecha_vencimiento,
            estado: req.body.estado,
            detalles: typeof req.body.detalles === "string" ? JSON.parse(req.body.detalles) : req.body.detalles
        };

        const resultado = await createPresupuestoCompletoService(datosPresupuesto, req.file, nombreEmprendimiento);
        res.status(201).json({ success: true, presupuesto: resultado });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPresupuestoById = async (req, res) => {
    try {
        const usuarioId = req.auth.id; 
        const { id } = req.params;
        const presupuesto = await findPresupuestoConDetallesRepository(id, usuarioId);
        
        if (!presupuesto) {
            return res.status(404).json({ success: false, message: "Presupuesto no encontrado" });
        }
        res.json({ success: true, presupuesto });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};