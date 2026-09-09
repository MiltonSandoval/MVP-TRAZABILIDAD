import { DEMO_PROFILES, inMemoryStore, DemoProfile } from "@/shared/lib/store";
import { UserSession } from "../types/auth.types";

export class AuthService {
  /**
   * Obtiene la sesión activa actual del servidor.
   */
  static async getCurrentSession(): Promise<UserSession | null> {
    const session = inMemoryStore.getActiveSession();
    return session || null;
  }

  /**
   * Autentica un usuario por email y contraseña o por selección de rol para demostración.
   */
  static async authenticateUser(
    email: string,
    password?: string,
    rolSeleccionado?: "CIUDADANO" | "FUNCIONARIO_TECNICO"
  ): Promise<{ success: boolean; user?: UserSession; message?: string }> {
    // Si se especifica un rol directamente (ej. selector rápido de rol o email conocido)
    let profile: DemoProfile | undefined;

    if (rolSeleccionado) {
      profile = DEMO_PROFILES.find((p) => p.rol === rolSeleccionado);
    } else {
      profile = DEMO_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    }

    // Si no coincide y la contraseña es incorrecta
    if (!profile) {
      if (email.includes("funcionario") || email.includes("tecnico")) {
        profile = DEMO_PROFILES[1];
      } else if (email.includes("ciudadano")) {
        profile = DEMO_PROFILES[0];
      } else {
        return {
          success: false,
          message: "Credenciales incorrectas o usuario no encontrado en el padrón municipal.",
        };
      }
    }

    inMemoryStore.setActiveSession(profile);

    return {
      success: true,
      user: profile,
    };
  }

  /**
   * Cambia la sesión activa al perfil especificado para pruebas de roles.
   */
  static async switchActiveRole(rol: "CIUDADANO" | "FUNCIONARIO_TECNICO"): Promise<UserSession> {
    const profile = DEMO_PROFILES.find((p) => p.rol === rol) || DEMO_PROFILES[0];
    inMemoryStore.setActiveSession(profile);
    return profile;
  }
}
