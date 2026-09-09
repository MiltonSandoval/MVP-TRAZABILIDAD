export type RolUsuario = "CIUDADANO" | "FUNCIONARIO_TECNICO" | "ADMINISTRADOR";

export interface UserSession {
  id: string;
  userId: string;
  email: string;
  nombre: string;
  ci?: string;
  telefono?: string;
  rol: RolUsuario;
  cargo?: string;
  municipioId: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserSession;
  redirectTo?: string;
}
