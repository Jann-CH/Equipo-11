import { registerClienteService, getClientesByUsuarioService } from "../services/cliente.service.js";

export const createCliente = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id; 
        const nuevoCliente = await registerClienteService({ ...req.body, usuarioId });
        res.status(201).json({ success: true, cliente: nuevoCliente });
    } catch (error) {
        next(error);
    }
};

export const getClientes = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id;
        const clientes = await getClientesByUsuarioService(usuarioId);
        res.json({ success: true, clientes });
    } catch (error) {
        next(error);
    }
};