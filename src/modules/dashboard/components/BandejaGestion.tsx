"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tramite } from "@/modules/tramites/types/tramite.types";
import { DictamenModal } from "./DictamenModal";
import {
  formatearFecha,
  obtenerEtiquetaEstado,
  obtenerEtiquetaTipoTramite,
  obtenerEstiloRiesgoAI,
} from "@/shared/utils/formatters";
import {
  Search,
  Filter,
  BrainCircuit,
  MapPin,
  FileEdit,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export function BandejaGestion({ initialTramites }: { initialTramites: Tramite[] }) {
  const [tramites, setTramites] = useState<Tramite[]>(initialTramites);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroRiesgo, setFiltroRiesgo] = useState("TODOS");
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<Tramite | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Filtrado reactivo en el cliente
  const tramitesFiltrados = tramites.filter((t) => {
    const coincideTexto =
      t.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.municipio.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.ciudadanoNombre.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = filtroTipo === "TODOS" || t.tipoTramite === filtroTipo;
    const coincideEstado = filtroEstado === "TODOS" || t.estado === filtroEstado;
    const coincideRiesgo = filtroRiesgo === "TODOS" || t.nivelRiesgoAI === filtroRiesgo;

    return coincideTexto && coincideTipo && coincideEstado && coincideRiesgo;
  });

  const abrirDictamen = (t: Tramite) => {
    setTramiteSeleccionado(t);
    setModalAbierto(true);
  };

  const handleActualizado = () => {
    // Refresco optimista local
    if (tramiteSeleccionado) {
      setTramites((prev) =>
        prev.map((item) =>
          item.id === tramiteSeleccionado.id
            ? { ...item, updatedAt: new Date().toISOString() }
            : item
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por código, título, municipio o ciudadano..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros:</span>
            </div>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="TODOS">Todos los Trámites</option>
              <option value="LICENCIA_AMBIENTAL_MUNICIPAL">Licencias Ambientales</option>
              <option value="AUTORIZACION_DESMONTE_CONTROLADO">Desmonte Periurbano</option>
              <option value="CAMBIO_USO_SUELO">Cambio Uso de Suelo</option>
              <option value="INSPECCION_CUENCA_HIDRICA">Cuencas Hídricas</option>
              <option value="DENUNCIA_CONTAMINACION_CHAQUEO">Denuncias Chaqueo</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="INGRESADO">Ingresados</option>
              <option value="EN_REVISION">En Revisión</option>
              <option value="EVALUACION_AMBIENTAL">Evaluación Ambiental</option>
              <option value="OBSERVADO">Observados</option>
              <option value="APROBADO">Aprobados</option>
            </select>

            <select
              value={filtroRiesgo}
              onChange={(e) => setFiltroRiesgo(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="TODOS">Todo Riesgo IA</option>
              <option value="ALTO_RIESGO_SOCIOAMBIENTAL">Alto Riesgo</option>
              <option value="MEDIO_RIESGO">Riesgo Moderado</option>
              <option value="BAJO_RIESGO">Bajo Impacto</option>
              <option value="PENDIENTE_CLASIFICACION_MANUAL">Pendiente Clasificación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Gestión */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Código / Trámite</th>
                <th className="px-4 py-3">Municipio / Ciudadano</th>
                <th className="px-4 py-3">Priorización AI-DLC</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tramitesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron trámites con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                tramitesFiltrados.map((tramite) => {
                  const estadoInfo = obtenerEtiquetaEstado(tramite.estado);
                  const riesgoInfo = obtenerEstiloRiesgoAI(tramite.nivelRiesgoAI);
                  const esAltoRiesgo = tramite.nivelRiesgoAI === "ALTO_RIESGO_SOCIOAMBIENTAL";

                  return (
                    <tr
                      key={tramite.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        esAltoRiesgo ? "bg-red-50/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {tramite.codigo}
                          </span>
                          {esAltoRiesgo && (
                            <span className="inline-flex items-center text-red-600 font-bold" title="Prioridad Crítica">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-800 max-w-xs truncate" title={tramite.titulo}>
                          {tramite.titulo}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {obtenerEtiquetaTipoTramite(tramite.tipoTramite)}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 space-y-1">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{tramite.municipio}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {tramite.ciudadanoNombre}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="space-y-1 max-w-xs">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${riesgoInfo.badgeClass}`}
                          >
                            <BrainCircuit className="w-3 h-3" />
                            {riesgoInfo.label}
                          </span>
                          {tramite.scoreRiesgoAI > 0 && (
                            <div className="text-[10px] font-mono text-slate-500">
                              Score: {(tramite.scoreRiesgoAI * 100).toFixed(0)}% de impacto
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${estadoInfo.color}`}
                        >
                          {estadoInfo.label}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                        {formatearFecha(tramite.createdAt)}
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => abrirDictamen(tramite)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          Dictamen
                        </button>
                        <Link
                          href={`/trazabilidad/${tramite.codigo}`}
                          className="inline-flex items-center p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Ver Línea de Tiempo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DictamenModal
        isOpen={modalAbierto}
        tramite={tramiteSeleccionado}
        onClose={() => setModalAbierto(false)}
        onUpdated={handleActualizado}
      />
    </div>
  );
}
