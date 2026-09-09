import React from "react";
import Link from "next/link";
import { TramiteForm } from "@/modules/tramites/components/TramiteForm";
import { ArrowLeft } from "lucide-react";

export default function NuevoTramitePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/tramites" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a mis trámites
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">Nueva Radicación</span>
      </div>

      <TramiteForm />
    </div>
  );
}
