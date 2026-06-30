import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Debe ser un correo electrónico válido").min(5),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});