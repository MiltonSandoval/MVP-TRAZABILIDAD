import { DemoTramite, DemoHistorial, DemoDocumento, DemoAnalisisAI } from "@/shared/lib/store";

export type Tramite = DemoTramite;
export type HistorialItem = DemoHistorial;
export type DocumentoItem = DemoDocumento;
export type AnalisisAIItem = DemoAnalisisAI;

export type TipoTramite =
  | "LICENCIA_AMBIENTAL_MUNICIPAL"
  | "AUTORIZACION_DESMONTE_CONTROLADO"
  | "CAMBIO_USO_SUELO"
  | "INSPECCION_CUENCA_HIDRICA"
  | "DENUNCIA_CONTAMINACION_CHAQUEO";

export type EstadoTramite =
  | "INGRESADO"
  | "EN_REVISION"
  | "EVALUACION_AMBIENTAL"
  | "OBSERVADO"
  | "APROBADO"
  | "RECHAZADO";

export interface CrearTramiteInput {
  titulo: string;
  descripcion: string;
  tipoTramite: TipoTramite;
  municipio: string;
  ubicacionDetalle: string;
  nombreArchivoAdjunto?: string;
  simularFallaAI?: boolean;
}
