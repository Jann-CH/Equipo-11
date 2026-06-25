// Importamos la librería 'bcrypt' para el hash de contraseñas de forma segura
import bcrypt from "bcrypt";
// Importamos la librería 'jsonwebtoken' para generar tokens de autenticación basados en JWT
import jwt from "jsonwebtoken";

// Importamos las funciones del repositorio para interactuar directamente con la base de datos de usuarios
import {
    findUserByEmailRepository,
    createUserRepository
} from "../repositories/usuario.repository.js";
// Importamos el servicio encargado de subir los archivos (logos) a la nube o servidor
import { 
    uploadLogoService 
} from "./files.service.js";

/**
 * Servicio encargado del registro de un nuevo usuario/emprendimiento.
 * Recibe un objeto desestructurado con las propiedades: email, password, nombreEmprendimiento y file.
 */
export const registerService = async ({
    email,
    password,
    nombreEmprendimiento,
    file,
}) => {

    // Busca en la base de datos si ya existe un usuario registrado con el email proporcionado
    const existingUser =
        await findUserByEmailRepository(email);

    // Si el usuario ya existe, interrumpe la ejecución lanzando un error descriptivo
    if (existingUser) {
        throw new Error(
            "El email ya se encuentra registrado"
        );
    }

    // Valida que el archivo del logo haya sido enviado; si no está, lanza un error
    if(!file) throw new Error("Falta el logo");

    // Llama al servicio de subida de archivos pasando el archivo y el nombre del emprendimiento,
    // y desestructura la respuesta para obtener el 'public' ID y la 'url' de la imagen subida
    const {
        public, 
        url
    } = await uploadLogoService(file, nombreEmprendimiento);

    // Asigna los valores obtenidos de la subida a variables más descriptivas para la base de datos
    const logo_url = url;
    const logo_public_id = public;

    // Encripta (aplica un hash) a la contraseña usando bcrypt con un factor de costo (salt rounds) de 10
    const passwordHash =
        await bcrypt.hash(password, 10);

    // Guarda el nuevo usuario en la base de datos llamando al repositorio y retorna el resultado
    return await createUserRepository({
        email,
        passwordHash,
        nombreEmprendimiento,
        logo_url,
        logo_public_id
    });
};

/**
 * Servicio encargado del inicio de sesión (login) de un usuario.
 * Recibe un objeto desestructurado con las propiedades: email y password.
 */
export const loginService = async ({
    email,
    password
}) => {

    // Busca al usuario en la base de datos utilizando el email provisto
    const user =
        await findUserByEmailRepository(email);

    // Si no encuentra ningún usuario con ese email, lanza un error genérico por seguridad
    if (!user) {
        throw new Error(
            "Credenciales inválidas"
        );
    }

    // Compara la contraseña en texto plano ingresada con el hash guardado en la base de datos (user.password_hash)
    const validPassword =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    // Si la contraseña no coincide, lanza el mismo error genérico para no dar pistas a atacantes
    if (!validPassword) {
        throw new Error(
            "Credenciales inválidas"
        );
    }

    // Si todo es correcto, genera un Token JWT firmándolo con los datos del usuario (payload),
    // una clave secreta del entorno (process.env.JWT_SECRET) y define un tiempo de expiración de 1 hora
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

    // Retorna un objeto con el token generado y los datos públicos del usuario para ser usados en el cliente (frontend)
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            nombreEmprendimiento:
                user.nombre_emprendimiento // Mapea la propiedad de la base de datos (snake_case) al formato JS (camelCase)
        }
    };
};

