import { AppError } from "../utils/AppError.util";

export const itemValidator = (itemData) => {
    // 1. Validación de campos requeridos
        if (!itemData.nombre || itemData.precio === undefined || itemData.precio === null) {
            throw new AppError("El nombre y el precio del ítem son requeridos", 400);
        }
    
        // 2. Validación de valores negativos
        if (Number(itemData.precio) < 0) {
            throw new AppError("El precio no puede ser un valor negativo", 400);
        }
        
        if (itemData.cantidad !== undefined && Number(itemData.cantidad) < 0) {
            throw new AppError("La cantidad no puede ser negativa", 400);
        }
 
    
}