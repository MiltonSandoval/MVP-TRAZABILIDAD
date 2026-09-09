import React from "react";
import Link from "next/link";
import { AuthService } from "@/modules/auth/services/auth.service";
import { QuickRoleSelector } from "@/modules/auth/components/QuickRoleSelector";
import { TreePine, PlusCircle, Inbox, FileText, Search, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await AuthService.getCurrentSession();
  const esFuncionario = currentUser?.rol === "FUNCIONARIO_TECNICO";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <TreePine className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 tracking-tight block">
                    GAM Oriente Boliviano
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    AI-DLC Trazabilidad
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600">
                <Link
                  href="/tramites"
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Mis Trámites
                </Link>

                <Link
                  href="/tramites/nuevo"
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Radicar Trámite
                </Link>

                <Link
                  href="/funcionario"
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Inbox className="w-4 h-4 text-amber-600" />
                  Bandeja Municipal
                </Link>

                <Link
                  href="/trazabilidad/TRAM-SCZ-2026-000102"
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-slate-500"
                >
                  <Search className="w-3.5 h-3.5" />
                  Auditoría Pública
                </Link>
              </nav>
            </div>

            {/* Profile & Switcher */}
            <div className="flex items-center gap-3">
              <QuickRoleSelector currentUser={currentUser} />

              <div className="hidden sm:flex flex-col text-right text-xs">
                <span className="font-semibold text-slate-800">{currentUser?.nombre}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currentUser?.rol === "FUNCIONARIO_TECNICO"
                    ? "Técnico Evaluador"
                    : "Ciudadano Solicitante"}
                </span>
              </div>

              <Link
                href="/login"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Cerrar Sesión / Cambiar Usuario"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/80 px-2 py-1.5 text-xs">
          <Link
            href="/tramites"
            className="p-2 text-slate-700 font-medium flex items-center gap-1"
          >
            <FileText className="w-4 h-4" />
            <span>Trámites</span>
          </Link>
          <Link
            href="/tramites/nuevo"
            className="p-2 text-emerald-700 font-semibold flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Radicar</span>
          </Link>
          <Link
            href="/funcionario"
            className="p-2 text-amber-800 font-medium flex items-center gap-1"
          >
            <Inbox className="w-4 h-4" />
            <span>Bandeja</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
