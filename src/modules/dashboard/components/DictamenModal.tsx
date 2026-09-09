"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Alert } from "@/shared/components/ui/Alert";
import { Tramite, EstadoTramite } from "@/modules/tramites/types/tramite.types";
import { actualizarEstadoAction } from "@/modules/tramites/actions/actualizar-estado.action";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Compass,
  FileSearch,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface DictamenModalProps {
  tramite: Tramite | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function DictamenModal({
  tramite,
  isOpen,
  onClose,
  onUpdated,
}: DictamenModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoTramite>("EN_REVISION");
  const [observaciones, setObservaciones] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Configurar estado por defecto inteligente según el estado actual
  useEffect(() => {
    if (!tramite) return;

    if (tramite.estado === "INGRESADO") {
      setNuevoEstado("EN_REVISION");
      setObservaciones("Revisión documental iniciada. Cotejo de requisitos legales y planos.");
    } else if (tramite.estado === "EN_REVISION") {
      if (tramite.nivelRiesgoAI === "BAJO_RIESGO") {
        setNuevoEstado("APROBADO");
        setObservaciones("Resolución Favorable. Trámite de bajo impacto aprobado por despacho expedito.");
      } else {
        setNuevoEstado("EVALUACION_AMBIENTAL");
        setObservaciones(
          "Se deriva a Inspección Técnica de Campo in situ para evaluar posible afectación a cobertura vegetal o cuencas (Ley 1333)."
        );
      }
    } else if (tramite.estado === "EVALUACION_AMBIENTAL") {
      setNuevoEstado("APROBADO");
      setObservaciones("Inspección en terreno completada satisfactoriamente. Cumple con normas de mitigación.");
    } else if (tramite.estado === "OBSERVADO") {
      setNuevoEstado("EN_REVISION");
      setObservaciones("El ciudadano subsanó la documentación observada. Se reanuda la revisión técnica.");
    }
    setErrorMsg(null);
  }, [tramite]);

  if (!tramite) return null;

  const esAltoOMedioRiesgo =
    tramite.nivelRiesgoAI === "ALTO_RIESGO_SOCIOAMBIENTAL" ||
    tramite.nivelRiesgoAI === "MEDIO_RIESGO";

  // REGLA DE DOMINIO: Un trámite de alto o medio riesgo NO puede aprobarse directamente desde INGRESADO o EN_REVISION
  // Debe pasar obligatoriamente por Inspección de Campo (EVALUACION_AMBIENTAL)
  const aprobacionDirectaBloqueada =
    esAltoOMedioRiesgo &&
    (tramite.estado === "INGRESADO" || tramite.estado === "EN_REVISION");

  const seleccionarEstado = (estado: EstadoTramite, sugerenciaTexto: string) => {
    setNuevoEstado(estado);
    setObservaciones(sugerenciaTexto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Validación de regla de negocio
    if (nuevoEstado === "APROBADO" && aprobacionDirectaBloqueada) {
      setErrorMsg(
        "REGLA SOCIOAMBIENTAL (Ley 1333): Este expediente tiene riesgo crítico o moderado detectado por AI-DLC. No se puede aprobar sin pasar previamente por la fase de 'Inspección de Campo (Evaluación Ambiental)'."
      );
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("tramiteId", tramite.id);
    formData.append("nuevoEstado", nuevoEstado);
    formData.append("observaciones", observaciones);

    const res = await actualizarEstadoAction(formData);

    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Error al registrar el cambio de fase.");
      return;
    }

    onUpdated();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestión de Fase y Dictamen: ${tramite.codigo}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Stepper del Ciclo de Vida */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 truncate max-w-sm">{tramite.titulo}</span>
            <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Estado Actual: {tramite.estado}
            </span>
          </div>

          {/* Stepper visual */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
            <span className={tramite.estado === "INGRESADO" ? "font-bold text-emerald-700" : ""}>
              1. Ingresado
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300" />
            <span className={tramite.estado === "EN_REVISION" ? "font-bold text-emerald-700" : ""}>
              2. Revisión Doc.
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300" />
            <span
              className={tramite.estado === "EVALUACION_AMBIENTAL" ? "font-bold text-purple-700" : ""}
            >
              3. Insp. Campo
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300" />
            <span
              className={
                tramite.estado === "APROBADO" || tramite.estado === "RECHAZADO"
                  ? "font-bold text-emerald-700"
                  : ""
              }
            >
              4. Resolución
            </span>
          </div>

          {tramite.analisisAI?.recomendaciones && (
            <div className="p-2.5 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-lg text-xs space-y-0.5">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Guía Predictiva AI-DLC:
              </span>
              <p className="text-[11px] leading-relaxed">{tramite.analisisAI.recomendaciones}</p>
            </div>
          )}
        </div>

        {errorMsg && (
          <Alert variant="danger" title="Acción no permitida por normativa">
            {errorMsg}
          </Alert>
        )}

        {/* Bloque 1: Fases de Avance Operativo */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Fases Intermedias de Evaluación
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                seleccionarEstado(
                  "EN_REVISION",
                  "Revisión documental iniciada. Cotejo de requisitos legales y planos técnicos."
                )
              }
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                nuevoEstado === "EN_REVISION"
                  ? "bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileSearch className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Etapa 2: Revisión Documental</span>
                <span className="text-[11px] text-slate-500">
                  Cotejar carnet, personerías y planos en ventanilla.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                seleccionarEstado(
                  "EVALUACION_AMBIENTAL",
                  "Se agenda inspección técnica in situ en el predio para verificar posible afectación a cobertura vegetal y cuencas hídricas (Ley 1333)."
                )
              }
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                nuevoEstado === "EVALUACION_AMBIENTAL"
                  ? "bg-purple-50 border-purple-600 text-purple-900 shadow-sm ring-2 ring-purple-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Compass className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Etapa 3: Inspección en Campo</span>
                <span className="text-[11px] text-slate-500">
                  Perito ambiental evalúa terreno (Ley 1333 / Línea 289).
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bloque 2: Resoluciones y Observaciones */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Dictámenes y Resoluciones
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Botón Aprobar (con control de regla de dominio) */}
            <button
              type="button"
              onClick={() =>
                seleccionarEstado(
                  "APROBADO",
                  "Dictamen Técnico Favorable N° 2026/01. Proyecto apto para ejecución."
                )
              }
              disabled={aprobacionDirectaBloqueada}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                aprobacionDirectaBloqueada
                  ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                  : nuevoEstado === "APROBADO"
                  ? "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm ring-2 ring-emerald-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {aprobacionDirectaBloqueada ? (
                <Lock className="w-5 h-5 text-slate-400 mb-1" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
              )}
              <span className="font-bold">Aprobar Trámite</span>
              <span className="text-[10px] text-center text-slate-500 mt-0.5">
                {aprobacionDirectaBloqueada ? "Requiere Insp. Campo" : "Resolución Favorable"}
              </span>
            </button>

            {/* Observar */}
            <button
              type="button"
              onClick={() =>
                seleccionarEstado(
                  "OBSERVADO",
                  "Se observan discrepancias en el plano y falta de mitigación de olores. Plazo de 5 días hábiles para subsanar."
                )
              }
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                nuevoEstado === "OBSERVADO"
                  ? "bg-amber-50 border-amber-600 text-amber-900 shadow-sm ring-2 ring-amber-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 mb-1" />
              <span className="font-bold">Observar Trámite</span>
              <span className="text-[10px] text-center text-slate-500 mt-0.5">
                Pausar y exigir subsanación
              </span>
            </button>

            {/* Rechazar */}
            <button
              type="button"
              onClick={() =>
                seleccionarEstado(
                  "RECHAZADO",
                  "Dictamen Negativo. La actividad propuesta vulnera la servidumbre ecológica y contraviene la Ley N° 1333."
                )
              }
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                nuevoEstado === "RECHAZADO"
                  ? "bg-rose-50 border-rose-600 text-rose-900 shadow-sm ring-2 ring-rose-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <XCircle className="w-5 h-5 text-rose-600 mb-1" />
              <span className="font-bold">Rechazar Solicitud</span>
              <span className="text-[10px] text-center text-slate-500 mt-0.5">
                Dictamen desfavorable
              </span>
            </button>
          </div>
        </div>

        {/* Campo de Fundamentación */}
        <div>
          <label htmlFor="fundamentacion" className="block text-xs font-bold text-slate-700 mb-1">
            Fundamentación Técnica y Registro de Auditoría <span className="text-red-500">*</span>
          </label>
          <textarea
            id="fundamentacion"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            required
            className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <FileText className="w-4 h-4 mr-1.5" />
            Registrar Hito en Línea de Tiempo
          </Button>
        </div>
      </form>
    </Modal>
  );
}
