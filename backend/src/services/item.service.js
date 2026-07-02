import { 
    createItemRepository, 
    findItemsByUsuarioRepository 
} from "../repositories/item.repository.js";

import { itemValidator } from "../validators/item.validator.js";
import { AppError } from "../utils/AppError.util.js";

/**
 * Servicio encargado de registrar un nuevo item.
 * Recibe un objeto desestructurado con las propiedades: usuarioId, nombre, precio, cantidad.
 * Valida los datos del item usando la función del validador.
 * Llama al repositorio para crear el item en la base de datos y retorna el resultado.
 */
export const getItemsByUsuarioService = async (usuarioId) => {
    if (!usuarioId) {
        throw new AppError("El ID de usuario es requerido", 400);
    }
    return await findItemsByUsuarioRepository(usuarioId);
};

export const registerItemService = async (itemData) => {
    // 1. Validar los datos del item
    itemValidator(itemData);

    // 3. Normalización: Aseguramos que la cantidad sea un entero antes de enviarla al repositorio
    const sanitizedData = {
        ...itemData,
        cantidad: Math.floor(Number(itemData.cantidad) || 0)
    };    

    // 2. Llamar al repositorio para crear el item  
    return await createItemRepository(sanitizedData);
};

export const updateItemService = async (itemId, updateData) => {
 
    // 1. Validar los datos del item
    itemValidator(updateData);

    // 2. Normalización: Aseguramos que la cantidad sea un entero antes de enviarla al repositorio
    const sanitizedData = {
        ...updateData,
        cantidad: Math.floor(Number(updateData.cantidad) || 0)
    };

    // 3. Llamar al repositorio para actualizar el item
    return await updateItemRepository(itemId, sanitizedData);
    
}