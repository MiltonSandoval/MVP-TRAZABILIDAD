"use server";

import { revalidatePath } from "next/cache";
import { TramitesService } from "../services/tramites.service";
import { actualizarEstadoSchema } from "../schemas/tramite.schema";
import { EstadoTramite } from "../types/tramite.types";

export interface ActualizarEstadoResponse {
  success: boolean;
  message?: string;
}

export async function actualizarEstadoAction(formData: FormData): Promise<ActualizarEstadoResponse> {
  const rawData = {
    tramiteId: formData.get("tramiteId") as string,
    nuevoEstado: formData.get("nuevoEstado") as EstadoTramite,
    observaciones: formData.get("observaciones") as string,
  };

  const validation = actualizarEstadoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message || "Datos del dictamen inválidos.",
    };
  }

  try {
    const actualizado = await TramitesService.actualizarEstado(
      validation.data.tramiteId,
      validation.data.nuevoEstado as EstadoTramite,
      validation.data.observaciones
    );

    if (!actualizado) {
      return {
        success: false,
        message: "No se encontró el trámite especificado.",
      };
    }

    revalidatePath("/funcionario");
    revalidatePath("/tramites");
    revalidatePath(`/trazabilidad/${actualizado.codigo}`);

    return {
      success: true,
      message: `El estado fue actualizado a "${actualizado.estado}".`,
    };
  } catch {
    return {
      success: false,
      message: "Error al actualizar el estado del trámite.",
    };
  }
}
