import { createItemRepository, findItemsByUsuarioRepository } from "../repositories/item.repository.js";

export const registerItemService = async (itemData) => {
    if (!itemData.nombre || !itemData.precio) {
        throw new Error("El nombre y el precio del ítem son requeridos");
    }
    if (itemData.precio < 0) {
        throw new Error("El precio no puede ser un valor negativo");
    }
    return await createItemRepository(itemData);
};

export const getItemsByUsuarioService = async (usuarioId) => {
    return await findItemsByUsuarioRepository(usuarioId);
};