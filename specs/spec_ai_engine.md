# SPEC-03: Motor Inteligente de Decisión Socioambiental (AI-ENGINE / AI-DLC)

## 1. Contexto y Objetivos
Incorporar un servicio inteligente de inferencia y scoring que evalúe la memoria técnica y descripción del trámite al momento de su radicación. El motor detecta variables de alto impacto ecológico en el contexto del oriente boliviano (desmonte no autorizado, chaqueos, proximidad a cuencas hídricas, reservas forestales o áreas protegidas) y asigna un nivel de criticidad.

## 2. Niveles de Riesgo y Heurísticas
1. **`ALTO_RIESGO_SOCIOAMBIENTAL`**:
   - Factores: Mención de "desmonte", "chaqueo", "quema", "tala", "reserva", "río", "cuenca", "río Piraí", "Parque Noel Kempff", "humedal".
   - Puntuación: 0.70 - 1.00.
   - Acción: Prioridad inmediata en la bandeja municipal y recomendación de inspección técnica *in situ*.
2. **`MEDIO_RIESGO`**:
   - Factores: "cambio de uso de suelo", "movimiento de tierra", "construcción periurbana", "drenaje".
   - Puntuación: 0.40 - 0.69.
   - Acción: Revisión estándar con verificación de planos topográficos.
3. **`BAJO_RIESGO`**:
   - Factores: "licencia ambiental menor", "mantenimiento predial", "reforestación", "limpieza urbana".
   - Puntuación: 0.00 - 0.39.
   - Acción: Despacho acelerado.
4. **`PENDIENTE_CLASIFICACION_MANUAL`**:
   - Fallback de contingencia cuando el servicio de IA experimente indisponibilidad o error, sin interrumpir el flujo del ciudadano.

## 3. Modelo de Datos (Prisma)
```prisma
model AnalisisPredictivoAI {
  id                 String        @id @default(uuid())
  tramiteId          String        @unique
  nivelRiesgo        NivelRiesgoAI
  scoreConfianza     Float
  factoresDetectados String        // JSON stringificado con los factores
  recomendaciones    String
  modeloVersion      String        @default("ai-socioambiental-v1.0")
  createdAt          DateTime      @default(now())

  tramite            Tramite       @relation(fields: [tramiteId], references: [id], onDelete: Cascade)
}
```

## 4. Contrato de Respuesta (TypeScript)
```typescript
export interface AnalisisPredictivoResult {
  nivelRiesgo: "BAJO_RIESGO" | "MEDIO_RIESGO" | "ALTO_RIESGO_SOCIOAMBIENTAL" | "PENDIENTE_CLASIFICACION_MANUAL";
  scoreRiesgo: number;
  scoreConfianza: number;
  factoresDetectados: string[];
  recomendaciones: string;
}
```

## 5. Criterios de Aceptación (BDD)
- **Escenario 1:** Trámite con palabras clave críticas de afectación socioambiental recibe `ALTO_RIESGO_SOCIOAMBIENTAL` y genera recomendaciones periciales.
- **Escenario 2:** En caso de falla simulada o indisponibilidad del servicio externo, se cataloga como `PENDIENTE_CLASIFICACION_MANUAL` y continúa la radicación.
