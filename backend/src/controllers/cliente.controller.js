import { registerClienteService, getClientesByUsuarioService } from "../services/cliente.service.js";

export const createCliente = async (req, res) => {
    try {
        const usuarioId = req.auth.id; 
        const nuevoCliente = await registerClienteService({ ...req.body, usuarioId });
        res.status(201).json({ success: true, cliente: nuevoCliente });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getClientes = async (req, res) => {
    try {
        const usuarioId = req.auth.id;
        const clientes = await getClientesByUsuarioService(usuarioId);
        res.json({ success: true, clientes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};