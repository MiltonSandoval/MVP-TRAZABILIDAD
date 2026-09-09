export interface DemoProfile {
  id: string;
  userId: string;
  email: string;
  nombre: string;
  ci?: string;
  telefono?: string;
  rol: "CIUDADANO" | "FUNCIONARIO_TECNICO" | "ADMINISTRADOR";
  cargo?: string;
  municipioId: string;
}

export interface DemoDocumento {
  id: string;
  tramiteId: string;
  nombre: string;
  fileUrl: string;
  tipoMime: string;
  tamanoBytes: number;
  createdAt: string;
}

export interface DemoHistorial {
  id: string;
  tramiteId: string;
  estadoAnterior: string | null;
  nuevoEstado: string;
  autorId: string;
  autorNombre: string;
  autorRol: string;
  observaciones: string | null;
  timestamp: string;
}

export interface DemoAnalisisAI {
  id: string;
  tramiteId: string;
  nivelRiesgo: "BAJO_RIESGO" | "MEDIO_RIESGO" | "ALTO_RIESGO_SOCIOAMBIENTAL" | "PENDIENTE_CLASIFICACION_MANUAL";
  scoreConfianza: number;
  factoresDetectados: string[];
  recomendaciones: string;
  modeloVersion: string;
  createdAt: string;
}

export interface DemoTramite {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  tipoTramite: string;
  estado: "INGRESADO" | "EN_REVISION" | "EVALUACION_AMBIENTAL" | "OBSERVADO" | "APROBADO" | "RECHAZADO";
  municipio: string;
  ubicacionDetalle: string;
  ciudadanoId: string;
  ciudadanoNombre: string;
  funcionarioAsignadoId?: string;
  nivelRiesgoAI: "BAJO_RIESGO" | "MEDIO_RIESGO" | "ALTO_RIESGO_SOCIOAMBIENTAL" | "PENDIENTE_CLASIFICACION_MANUAL";
  scoreRiesgoAI: number;
  createdAt: string;
  updatedAt: string;
  documentos: DemoDocumento[];
  historial: DemoHistorial[];
  analisisAI?: DemoAnalisisAI;
}

// Perfiles precargados para evaluación rápida
export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "usr-ciud-01",
    userId: "auth-ciud-01",
    email: "ciudadano@santacruz.gob.bo",
    nombre: "Lic. Carlos Banzer Mercado",
    ci: "5487921-SC",
    telefono: "+591 76012345",
    rol: "CIUDADANO",
    municipioId: "SCZ-01",
  },
  {
    id: "usr-func-01",
    userId: "auth-func-01",
    email: "tecnico@santacruz.gob.bo",
    nombre: "Ing. Mariana Roca Suárez",
    ci: "4289301-SC",
    telefono: "+591 78456789",
    rol: "FUNCIONARIO_TECNICO",
    cargo: "Perito Evaluador de Impacto Ambiental Municipal",
    municipioId: "SCZ-01",
  },
];

