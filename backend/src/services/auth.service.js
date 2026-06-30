import bcrypt from "bcrypt";
import { generarToken } from "../utils/jwt.util.js";
import { AppError } from "../utils/AppError.util.js";
import {
    findUserByEmailRepository,
    createUserRepository,
} from "../repositories/usuario.repository.js";

/**
 * Registra un nuevo usuario en el sistema.
 * Verifica duplicados antes de crear.
 */
export const registerService = async ({ email, password, nombreEmprendimiento }) => {
    const existingUser = await findUserByEmailRepository(email);

    if (existingUser) {
        throw new AppError("El email ya se encuentra registrado", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return await createUserRepository({ email, passwordHash, nombreEmprendimiento });
};

/**
 * Autentica un usuario y retorna el token JWT.
 **/
export const loginService = async ({ email, password }) => {
    const user = await findUserByEmailRepository(email);

    // Misma respuesta si el usuario no existe o si la contraseña es incorrecta
    const INVALID_CREDENTIALS_MSG = "Credenciales inválidas";

    if (!user) {
        throw new AppError(INVALID_CREDENTIALS_MSG, 401);
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
        throw new AppError(INVALID_CREDENTIALS_MSG, 401);
    }

    // Usar la utilidad centralizada (jwt.util.js)
    const token = generarToken({ id: user.id, email: user.email });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            nombreEmprendimiento: user.nombre_emprendimiento,
        },
    };
};