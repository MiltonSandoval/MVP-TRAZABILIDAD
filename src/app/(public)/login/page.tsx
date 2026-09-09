import React from "react";
import Link from "next/link";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { TreePine, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la portada
        </Link>
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <TreePine className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Gobierno Autónomo Municipal
        </h2>
        <p className="text-xs text-slate-600">
          Sistema de Trazabilidad y Decisión Socioambiental • Oriente Boliviano
        </p>
      </div>

      <div className="px-4 sm:px-0">
        <LoginForm />
      </div>
    </div>
  );
}
