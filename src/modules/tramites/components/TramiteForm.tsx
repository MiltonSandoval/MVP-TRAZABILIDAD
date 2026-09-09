"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Alert } from "@/shared/components/ui/Alert";
import { crearTramiteAction } from "../actions/crear-tramite.action";
import { TipoTramite } from "../types/tramite.types";
import { UploadCloud, CheckCircle2, AlertTriangle, Sparkles, FileText } from "lucide-react";

export function TramiteForm() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoTramite, setTipoTramite] = useState<TipoTramite>("LICENCIA_AMBIENTAL_MUNICIPAL");
  const [municipio, setMunicipio] = useState("Santa Cruz de la Sierra");
  const [ubicacionDetalle, setUbicacionDetalle] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [simularFallaAI, setSimularFallaAI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exitoInfo, setExitoInfo] = useState<{ codigo: string; id: string } | null>(null);

  // Escenarios de prueba precargados para evaluación de HU-02 y HU-04
  const cargarCasoPrueba = (caso: "ALTO" | "BAJO") => {
    if (caso === "ALTO") {
      setTitulo("Autorización de Desmonte Periurbano en Serranía de Chiquitos");
      setDescripcion(
        "Se solicita habilitar desmonte mecanizado y quema controlada en 25 hectáreas adyacentes a un curichi y cuenca de recarga hídrica en Roboré. Se acompaña memoria de maquinaria."
      );
      setTipoTramite("AUTORIZACION_DESMONTE_CONTROLADO");
      setMunicipio("Roboré");
      setUbicacionDetalle("Comunidad Santiago de Chiquitos, Zona Serranía");
      setNombreArchivo("Memoria_Tecnica_Desmonte_Robore.pdf");
      setSimularFallaAI(false);
    } else {
      setTitulo("Instalación de Vivero Municipal de Especies Nativas");
      setDescripcion(
        "Habilitación de predio urbano para reproducción de plantines nativos (Tajibos, Toborochi, Cuchi) con fines de reforestación y arborización comunitaria."
      );
      setTipoTramite("LICENCIA_AMBIENTAL_MUNICIPAL");
      setMunicipio("San Ignacio de Velasco");
      setUbicacionDetalle("Barrio El Carmen, Distrito 1");
      setNombreArchivo("Plan_Reforestacion_Vivero.pdf");
      setSimularFallaAI(false);
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("tipoTramite", tipoTramite);
    formData.append("municipio", municipio);
    formData.append("ubicacionDetalle", ubicacionDetalle);
    if (nombreArchivo) formData.append("nombreArchivo", nombreArchivo);
    if (simularFallaAI) formData.append("simularFallaAI", "true");

    const res = await crearTramiteAction(formData);

    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Error al radicar trámite.");
      return;
    }

    if (res.codigo && res.tramiteId) {
      setExitoInfo({ codigo: res.codigo, id: res.tramiteId });
    }
  };

  if (exitoInfo) {
    return (
      <Card className="max-w-2xl mx-auto border-emerald-300 shadow-lg">
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">¡Trámite Radicado con Éxito!</h3>
            <p className="text-sm text-slate-600">
              Su solicitud fue procesada, validada por el motor **AI-DLC** y registrada en la bitácora
              inmutable del municipio.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Código Único de Trazabilidad
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-800 tracking-wider">
              {exitoInfo.codigo}
            </div>
            <p className="text-xs text-slate-500">
              Guarde este código para dar seguimiento en línea o compartirlo con el funcionario.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => router.push(`/trazabilidad/${exitoInfo.codigo}`)}
            >
              Ver Línea de Tiempo en Vivo
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setExitoInfo(null);
                setTitulo("");
                setDescripcion("");
                setUbicacionDetalle("");
                setNombreArchivo("");
              }}
            >
              Radicar Otro Trámite
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl text-slate-900">
              Radicación de Trámite Socioambiental
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulario oficial con análisis predictivo AI-DLC • Municipios del Oriente Boliviano
            </p>
          </div>

          {/* Botones de precarga rápida */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-400 text-[11px] px-2 font-medium">Ejemplos:</span>
            <button
              type="button"
              onClick={() => cargarCasoPrueba("ALTO")}
              className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded font-medium transition-colors"
            >
              Caso Alto Riesgo
            </button>
            <button
              type="button"
              onClick={() => cargarCasoPrueba("BAJO")}
              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-medium transition-colors"
            >
              Caso Bajo Riesgo
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {errorMsg && (
          <Alert variant="danger" title="Verifique la información ingresada">
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Título de la Solicitud / Proyecto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ej: Licencia Ambiental para Actividad Agropecuaria Periurbana"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipoTramite" className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de Trámite Socioambiental <span className="text-red-500">*</span>
              </label>
              <select
                id="tipoTramite"
                value={tipoTramite}
                onChange={(e) => setTipoTramite(e.target.value as TipoTramite)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
              >
                <option value="LICENCIA_AMBIENTAL_MUNICIPAL">
                  Licencia Ambiental Municipal (Cat. 3/4)
                </option>
                <option value="AUTORIZACION_DESMONTE_CONTROLADO">
                  Autorización de Desmonte Periurbano
                </option>
                <option value="CAMBIO_USO_SUELO">Permiso de Cambio de Uso de Suelo</option>
                <option value="INSPECCION_CUENCA_HIDRICA">
                  Inspección Técnica de Cuenca Hídrica
                </option>
                <option value="DENUNCIA_CONTAMINACION_CHAQUEO">
                  Denuncia por Quema o Chaqueo Ilegal
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="municipio" className="block text-sm font-medium text-slate-700 mb-1">
                Municipio del Oriente Boliviano <span className="text-red-500">*</span>
              </label>
              <select
                id="municipio"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
              >
                <option value="Santa Cruz de la Sierra">Santa Cruz de la Sierra</option>
                <option value="Roboré">Roboré (Serranía Chiquitana)</option>
                <option value="San Ignacio de Velasco">San Ignacio de Velasco</option>
                <option value="Puerto Suárez">Puerto Suárez (Pantanal)</option>
                <option value="San José de Chiquitos">San José de Chiquitos</option>
                <option value="Montero">Montero (Norte Integrado)</option>
              </select>
            </div>
          </div>

          <Input
            label="Ubicación Detallada / Coordenadas de Referencia"
            value={ubicacionDetalle}
            onChange={(e) => setUbicacionDetalle(e.target.value)}
            required
            placeholder="Ej: Km 12 carretera a Cotoca, Manzana 14, frente al curichi"
          />

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">
              Memoria Técnica Descriptiva <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 placeholder:text-slate-400"
              placeholder="Describa las actividades previstas, maquinaria a emplear, presencia de vegetación, fuentes de agua cercanas y manejo ambiental..."
            />
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              El motor AI-DLC analizará este texto para identificar riesgos a cuencas y reservas.
            </p>
          </div>

          {/* Subida simulada de Requisito Digital (Supabase Storage) */}
          <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Documentación Técnica Digitalizada (PDF / Memoria)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 flex-1 w-full">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Nombre de archivo (ej. Plan_Ambiental.pdf)"
                  value={nombreArchivo}
                  onChange={(e) => setNombreArchivo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setNombreArchivo("Expediente_Tecnico_Socioambiental_2026.pdf")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                Adjuntar Documento de Prueba
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Formatos aceptados: PDF, JPG, PNG (hasta 10 MB). Almacenamiento seguro en Supabase Storage.
            </p>
          </div>

          {/* Opciones de contingencia AI para testing (HU-04) */}
          <div className="flex items-center gap-2 p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900">
            <input
              type="checkbox"
              id="simularFalla"
              checked={simularFallaAI}
              onChange={(e) => setSimularFallaAI(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <label htmlFor="simularFalla" className="cursor-pointer font-medium">
              Simular falla del servicio de IA (Prueba el fallback a PENDIENTE_CLASIFICACION_MANUAL)
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/tramites")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
              Radicar Trámite y Ejecutar AI-DLC
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
