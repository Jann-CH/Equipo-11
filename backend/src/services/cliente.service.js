import { createClienteRepository, findClientesByUsuarioRepository } from "../repositories/cliente.repository.js";
import { AppError } from "../utils/AppError.util.js";

export const registerClienteService = async (clienteData) => {
    if (!clienteData.nombre) {
        throw new AppError("El nombre del cliente es un campo obligatorio", 400);
    }
    return await createClienteRepository(clienteData);
};

export const getClientesByUsuarioService = async (usuarioId) => {
    return await findClientesByUsuarioRepository(usuarioId);
};