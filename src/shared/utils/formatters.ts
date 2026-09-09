export function formatearFecha(fecha: string | Date): string {
  const d = new Date(fecha);
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatearTamanoArchivo(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function obtenerEtiquetaTipoTramite(tipo: string): string {
  const mapa: Record<string, string> = {
    LICENCIA_AMBIENTAL_MUNICIPAL: "Licencia Ambiental Municipal (Cat. 3/4)",
    AUTORIZACION_DESMONTE_CONTROLADO: "Autorización de Desmonte Periurbano",
    CAMBIO_USO_SUELO: "Cambio de Uso de Suelo",
    INSPECCION_CUENCA_HIDRICA: "Inspección Técnica de Cuenca Hídrica",
    DENUNCIA_CONTAMINACION_CHAQUEO: "Denuncia por Contaminación o Chaqueo",
  };
  return mapa[tipo] || tipo;
}

export function obtenerEtiquetaEstado(estado: string): { label: string; color: string } {
  const estados: Record<string, { label: string; color: string }> = {
    INGRESADO: { label: "Ingresado", color: "bg-blue-100 text-blue-800 border-blue-200" },
    EN_REVISION: { label: "En Revisión Documental", color: "bg-amber-100 text-amber-800 border-amber-200" },
    EVALUACION_AMBIENTAL: { label: "Evaluación Ambiental (Campo)", color: "bg-purple-100 text-purple-800 border-purple-200" },
    OBSERVADO: { label: "Observado (Requiere Subsanación)", color: "bg-rose-100 text-rose-800 border-rose-200" },
    APROBADO: { label: "Aprobado (Favorable)", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    RECHAZADO: { label: "Rechazado", color: "bg-slate-100 text-slate-800 border-slate-200" },
  };
  return estados[estado] || { label: estado, color: "bg-gray-100 text-gray-800 border-gray-200" };
}

export function obtenerEstiloRiesgoAI(riesgo?: string | null): { label: string; badgeClass: string; iconColor: string } {
  switch (riesgo) {
    case "ALTO_RIESGO_SOCIOAMBIENTAL":
      return {
        label: "Alto Riesgo Socioambiental",
        badgeClass: "bg-red-50 text-red-700 border-red-200 font-semibold",
        iconColor: "text-red-600",
      };
    case "MEDIO_RIESGO":
      return {
        label: "Riesgo Moderado",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
        iconColor: "text-amber-600",
      };
    case "BAJO_RIESGO":
      return {
        label: "Bajo Impacto",
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium",
        iconColor: "text-emerald-600",
      };
    case "PENDIENTE_CLASIFICACION_MANUAL":
    default:
      return {
        label: "Pendiente de Clasificación",
        badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
        iconColor: "text-gray-500",
      };
  }
}
