import { createItemRepository, findItemsByUsuarioRepository } from "../repositories/item.repository.js";
import { AppError } from "../utils/AppError.util.js";

export const registerItemService = async (itemData) => {
    if (!itemData.nombre || itemData.precio === undefined || itemData.precio === null) {
        throw new AppError("El nombre y el precio del ítem son requeridos", 400);
    }
    if (Number(itemData.precio) < 0) {
        throw new AppError("El precio no puede ser un valor negativo", 400);
    }
    return await createItemRepository(itemData);
};

export const getItemsByUsuarioService = async (usuarioId) => {
    return await findItemsByUsuarioRepository(usuarioId);
};