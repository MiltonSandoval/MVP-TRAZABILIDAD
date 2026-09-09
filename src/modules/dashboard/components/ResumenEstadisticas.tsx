import React from "react";
import { Tramite } from "@/modules/tramites/types/tramite.types";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { ShieldAlert, FileCheck, Clock, Layers } from "lucide-react";

export function ResumenEstadisticas({ tramites }: { tramites: Tramite[] }) {
  const total = tramites.length;
  const altosRiesgo = tramites.filter((t) => t.nivelRiesgoAI === "ALTO_RIESGO_SOCIOAMBIENTAL").length;
  const enEvaluacion = tramites.filter(
    (t) => t.estado === "INGRESADO" || t.estado === "EN_REVISION" || t.estado === "EVALUACION_AMBIENTAL"
  ).length;
  const aprobados = tramites.filter((t) => t.estado === "APROBADO").length;

  const stats = [
    {
      label: "Total Expedientes",
      value: total,
      subtext: "Radicados en el sistema",
      icon: <Layers className="w-5 h-5 text-slate-700" />,
      bg: "bg-slate-50",
      border: "border-slate-200",
    },
    {
      label: "Alto Riesgo AI-DLC",
      value: altosRiesgo,
      subtext: "Prioridad de inspección",
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50/70",
      border: "border-red-200",
    },
    {
      label: "En Gestión Activa",
      value: enEvaluacion,
      subtext: "Revisiones pendientes",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50/70",
      border: "border-amber-200",
    },
    {
      label: "Aprobados / Concluidos",
      value: aprobados,
      subtext: "Resolución favorable",
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50/70",
      border: "border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className={`${stat.border} ${stat.bg}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.subtext}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100">
              {stat.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
