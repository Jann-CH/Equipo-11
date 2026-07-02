import {
    createClienteRepository, 
    findClientesByUsuarioRepository 
} from "../repositories/cliente.repository.js";
import { clienteValidator } from "../validators/cliente.validator.js";
/**
 * 
 * @param {
 *  usuarioId, 
 *   nombre, 
 *   apellido, 
 *   email, 
 *   cuit, 
 *   telefono 
 * } clienteData 
 * @returns 
 */
export const registerClienteService = async (clienteData) => {
    
    clienteValidator(clienteData);

    return await createClienteRepository(clienteData);
};

export const getClientesByUsuarioService = async (usuarioId) => {
    return await findClientesByUsuarioRepository(usuarioId);
};