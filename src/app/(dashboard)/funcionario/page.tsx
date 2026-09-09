import React from "react";
import { TramitesService } from "@/modules/tramites/services/tramites.service";
import { ResumenEstadisticas } from "@/modules/dashboard/components/ResumenEstadisticas";
import { BandejaGestion } from "@/modules/dashboard/components/BandejaGestion";
import { Inbox, Sparkles } from "lucide-react";

export default async function FuncionarioPage() {
  const tramites = await TramitesService.obtenerTodos();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Inbox className="w-6 h-6 text-amber-600" />
              Bandeja de Gestión y Despacho Municipal
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              AI-DLC Habilitado
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Unidad de Gestión Ambiental • Expedientes priorizados por criticidad y severidad ecológica (Ley 1333)
          </p>
        </div>
      </div>

      {/* Widgets Estadísticos */}
      <ResumenEstadisticas tramites={tramites} />

      {/* Bandeja con Filtros y Acciones */}
      <BandejaGestion initialTramites={tramites} />
    </div>
  );
}
