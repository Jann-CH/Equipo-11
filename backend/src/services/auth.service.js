import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    findUserByEmailRepository,
    createUserRepository
} from "../repositories/usuario.repository.js";

export const registerService = async ({
    email,
    password,
    nombreEmprendimiento
}) => {

    const existingUser =
        await findUserByEmailRepository(email);

    if (existingUser) {
        throw new Error(
            "El email ya se encuentra registrado"
        );
    }

    const passwordHash =
        await bcrypt.hash(password, 10);

    return await createUserRepository({
        email,
        passwordHash,
        nombreEmprendimiento
    });
};

export const loginService = async ({
    email,
    password
}) => {

    const user =
        await findUserByEmailRepository(email);

    if (!user) {
        throw new Error(
            "Credenciales inválidas"
        );
    }

    const validPassword =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!validPassword) {
        throw new Error(
            "Credenciales inválidas"
        );
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            nombreEmprendimiento:
                user.nombre_emprendimiento
        }
    };
};