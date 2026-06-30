import { registerItemService, getItemsByUsuarioService } from "../services/item.service.js";

export const createItem = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id; 
        const nuevoItem = await registerItemService({ ...req.body, usuarioId });
        res.status(201).json({ success: true, item: nuevoItem });
    } catch (error) {
        next(error);
    }
};

export const getItems = async (req, res, next) => {
    try {
        const usuarioId = req.auth.id; 
        const items = await getItemsByUsuarioService(usuarioId);
        res.json({ success: true, items });
    } catch (error) {
        next(error);
    }
};