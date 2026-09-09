import React from "react";
import Link from "next/link";
import { AuthService } from "@/modules/auth/services/auth.service";
import { TramitesService } from "@/modules/tramites/services/tramites.service";
import { TramiteCard } from "@/modules/tramites/components/TramiteCard";
import { PlusCircle, FileText, Sparkles } from "lucide-react";

export default async function TramitesCiudadanoPage() {
  const currentUser = await AuthService.getCurrentSession();
  const ciudadanoId = currentUser?.id || "usr-ciud-01";
  const misTramites = await TramitesService.obtenerPorCiudadano(ciudadanoId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Mis Trámites Socioambientales
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historial de expedientes radicados por {currentUser?.nombre} • Consulta auditable
          </p>
        </div>

        <Link
          href="/tramites/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Radicar Nuevo Trámite
        </Link>
      </div>

      {misTramites.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No cuenta con trámites activos
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Inicie su primera solicitud digitalizada con análisis predictivo de impacto socioambiental.
          </p>
          <div className="pt-2">
            <Link
              href="/tramites/nuevo"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Radicar Solicitud
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {misTramites.map((tramite) => (
            <TramiteCard key={tramite.id} tramite={tramite} />
          ))}
        </div>
      )}
    </div>
  );
}
