import { z } from "zod";

export const tiposTramiteEnum = z.enum([
  "LICENCIA_AMBIENTAL_MUNICIPAL",
  "AUTORIZACION_DESMONTE_CONTROLADO",
  "CAMBIO_USO_SUELO",
  "INSPECCION_CUENCA_HIDRICA",
  "DENUNCIA_CONTAMINACION_CHAQUEO",
]);

export const tramiteSchema = z.object({
  titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(120, "El título no puede exceder 120 caracteres"),
  descripcion: z
    .string()
    .min(20, "La memoria descriptiva debe tener al menos 20 caracteres para análisis técnico")
    .max(1000, "La descripción no puede superar 1000 caracteres"),
  tipoTramite: tiposTramiteEnum,
  municipio: z.string().min(3, "Especifique el municipio del oriente boliviano"),
  ubicacionDetalle: z
    .string()
    .min(5, "Indique la referencia geográfica o predial (ej. Comunidad, Km, Distrito)"),
  nombreArchivo: z.string().optional(),
  simularFallaAI: z.boolean().optional(),
});

export type TramiteFormData = z.infer<typeof tramiteSchema>;

export const actualizarEstadoSchema = z.object({
  tramiteId: z.string().min(1),
  nuevoEstado: z.enum([
    "INGRESADO",
    "EN_REVISION",
    "EVALUACION_AMBIENTAL",
    "OBSERVADO",
    "APROBADO",
    "RECHAZADO",
  ]),
  observaciones: z
    .string()
    .min(5, "Debe fundamentar técnicamente el dictamen u observación (mínimo 5 caracteres)"),
});

export type ActualizarEstadoFormData = z.infer<typeof actualizarEstadoSchema>;
