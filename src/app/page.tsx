import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  BrainCircuit,
  FileCheck2,
  TreePine,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { TramitesService } from "@/modules/tramites/services/tramites.service";
import { ResumenEstadisticas } from "@/modules/dashboard/components/ResumenEstadisticas";

export default async function HomePage() {
  const tramites = await TramitesService.obtenerTodos();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navbar Superior */}
      <header className="border-b border-emerald-800/40 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight block">
                Gobierno Autónomo Municipal
              </span>
              <span className="text-[11px] text-emerald-400 font-medium block">
                Trazabilidad Socioambiental • Oriente Boliviano
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-emerald-400"
            >
              <span>Acceder al Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ciclo de Vida AI-DLC y Gobernanza Digital</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Trazabilidad de Trámites Municipales en el Oriente Boliviano
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Plataforma pública transparente para la radicación digital, seguimiento inmutable en tiempo
            real y categorización predictiva de riesgos socioambientales bajo la Ley N° 1333.
          </p>

          {/* Buscador Rápido de Trazabilidad */}
          <div className="pt-4 max-w-xl mx-auto">
            <form
              action="/trazabilidad/buscar"
              method="GET"
              className="flex items-center bg-white rounded-xl shadow-xl p-1.5 border border-slate-200"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                name="codigo"
                placeholder="Ingrese su código único (ej. TRAM-SCZ-2026-000102)..."
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                defaultValue="TRAM-SCZ-2026-000102"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Consultar en Vivo
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2">
              Pruebe con códigos demo:{" "}
              <Link href="/trazabilidad/TRAM-SCZ-2026-000102" className="text-emerald-400 underline ml-1">
                TRAM-SCZ-2026-000102 (Alto Riesgo)
              </Link>
              ,{" "}
              <Link href="/trazabilidad/TRAM-SCZ-2026-000101" className="text-emerald-400 underline ml-1">
                TRAM-SCZ-2026-000101
              </Link>
            </p>
          </div>
        </div>

        {/* Pilares del AI-DLC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Motor AI-DLC Socioambiental</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inferencia automática sobre memorias técnicas para detectar desmontes, chaqueos y afectación a
              cuencas y reservas chiquitanas con circuit breaker ante contingencias.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Trazabilidad Inmutable</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bitácora cronológica auditable que registra cada actuación del funcionario y cambio de fase,
              eliminando el extravío de expedientes físicos en papel.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-xl flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Despacho Municipal Priorizado</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bandeja de gestión para inspectores con ordenamiento ponderado por urgencia e índice de riesgo
              ecológico bajo la Ley N° 1333 y Ley N° 482.
            </p>
          </div>
        </div>

        {/* Panel de Estadísticas en Vivo */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-400" />
              Estado General de Expedientes Socioambientales
            </h2>
            <Link
              href="/login"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Acceder a la bandeja completa</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResumenEstadisticas tramites={tramites} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-center text-xs text-slate-500 space-y-2">
        <p>
          Proyecto de Ingeniería de Software I • Universidad Privada Domingo Savio (UPDS)
        </p>
        <p className="text-[11px] text-slate-600">
          Desarrollado aplicando AI-DLC, Next.js, Prisma, PostgreSQL y Supabase
        </p>
      </footer>
    </div>
  );
}
