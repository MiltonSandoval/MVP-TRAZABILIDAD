import React from "react";
import Link from "next/link";
import { Tramite } from "../types/tramite.types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/Card";
import {
  formatearFecha,
  obtenerEtiquetaEstado,
  obtenerEtiquetaTipoTramite,
  obtenerEstiloRiesgoAI,
} from "@/shared/utils/formatters";
import { MapPin, Calendar, FileText, ArrowRight, BrainCircuit } from "lucide-react";

export function TramiteCard({ tramite }: { tramite: Tramite }) {
  const estadoInfo = obtenerEtiquetaEstado(tramite.estado);
  const riesgoInfo = obtenerEstiloRiesgoAI(tramite.nivelRiesgoAI);

  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3 bg-slate-50/50">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1.5">
            {tramite.codigo}
          </span>
          <CardTitle className="text-base font-semibold line-clamp-1">
            {tramite.titulo}
          </CardTitle>
          <span className="text-xs text-slate-500 font-medium">
            {obtenerEtiquetaTipoTramite(tramite.tipoTramite)}
          </span>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${estadoInfo.color}`}
        >
          {estadoInfo.label}
        </span>
      </CardHeader>

      <CardContent className="space-y-3 py-3">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {tramite.descripcion}
        </p>

        {/* Indicador de Análisis AI-DLC */}
        <div
          className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${riesgoInfo.badgeClass}`}
        >
          <BrainCircuit className={`w-4 h-4 mt-0.5 shrink-0 ${riesgoInfo.iconColor}`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{riesgoInfo.label}</span>
              {tramite.scoreRiesgoAI > 0 && (
                <span className="font-mono text-[11px] opacity-80">
                  Score: {(tramite.scoreRiesgoAI * 100).toFixed(0)}%
                </span>
              )}
            </div>
            {tramite.analisisAI?.recomendaciones && (
              <p className="text-[11px] mt-0.5 opacity-90 line-clamp-1">
                {tramite.analisisAI.recomendaciones}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{tramite.municipio}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <time>{formatearFecha(tramite.createdAt)}</time>
          </div>
          {tramite.documentos.length > 0 && (
            <div className="flex items-center gap-1 text-slate-600">
              <FileText className="w-3.5 h-3.5" />
              <span>{tramite.documentos.length} requisito(s)</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="py-2.5 bg-slate-50/70 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Última actualización: {formatearFecha(tramite.updatedAt)}
        </span>
        <Link
          href={`/trazabilidad/${tramite.codigo}`}
          className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <span>Trazabilidad en vivo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
