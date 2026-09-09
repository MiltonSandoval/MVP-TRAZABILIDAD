"use server";

import { revalidatePath } from "next/cache";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../schemas/login.schema";
import { AuthResponse } from "../types/auth.types";

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
  const rawRol = formData.get("rolSimulado") as "CIUDADANO" | "FUNCIONARIO_TECNICO" | undefined;

  const validation = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
    rolSimulado: rawRol,
  });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message || "Datos de acceso inválidos",
    };
  }

  const result = await AuthService.authenticateUser(
    validation.data.email,
    validation.data.password,
    validation.data.rolSimulado
  );

  if (!result.success || !result.user) {
    return {
      success: false,
      message: result.message || "Error al autenticar",
    };
  }

  const redirectTo = result.user.rol === "FUNCIONARIO_TECNICO" ? "/funcionario" : "/tramites";

  revalidatePath("/", "layout");

  return {
    success: true,
    user: result.user,
    redirectTo,
  };
}

export async function switchRoleAction(rol: "CIUDADANO" | "FUNCIONARIO_TECNICO") {
  const user = await AuthService.switchActiveRole(rol);
  revalidatePath("/", "layout");
  return user;
}
