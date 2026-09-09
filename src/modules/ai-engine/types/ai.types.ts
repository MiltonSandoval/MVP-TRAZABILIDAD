export type NivelRiesgo =
  | "BAJO_RIESGO"
  | "MEDIO_RIESGO"
  | "ALTO_RIESGO_SOCIOAMBIENTAL"
  | "PENDIENTE_CLASIFICACION_MANUAL";

export interface EvaluacionRiesgoResult {
  nivelRiesgo: NivelRiesgo;
  scoreRiesgo: number; // 0.0 a 1.0
  scoreConfianza: number; // 0.0 a 1.0
  factoresDetectados: string[];
  recomendaciones: string;
  tiempoInferenciaMs: number;
}
