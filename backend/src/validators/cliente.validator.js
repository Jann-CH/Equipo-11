import { AppError } from "../utils/AppError.js";
export const clienteValidator = (clienteData) => {
    const { nombre, apellido, email, cuit, telefono } = clienteData;
    
    if ( nombre === undefined || nombre === null || nombre.trim() === "") {
            throw new AppError("El nombre del cliente es un campo obligatorio", 400);
    }

    if(apellido === undefined || apellido === null || apellido.trim() === "") {
        throw new AppError("El apellido del cliente es un campo obligatorio", 400);
    }

    if(email === undefined || email === null || email.trim() === "") {
        throw new AppError("El email del cliente es un campo obligatorio", 400);
    }   

    if(cuit === undefined || cuit === null || cuit.trim() === "") {
        throw new AppError("El cuit del cliente es un campo obligatorio", 400);
    }   

    if(telefono === undefined || telefono === null || telefono.trim() === "") {
        throw new AppError("El telefono del cliente es un campo obligatorio", 400);
    }
    
}