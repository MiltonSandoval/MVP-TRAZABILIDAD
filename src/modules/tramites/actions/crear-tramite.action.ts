"use server";

import { revalidatePath } from "next/cache";
import { TramitesService } from "../services/tramites.service";
import { tramiteSchema } from "../schemas/tramite.schema";
import { TipoTramite } from "../types/tramite.types";

export interface CrearTramiteResponse {
  success: boolean;
  message?: string;
  codigo?: string;
  tramiteId?: string;
}

export async function crearTramiteAction(formData: FormData): Promise<CrearTramiteResponse> {
  const rawData = {
    titulo: formData.get("titulo") as string,
    descripcion: formData.get("descripcion") as string,
    tipoTramite: formData.get("tipoTramite") as TipoTramite,
    municipio: formData.get("municipio") as string,
    ubicacionDetalle: formData.get("ubicacionDetalle") as string,
    nombreArchivo: (formData.get("nombreArchivo") as string) || undefined,
    simularFallaAI: formData.get("simularFallaAI") === "true",
  };

  const validation = tramiteSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message || "Datos incompletos o erróneos.",
    };
  }

  try {
    const nuevo = await TramitesService.radicarTramite({
      titulo: validation.data.titulo,
      descripcion: validation.data.descripcion,
      tipoTramite: validation.data.tipoTramite as TipoTramite,
      municipio: validation.data.municipio,
      ubicacionDetalle: validation.data.ubicacionDetalle,
      nombreArchivoAdjunto: validation.data.nombreArchivo,
      simularFallaAI: validation.data.simularFallaAI,
    });

    revalidatePath("/tramites");
    revalidatePath("/funcionario");

    return {
      success: true,
      codigo: nuevo.codigo,
      tramiteId: nuevo.id,
      message: `Trámite ${nuevo.codigo} radicado satisfactoriamente.`,
    };
  } catch {
    return {
      success: false,
      message: "Error al radicar el trámite en el servidor.",
    };
  }
}
