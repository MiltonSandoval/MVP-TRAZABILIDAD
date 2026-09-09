# SPEC-02: Radicación y Motor de Trazabilidad en Tiempo Real (TRAZA-CORE)

## 1. Contexto y Objetivos
Gestionar el ciclo de vida transaccional de los trámites socioambientales municipales en el oriente boliviano: radicación digital, generación de código alfanumérico único (`TRAM-[MUN]-YYYY-NNNNNN`), código QR para auditoría pública y bitácora de eventos inmutable sincronizada en tiempo real mediante **Supabase Realtime**.

## 2. Tipos de Trámites Socioambientales
- Licencia Ambiental Municipal (Categoría 3 y 4 - Ley 1333)
- Autorización de Desmonte Periurbano Controlado
- Permiso de Cambio de Uso de Suelo
- Inspección Técnica de Cuenca Hídrica
- Denuncia Ciudadana por Contaminación o Quema Ilegal (Chaqueo)

## 3. Estados del Trámite
- `INGRESADO`: Trámite radicado por el ciudadano, esperando asignación.
- `EN_REVISION`: Expediente en revisión preliminar de requisitos documentales.
- `EVALUACION_AMBIENTAL`: Inspección pericial en campo o análisis técnico ambiental.
- `OBSERVADO`: Requiere subsanación documental por parte del ciudadano en un plazo límite.
- `APROBADO`: Resolución técnica favorable emitida.
- `RECHAZADO`: Dictamen negativo fundamentado legal y ambientalmente.

## 4. Modelos de Datos (Prisma)
```prisma
model Tramite {
  id                    String    @id @default(uuid())
  codigo                String    @unique
  titulo                String
  descripcion           String
  tipoTramite           TipoTramite
  estado                EstadoTramite @default(INGRESADO)
  municipio             String    @default("Santa Cruz de la Sierra")
  ubicacionDetalle      String?
  latitud               Float?
  longitud              Float?
  ciudadanoId           String
  funcionarioAsignadoId String?
  nivelRiesgoAI         NivelRiesgoAI?
  scoreRiesgoAI         Float?    @default(0.0)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  ciudadano             Profile   @relation("CiudadanoTramites", fields: [ciudadanoId], references: [id])
  funcionario           Profile?  @relation("FuncionarioTramites", fields: [funcionarioAsignadoId], references: [id])
  documentos            DocumentoAdjunto[]
  historial             HistorialTramite[]
  analisisAI            AnalisisPredictivoAI?
}

model DocumentoAdjunto {
  id          String   @id @default(uuid())
  tramiteId   String
  nombre      String
  fileUrl     String
  tipoMime    String
  tamanoBytes Int
  createdAt   DateTime @default(now())

  tramite     Tramite  @relation(fields: [tramiteId], references: [id], onDelete: Cascade)
}

model HistorialTramite {
  id             String        @id @default(uuid())
  tramiteId      String
  estadoAnterior EstadoTramite?
  nuevoEstado    EstadoTramite
  autorId        String
  autorNombre    String
  autorRol       String
  observaciones  String?
  timestamp      DateTime      @default(now())

  tramite        Tramite       @relation(fields: [tramiteId], references: [id], onDelete: Cascade)
}

enum TipoTramite {
  LICENCIA_AMBIENTAL_MUNICIPAL
  AUTORIZACION_DESMONTE_CONTROLADO
  CAMBIO_USO_SUELO
  INSPECCION_CUENCA_HIDRICA
  DENUNCIA_CONTAMINACION_CHAQUEO
}

enum EstadoTramite {
  INGRESADO
  EN_REVISION
  EVALUACION_AMBIENTAL
  OBSERVADO
  APROBADO
  RECHAZADO
}

enum NivelRiesgoAI {
  BAJO_RIESGO
  MEDIO_RIESGO
  ALTO_RIESGO_SOCIOAMBIENTAL
  PENDIENTE_CLASIFICACION_MANUAL
}
```

## 5. Criterios de Aceptación (BDD)
- **Escenario 1:** Al radicar un trámite con datos válidos y documento adjunto, se genera código único con formato reglamentario y se registra el primer hito en el historial.
- **Escenario 2:** La línea de tiempo pública despliega los eventos históricos ordenados cronológicamente con autor y fecha inmutables.
- **Escenario 3:** Cuando un funcionario actualiza el estado, la vista pública refleja el cambio sin requerir recarga total.
