# SPEC-04: Bandeja de Gestión y Portal de Transparencia (DASH-NOTIF)

## 1. Contexto y Objetivos
Proveer dos vistas operativas principales:
1. **Portal Ciudadano de Consulta y Radicación:** Seguimiento transparente con visualización de estado, línea de tiempo inmutable y descarga/verificación de comprobante.
2. **Bandeja de Gestión Municipal:** Panel analítico para directores e inspectores ambientales donde los expedientes se ordenan y filtran según la criticidad calculada por el motor **AI-DLC**.

## 2. Funcionalidades de la Bandeja de Gestión
- **Ordenamiento Inteligente:** Orden ponderado por criticidad (Mayor riesgo de IA primero, seguido de antigüedad de radicación).
- **Filtros Dinámicos:** Por tipo de trámite, estado (`EN_REVISION`, `EVALUACION_AMBIENTAL`, etc.) y nivel de riesgo.
- **Acciones Rápidas (Modal de Dictamen):**
  - Aprobar trámite con resolución técnica.
  - Observar trámite solicitando subsanación ciudadana.
  - Rechazar trámite con fundamentación de normativa ambiental (Ley 1333).
- **Emisión de Eventos:** Cada acción genera un registro inmutable en `HistorialTramite`.

## 3. Criterios de Aceptación (BDD)
- **Escenario 1:** Un funcionario técnico visualiza la bandeja con indicadores visuales semánticos de riesgo ecológico (rojo, ámbar, verde).
- **Escenario 2:** Al emitir un dictamen aprobatorio u observatorio, el estado del trámite cambia inmediatamente y se refleja en el historial auditable.
