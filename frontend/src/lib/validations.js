import { z } from "zod";


export const loginSchema = z.object({

  email: z
    .string()
    .email("Debe ser un correo electrónico válido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),

});



export const registerSchema = z
.object({

  nombre: z
    .string()
    .min(1, "El nombre es obligatorio"),


  apellido: z
    .string()
    .min(1, "El apellido es obligatorio"),


  nombreEmprendimiento: z
    .string()
    .min(1, "El nombre de la empresa es obligatorio"),


  email: z
    .string()
    .email("Debe ingresar un correo válido"),


  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/[a-z]/, "Debe incluir una minúscula")
    .regex(/[0-9]/, "Debe incluir un número"),


  repetirPassword: z
    .string()
    .min(1, "Debe repetir la contraseña"),


  terminos: z
    .boolean()
    .refine(
      (value) => value === true,
      "Debe aceptar los términos y condiciones"
    ),

})
.refine(
  (data) => data.password === data.repetirPassword,
  {
    message: "Las contraseñas no coinciden",
    path: ["repetirPassword"],
  }
);