# SPEC-01: Autenticación, Gestión de Identidad y Roles (AUTH-USER)

## 1. Contexto y Objetivos
Proporcionar un mecanismo seguro de autenticación y control de accesos basado en roles (**RBAC**) para el Sistema de Trazabilidad de Trámites Municipales, integrando **Supabase Auth** y políticas **RLS** (Row Level Security) en PostgreSQL.

## 2. Roles del Sistema
1. **`CIUDADANO`**:
   - Puede radicar trámites socioambientales.
   - Puede consultar el estado y la línea de tiempo de sus propios trámites.
   - Acceso de solo lectura a la información pública de sus expedientes.
2. **`FUNCIONARIO_TECNICO`**:
   - Acceso a la bandeja de gestión y despacho municipal.
   - Capacidad de cambiar estados de trámites asignados (`EN_REVISION`, `EVALUACION_AMBIENTAL`, `OBSERVADO`, `APROBADO`, `RECHAZADO`).
   - Visualización de análisis predictivo emitido por el motor **AI-DLC**.
3. **`ADMINISTRADOR`**:
   - Gestión de usuarios y configuración de unidades municipales.

## 3. Modelo de Datos (Prisma)
```prisma
model Profile {
  id           String    @id @default(uuid())
  userId       String    @unique
  email        String    @unique
  nombre       String
  ci           String?
  telefono     String?
  rol          RolUsuario @default(CIUDADANO)
  cargo        String?
  municipioId  String    @default("SCZ-01")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  tramitesRadicados Tramite[] @relation("CiudadanoTramites")
  tramitesAsignados Tramite[] @relation("FuncionarioTramites")
}

enum RolUsuario {
  CIUDADANO
  FUNCIONARIO_TECNICO
  ADMINISTRADOR
}
```

## 4. Server Actions
- `authenticateUser(credentials)`: Valida credenciales, genera sesión JWT y redirecciona según rol.
- `logoutUser()`: Destruye la sesión activa.
- `getCurrentSession()`: Obtiene el perfil autenticado con verificación en el servidor.

## 5. Criterios de Aceptación (BDD)
- **Escenario 1:** Si las credenciales son válidas y el rol es `CIUDADANO`, redirige a `/tramites`.
- **Escenario 2:** Si las credenciales son válidas y el rol es `FUNCIONARIO_TECNICO`, redirige a `/funcionario`.
- **Escenario 3:** Si las credenciales fallan, devuelve error 401 con mensaje accesible.
