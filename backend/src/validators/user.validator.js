import AppError from "../utils/appError.js";

export const validateRegisterData = (datos) => {
    const { nombre, apellido, email, cuit, telefono, nombreEmprendimiento } = datos;

    if (!nombre || !apellido || !email || !cuit || !telefono || !nombreEmprendimiento) {
        throw new AppError("Todos los campos son obligatorios", 400);
    }       

}