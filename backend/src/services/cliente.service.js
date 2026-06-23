import { createClienteRepository, findClientesByUsuarioRepository } from "../repositories/cliente.repository.js";

export const registerClienteService = async (clienteData) => {
    if (!clienteData.nombre) {
        throw new Error("El nombre del cliente es un campo obligatorio");
    }
    return await createClienteRepository(clienteData);
};

export const getClientesByUsuarioService = async (usuarioId) => {
    return await findClientesByUsuarioRepository(usuarioId);
};