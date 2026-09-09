"use client";

import React, { useState } from "react";
import { HistorialItem } from "../types/tramite.types";
import { formatearFecha, obtenerEtiquetaEstado } from "@/shared/utils/formatters";
import { Badge } from "@/shared/components/ui/Badge";
import { Clock, CheckCircle2, AlertCircle, RefreshCw, UserCheck, Shield } from "lucide-react";

export interface TramiteTimelineProps {
  historial: HistorialItem[];
  codigoTramite: string;
}

export function TramiteTimeline({ historial, codigoTramite }: TramiteTimelineProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [items, setItems] = useState<HistorialItem[]>(historial);

  // Simulación de suscripción en tiempo real (Supabase Realtime)
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "OBSERVADO":
      case "RECHAZADO":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Clock className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            Línea de Tiempo Inmutable (Auditoría Pública)
          </h4>
          <p className="text-xs text-slate-500">
            Sincronizado en tiempo real mediante canales de base de datos
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Actualizar en tiempo real"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
          <span>En vivo</span>
        </button>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {items.map((item, index) => {
          const infoEstado = obtenerEtiquetaEstado(item.nuevoEstado);
          const esUltimo = index === items.length - 1;

          return (
            <div key={item.id || index} className="relative group">
              {/* Nodo indicador del timeline */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                  esUltimo
                    ? "border-emerald-600 ring-4 ring-emerald-100 animate-pulse"
                    : "border-slate-400"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${esUltimo ? "bg-emerald-600" : "bg-slate-400"}`} />
              </div>

              {/* Tarjeta de hito */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.nuevoEstado)}
                    <span className="font-semibold text-sm text-slate-800">
                      {infoEstado.label}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.nuevoEstado}
                    </Badge>
                  </div>
                  <time className="text-xs text-slate-500 font-mono">
                    {formatearFecha(item.timestamp)}
                  </time>
                </div>

                {item.observaciones && (
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                    {item.observaciones}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Actuación registrada por: </span>
                  <span className="font-medium text-slate-700">{item.autorNombre}</span>
                  <span className="text-slate-400">({item.autorRol})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
