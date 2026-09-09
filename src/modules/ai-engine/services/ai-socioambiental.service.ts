import { EvaluacionRiesgoResult } from "../types/ai.types";

export class AISocioambientalService {
  /**
   * Evalúa la memoria técnica y descripción del trámite para categorizar
   * su impacto ecológico en municipios del oriente boliviano.
   */
  static async evaluarTramite(
    titulo: string,
    descripcion: string,
    tipoTramite: string,
    simularFalla: boolean = false
  ): Promise<EvaluacionRiesgoResult> {
    const inicio = Date.now();

    // Contingencia / Fallback ante indisponibilidad del servicio de IA (Criterio BDD HU-04)
    if (simularFalla) {
      return {
        nivelRiesgo: "PENDIENTE_CLASIFICACION_MANUAL",
        scoreRiesgo: 0.0,
        scoreConfianza: 0.0,
        factoresDetectados: ["Falla de conexión con servicio cognitivo externo"],
        recomendaciones:
          "El trámite continuará su curso normal. Se requiere que el funcionario técnico clasifique manualmente el nivel de riesgo.",
        tiempoInferenciaMs: Date.now() - inicio,
      };
    }

    const textoCompleto = `${titulo} ${descripcion} ${tipoTramite}`.toLowerCase();

    // Palabras clave críticas de alto impacto socioambiental en el oriente boliviano
    const factoresAltos = [
      { palabra: "desmonte", descripcion: "Intervención de cobertura vegetal nativa / desmonte" },
      { palabra: "chaqueo", descripcion: "Alerta por quema o chaqueo no regulado" },
      { palabra: "quema", descripcion: "Uso de fuego o material inflamable" },
      { palabra: "humedal", descripcion: "Afectación potencial a humedal o curichi" },
      { palabra: "curichi", descripcion: "Proximidad a cuerpo de agua natural llanero (curichi)" },
      { palabra: "cuenca", descripcion: "Zona de recarga o protección de cuenca hídrica" },
      { palabra: "río", descripcion: "Franja de protección ribereña (Río Piraí / Río Grande / etc.)" },
      { palabra: "reserva", descripcion: "Proximidad o solapamiento con área protegida o reserva forestal" },
      { palabra: "forestal", descripcion: "Explotación o intervención en masa boscosa" },
      { palabra: "agroindustrial", descripcion: "Emisiones de gran escala agroindustrial" },
    ];

    const factoresMedios = [
      { palabra: "movimiento de tierra", descripcion: "Modificación de topografía natural" },
      { palabra: "cambio de uso", descripcion: "Transición de uso agrícola o mixto" },
      { palabra: "avícola", descripcion: "Emisión de excretas y olores orgánicos" },
      { palabra: "porcina", descripcion: "Efluentes líquidos con alta carga biológica" },
      { palabra: "drenaje", descripcion: "Alteración de cursos superficiales de agua" },
      { palabra: "periurbana", descripcion: "Zona de amortiguamiento urbano-rural" },
    ];

    const factoresBajos = [
      { palabra: "vivero", descripcion: "Fomento a la reforestación o flora urbana" },
      { palabra: "nativas", descripcion: "Conservación de especies autóctonas (Tajibos, Toborochis)" },
      { palabra: "mantenimiento", descripcion: "Adecuación sin expansión de huella física" },
      { palabra: "reforestación", descripcion: "Recuperación de suelo degradado" },
      { palabra: "solar", descripcion: "Instalación de energía renovable" },
    ];

    const detectados: string[] = [];
    let puntosAlto = 0;
    let puntosMedio = 0;
    let puntosBajo = 0;

    for (const f of factoresAltos) {
      if (textoCompleto.includes(f.palabra)) {
        detectados.push(f.descripcion);
        puntosAlto += 1;
      }
    }

    for (const f of factoresMedios) {
      if (textoCompleto.includes(f.palabra)) {
        detectados.push(f.descripcion);
        puntosMedio += 1;
      }
    }

    for (const f of factoresBajos) {
      if (textoCompleto.includes(f.palabra)) {
        detectados.push(f.descripcion);
        puntosBajo += 1;
      }
    }

    // Reglas del modelo predictivo
    if (puntosAlto >= 1 || tipoTramite === "AUTORIZACION_DESMONTE_CONTROLADO" || tipoTramite === "DENUNCIA_CONTAMINACION_CHAQUEO") {
      const scoreRiesgo = Math.min(0.7 + puntosAlto * 0.1, 0.98);
      return {
        nivelRiesgo: "ALTO_RIESGO_SOCIOAMBIENTAL",
        scoreRiesgo: Number(scoreRiesgo.toFixed(2)),
        scoreConfianza: 0.94,
        factoresDetectados: detectados.length > 0 ? detectados : ["Tipo de trámite de alta sensibilidad ecológica"],
        recomendaciones:
          "ALERTA AMBIENTAL: Suspender aprobación automática. Se exige inspección pericial in situ obligatoria y presentación de Estudio de Evaluación de Impacto Ambiental (EEIA) analítico bajo la Ley N° 1333.",
        tiempoInferenciaMs: Date.now() - inicio,
      };
    }

    if (puntosMedio >= 1 || tipoTramite === "CAMBIO_USO_SUELO" || tipoTramite === "INSPECCION_CUENCA_HIDRICA") {
      const scoreRiesgo = Math.min(0.4 + puntosMedio * 0.08, 0.68);
      return {
        nivelRiesgo: "MEDIO_RIESGO",
        scoreRiesgo: Number(scoreRiesgo.toFixed(2)),
        scoreConfianza: 0.88,
        factoresDetectados: detectados.length > 0 ? detectados : ["Actividad con impacto zonal moderado"],
        recomendaciones:
          "Requiere cotejo de planos topográficos, verificación de servidumbres ecológicas y plan de manejo de residuos sólidos/líquidos.",
        tiempoInferenciaMs: Date.now() - inicio,
      };
    }

    return {
      nivelRiesgo: "BAJO_RIESGO",
      scoreRiesgo: Number((0.15 - puntosBajo * 0.03).toFixed(2)),
      scoreConfianza: 0.96,
      factoresDetectados: detectados.length > 0 ? detectados : ["No se identificaron factores de riesgo crítico"],
      recomendaciones:
        "Trámite de bajo impacto socioambiental. Se sugiere despacho ágil y exención de requisitos analíticos complejos.",
      tiempoInferenciaMs: Date.now() - inicio,
    };
  }
}