// Trámites semilla del oriente boliviano
export const DEMO_TRAMITES: DemoTramite[] = [
  {
    id: "tram-001",
    codigo: "TRAM-SCZ-2026-000101",
    titulo: "Solicitud de Licencia Ambiental para Granja Avícola Periurbana",
    descripcion:
      "Construcción y operación de galpones avícolas en zona periurbana de Cotoca. Se solicita evaluación de manejo de efluentes y residuos orgánicos según Ley 1333.",
    tipoTramite: "LICENCIA_AMBIENTAL_MUNICIPAL",
    estado: "EVALUACION_AMBIENTAL",
    municipio: "Santa Cruz de la Sierra",
    ubicacionDetalle: "Km 14 al Este, Comunidad La Enconada",
    ciudadanoId: "usr-ciud-01",
    ciudadanoNombre: "Lic. Carlos Banzer Mercado",
    funcionarioAsignadoId: "usr-func-01",
    nivelRiesgoAI: "MEDIO_RIESGO",
    scoreRiesgoAI: 0.58,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    documentos: [
      {
        id: "doc-001",
        tramiteId: "tram-001",
        nombre: "Memoria_Tecnica_Granja.pdf",
        fileUrl: "/docs/Memoria_Tecnica_Granja.pdf",
        tipoMime: "application/pdf",
        tamanoBytes: 2450000,
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    historial: [
      {
        id: "hist-001",
        tramiteId: "tram-001",
        estadoAnterior: null,
        nuevoEstado: "INGRESADO",
        autorId: "usr-ciud-01",
        autorNombre: "Lic. Carlos Banzer Mercado",
        autorRol: "CIUDADANO",
        observaciones: "Radicación inicial formal mediante portal web.",
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "hist-002",
        tramiteId: "tram-001",
        estadoAnterior: "INGRESADO",
        nuevoEstado: "EN_REVISION",
        autorId: "usr-func-01",
        autorNombre: "Ing. Mariana Roca Suárez",
        autorRol: "FUNCIONARIO_TECNICO",
        observaciones: "Documentación legal completa y cotejada.",
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "hist-003",
        tramiteId: "tram-001",
        estadoAnterior: "EN_REVISION",
        nuevoEstado: "EVALUACION_AMBIENTAL",
        autorId: "usr-func-01",
        autorNombre: "Ing. Mariana Roca Suárez",
        autorRol: "FUNCIONARIO_TECNICO",
        observaciones: "Asignación de fecha para inspección de olores y tratamiento de excretas.",
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    analisisAI: {
      id: "ai-001",
      tramiteId: "tram-001",
      nivelRiesgo: "MEDIO_RIESGO",
      scoreConfianza: 0.89,
      factoresDetectados: ["Manejo de efluentes", "Emisión odorífera", "Proximidad a napa freática"],
      recomendaciones: "Exigir biodigestores anaeróbicos herméticos y cerco perimetral vivo de 10 metros.",
      modeloVersion: "ai-socioambiental-v1.0",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: "tram-002",
    codigo: "TRAM-SCZ-2026-000102",
    titulo: "Autorización de Desmonte y Nivelación de Terreno adyacente a Curichi",
    descripcion:
      "Desmonte mecanizado de 15 hectáreas con posible afectación a humedal curichi y cuenca de recarga hídrica en Roboré.",
    tipoTramite: "AUTORIZACION_DESMONTE_CONTROLADO",
    estado: "INGRESADO",
    municipio: "Roboré",
    ubicacionDetalle: "Sector Serranía de Santiago de Chiquitos",
    ciudadanoId: "usr-ciud-01",
    ciudadanoNombre: "Lic. Carlos Banzer Mercado",
    funcionarioAsignadoId: undefined,
    nivelRiesgoAI: "ALTO_RIESGO_SOCIOAMBIENTAL",
    scoreRiesgoAI: 0.94,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    documentos: [
      {
        id: "doc-002",
        tramiteId: "tram-002",
        nombre: "Plano_Desmonte_Robore.pdf",
        fileUrl: "/docs/Plano_Desmonte_Robore.pdf",
        tipoMime: "application/pdf",
        tamanoBytes: 5120000,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    historial: [
      {
        id: "hist-004",
        tramiteId: "tram-002",
        estadoAnterior: null,
        nuevoEstado: "INGRESADO",
        autorId: "usr-ciud-01",
        autorNombre: "Lic. Carlos Banzer Mercado",
        autorRol: "CIUDADANO",
        observaciones: "Ingresado con alerta preventiva de biodiversidad chiquitana generada por AI-DLC.",
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    analisisAI: {
      id: "ai-002",
      tramiteId: "tram-002",
      nivelRiesgo: "ALTO_RIESGO_SOCIOAMBIENTAL",
      scoreConfianza: 0.96,
      factoresDetectados: [
        "Desmonte en zona de recarga hídrica",
        "Cercanía a curichi/humedal natural",
        "Riesgo de alteración biológica en Chiquitania",
      ],
      recomendaciones:
        "CRÍTICO: Suspender autorización automática. Requiere Estudio de Evaluación de Impacto Ambiental (EEIA) analítico y consulta vecinal según Ley 1333.",
      modeloVersion: "ai-socioambiental-v1.0",
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: "tram-003",
    codigo: "TRAM-SCZ-2026-000103",
    titulo: "Cambio de Uso de Suelo para Vivero Forestal de Especies Nativas",
    descripcion:
      "Habilitación predial para instalación de vivero de tajibos, toborochis y curupaú destinados a reforestación urbana en San Ignacio de Velasco.",
    tipoTramite: "CAMBIO_USO_SUELO",
    estado: "APROBADO",
    municipio: "San Ignacio de Velasco",
    ubicacionDetalle: "Barrio San Miguelito, Distrito 2",
    ciudadanoId: "usr-ciud-01",
    ciudadanoNombre: "Lic. Carlos Banzer Mercado",
    funcionarioAsignadoId: "usr-func-01",
    nivelRiesgoAI: "BAJO_RIESGO",
    scoreRiesgoAI: 0.12,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    documentos: [
      {
        id: "doc-003",
        tramiteId: "tram-003",
        nombre: "Proyecto_Vivero_Nativas.pdf",
        fileUrl: "/docs/Proyecto_Vivero_Nativas.pdf",
        tipoMime: "application/pdf",
        tamanoBytes: 1200000,
        createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    historial: [
      {
        id: "hist-005",
        tramiteId: "tram-003",
        estadoAnterior: null,
        nuevoEstado: "INGRESADO",
        autorId: "usr-ciud-01",
        autorNombre: "Lic. Carlos Banzer Mercado",
        autorRol: "CIUDADANO",
        observaciones: "Ingreso de trámite con fomento ambiental.",
        timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "hist-006",
        tramiteId: "tram-003",
        estadoAnterior: "INGRESADO",
        nuevoEstado: "APROBADO",
        autorId: "usr-func-01",
        autorNombre: "Ing. Mariana Roca Suárez",
        autorRol: "FUNCIONARIO_TECNICO",
        observaciones: "Resolución Municipal Favorable N° 45/2026. Proyecto amigable con el ecosistema.",
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    analisisAI: {
      id: "ai-003",
      tramiteId: "tram-003",
      nivelRiesgo: "BAJO_RIESGO",
      scoreConfianza: 0.98,
      factoresDetectados: ["Reforestación nativa", "Impacto positivo en biodiversidad"],
      recomendaciones: "Aprobación expedita recomendada con exención de arancel ambiental de fomento.",
      modeloVersion: "ai-socioambiental-v1.0",
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    },
  },
];

// Estado en memoria singleton para sesiones activas en el servidor
const globalStore = globalThis as unknown as {
  tramitesStore: DemoTramite[];
  activeSession: DemoProfile | null;
};

if (!globalStore.tramitesStore) {
  globalStore.tramitesStore = [...DEMO_TRAMITES];
}
if (!globalStore.activeSession) {
  globalStore.activeSession = DEMO_PROFILES[0]; // Ciudadano por defecto
}

export const inMemoryStore = {
  getTramites: () => globalStore.tramitesStore,
  getTramiteByCodigo: (codigo: string) =>
    globalStore.tramitesStore.find((t) => t.codigo.toUpperCase() === codigo.toUpperCase()),
  getTramiteById: (id: string) => globalStore.tramitesStore.find((t) => t.id === id),
  addTramite: (tramite: DemoTramite) => {
    globalStore.tramitesStore.unshift(tramite);
    return tramite;
  },
  updateTramiteEstado: (
    id: string,
    nuevoEstado: DemoTramite["estado"],
    observaciones: string,
    autor: DemoProfile
  ) => {
    const tramite = globalStore.tramitesStore.find((t) => t.id === id);
    if (!tramite) return null;

    const estadoAnterior = tramite.estado;
    tramite.estado = nuevoEstado;
    tramite.updatedAt = new Date().toISOString();

    const nuevoHito: DemoHistorial = {
      id: `hist-${Date.now()}`,
      tramiteId: tramite.id,
      estadoAnterior,
      nuevoEstado,
      autorId: autor.id,
      autorNombre: autor.nombre,
      autorRol: autor.rol,
      observaciones: observaciones || null,
      timestamp: new Date().toISOString(),
    };

    tramite.historial.push(nuevoHito);
    return tramite;
  },
  getActiveSession: () => globalStore.activeSession,
  setActiveSession: (profile: DemoProfile) => {
    globalStore.activeSession = profile;
    return profile;
  },
};
