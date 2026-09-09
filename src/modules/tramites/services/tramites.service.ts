import { inMemoryStore, DemoTramite, DemoDocumento, DemoHistorial, DemoAnalisisAI } from "@/shared/lib/store";
import { AISocioambientalService } from "@/modules/ai-engine/services/ai-socioambiental.service";
import { CrearTramiteInput, TipoTramite, EstadoTramite } from "../types/tramite.types";
import { AuthService } from "@/modules/auth/services/auth.service";

export class TramitesService {
  /**
   * Genera un código único reglamentario municipal.
   * Ej: TRAM-SCZ-2026-000451
   */
  static generarCodigoUnico(municipio: string): string {
    const norm = municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const abrevMun = norm.includes("robore")
      ? "ROB"
      : norm.includes("ignacio")
      ? "SIV"
      : norm.includes("suarez")
      ? "PSZ"
      : "SCZ";

    const anio = 2026;
    const aleatorio = Math.floor(100000 + Math.random() * 900000);
    return `TRAM-${abrevMun}-${anio}-${aleatorio}`;
  }

  /**
   * Radica un nuevo trámite, ejecuta el motor AI-DLC y registra el evento inicial.
   */
  static async radicarTramite(input: CrearTramiteInput): Promise<DemoTramite> {
    const session = await AuthService.getCurrentSession();
    const ciudadanoId = session?.id || "usr-ciud-01";
    const ciudadanoNombre = session?.nombre || "Lic. Carlos Banzer Mercado";

    const codigo = this.generarCodigoUnico(input.municipio);
    const id = `tram-${Date.now()}`;
    const ahora = new Date().toISOString();

    // Inferencia con el motor AI-DLC
    const analisis = await AISocioambientalService.evaluarTramite(
      input.titulo,
      input.descripcion,
      input.tipoTramite,
      input.simularFallaAI
    );

    const documentos: DemoDocumento[] = [];
    if (input.nombreArchivoAdjunto) {
      documentos.push({
        id: `doc-${Date.now()}`,
        tramiteId: id,
        nombre: input.nombreArchivoAdjunto,
        fileUrl: `/uploads/${input.nombreArchivoAdjunto}`,
        tipoMime: "application/pdf",
        tamanoBytes: 3250000,
        createdAt: ahora,
      });
    }

    const primerHito: DemoHistorial = {
      id: `hist-${Date.now()}`,
      tramiteId: id,
      estadoAnterior: null,
      nuevoEstado: "INGRESADO",
      autorId: ciudadanoId,
      autorNombre: ciudadanoNombre,
      autorRol: "CIUDADANO",
      observaciones: `Radicación electrónica inicial. El motor AI-DLC categorizó el riesgo como ${analisis.nivelRiesgo}.`,
      timestamp: ahora,
    };

    const analisisData: DemoAnalisisAI = {
      id: `ai-${Date.now()}`,
      tramiteId: id,
      nivelRiesgo: analisis.nivelRiesgo,
      scoreConfianza: analisis.scoreConfianza,
      factoresDetectados: analisis.factoresDetectados,
      recomendaciones: analisis.recomendaciones,
      modeloVersion: "ai-socioambiental-v1.0",
      createdAt: ahora,
    };

    const nuevoTramite: DemoTramite = {
      id,
      codigo,
      titulo: input.titulo,
      descripcion: input.descripcion,
      tipoTramite: input.tipoTramite,
      estado: "INGRESADO",
      municipio: input.municipio,
      ubicacionDetalle: input.ubicacionDetalle,
      ciudadanoId,
      ciudadanoNombre,
      nivelRiesgoAI: analisis.nivelRiesgo,
      scoreRiesgoAI: analisis.scoreRiesgo,
      createdAt: ahora,
      updatedAt: ahora,
      documentos,
      historial: [primerHito],
      analisisAI: analisisData,
    };

    return inMemoryStore.addTramite(nuevoTramite);
  }

  /**
   * Obtiene todos los trámites para la bandeja municipal con ordenamiento ponderado por IA.
   */
  static async obtenerTodos(filtro?: {
    tipo?: string;
    estado?: string;
    riesgo?: string;
  }): Promise<DemoTramite[]> {
    let list = inMemoryStore.getTramites();

    if (filtro?.tipo && filtro.tipo !== "TODOS") {
      list = list.filter((t) => t.tipoTramite === filtro.tipo);
    }
    if (filtro?.estado && filtro.estado !== "TODOS") {
      list = list.filter((t) => t.estado === filtro.estado);
    }
    if (filtro?.riesgo && filtro.riesgo !== "TODOS") {
      list = list.filter((t) => t.nivelRiesgoAI === filtro.riesgo);
    }

    // Ordenamiento ponderado: mayor score de IA primero, y trámites más recientes después
    return [...list].sort((a, b) => {
      if (b.scoreRiesgoAI !== a.scoreRiesgoAI) {
        return b.scoreRiesgoAI - a.scoreRiesgoAI;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Obtiene los trámites radicados por el ciudadano activo.
   */
  static async obtenerPorCiudadano(ciudadanoId: string): Promise<DemoTramite[]> {
    const list = inMemoryStore.getTramites();
    return list.filter((t) => t.ciudadanoId === ciudadanoId);
  }

  /**
   * Consulta un trámite por su código alfanumérico único para auditoría pública.
   */
  static async consultarPorCodigo(codigo: string): Promise<DemoTramite | null> {
    return inMemoryStore.getTramiteByCodigo(codigo) || null;
  }

  /**
   * Consulta un trámite por su identificador interno.
   */
  static async consultarPorId(id: string): Promise<DemoTramite | null> {
    return inMemoryStore.getTramiteById(id) || null;
  }

  /**
   * Actualiza el estado del expediente y agrega un hito inmutable a la bitácora.
   */
  static async actualizarEstado(
    tramiteId: string,
    nuevoEstado: EstadoTramite,
    observaciones: string
  ): Promise<DemoTramite | null> {
    const session = await AuthService.getCurrentSession();
    const autor = session || {
      id: "usr-func-01",
      userId: "auth-func-01",
      email: "tecnico@santacruz.gob.bo",
      nombre: "Ing. Mariana Roca Suárez",
      ci: "4289301-SC",
      telefono: "+591 78456789",
      rol: "FUNCIONARIO_TECNICO" as const,
      municipioId: "SCZ-01",
    };

    return inMemoryStore.updateTramiteEstado(tramiteId, nuevoEstado, observaciones, autor);
  }
}
