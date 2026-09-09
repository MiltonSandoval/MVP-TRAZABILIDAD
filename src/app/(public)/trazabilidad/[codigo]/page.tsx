import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TramitesService } from "@/modules/tramites/services/tramites.service";
import { TramiteTimeline } from "@/modules/tramites/components/TramiteTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import {
  formatearFecha,
  obtenerEtiquetaEstado,
  obtenerEtiquetaTipoTramite,
  obtenerEstiloRiesgoAI,
} from "@/shared/utils/formatters";
import {
  TreePine,
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  BrainCircuit,
  QrCode,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default async function TrazabilidadPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const resolvedParams = await params;
  const codigo = decodeURIComponent(resolvedParams.codigo);
  const tramite = await TramitesService.consultarPorCodigo(codigo);

  if (!tramite) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl">Trámite no encontrado</CardTitle>
          <p className="text-xs text-slate-600">
            No se encontró ningún expediente municipal con el código{" "}
            <span className="font-mono font-bold text-slate-900">{codigo}</span>.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Inicio
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const estadoInfo = obtenerEtiquetaEstado(tramite.estado);
  const riesgoInfo = obtenerEstiloRiesgoAI(tramite.nivelRiesgoAI);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="Volver a la portada"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-bold text-sm text-slate-900 block">
                Portal de Transparencia Ciudadana
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {tramite.municipio} • Trazabilidad Inmutable
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-700 hover:text-emerald-700 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Cabecera del Trámite */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {tramite.codigo}
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${estadoInfo.color}`}>
                  {estadoInfo.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {tramite.titulo}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {obtenerEtiquetaTipoTramite(tramite.tipoTramite)}
              </p>
            </div>

            {/* QR de Validación Oficial */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 block">Certificación QR</span>
                <span className="text-slate-500 block">Validez digital municipal</span>
                <span className="text-[10px] text-emerald-700 font-mono">Ley N° 482 / 1333</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold block text-slate-800">Ubicación</span>
                <span>{tramite.ubicacionDetalle} ({tramite.municipio})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold block text-slate-800">Fecha de Radicación</span>
                <span>{formatearFecha(tramite.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold block text-slate-800">Solicitante Registrado</span>
                <span>{tramite.ciudadanoNombre}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dos columnas: Memoria Técnica & Análisis AI vs. Línea de Tiempo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Detalles y AI Engine */}
          <div className="space-y-6">
            {/* Tarjeta de Análisis AI-DLC */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-700" />
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Dictamen Predictivo AI-DLC
                  </CardTitle>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] border ${riesgoInfo.badgeClass}`}>
                  {riesgoInfo.label}
                </span>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                {tramite.scoreRiesgoAI > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Nivel de Severidad Ecológica</span>
                      <span className="font-mono">{(tramite.scoreRiesgoAI * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          tramite.scoreRiesgoAI > 0.6
                            ? "bg-red-500"
                            : tramite.scoreRiesgoAI > 0.35
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${tramite.scoreRiesgoAI * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {tramite.analisisAI?.factoresDetectados && tramite.analisisAI.factoresDetectados.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Factores y Criterios Detectados:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {tramite.analisisAI.factoresDetectados.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tramite.analisisAI?.recomendaciones && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
                    <span className="font-semibold block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Recomendación Técnica:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {tramite.analisisAI.recomendaciones}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documentos Adjuntos */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Expediente Digital Custodiado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                {tramite.documentos.length === 0 ? (
                  <p className="text-slate-500">No se adjuntaron archivos adicionales.</p>
                ) : (
                  tramite.documentos.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate" title={doc.nombre}>
                          {doc.nombre}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        PDF Seguro
                      </span>
                    </div>
                  ))
                )}
                <p className="text-[10px] text-slate-400 pt-1">
                  Almacenado bajo cifrado en Supabase Storage (S3-compatible).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Timeline Inmutable en Tiempo Real */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <TramiteTimeline historial={tramite.historial} codigoTramite={tramite.codigo} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
