import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  rolSimulado: z.enum(["CIUDADANO", "FUNCIONARIO_TECNICO"]).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
