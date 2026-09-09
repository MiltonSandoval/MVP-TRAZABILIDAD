"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { switchRoleAction } from "../actions/auth.actions";
import { UserSession } from "../types/auth.types";
import { User, Briefcase } from "lucide-react";

export function QuickRoleSelector({ currentUser }: { currentUser: UserSession | null }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSwitch = (rol: "CIUDADANO" | "FUNCIONARIO_TECNICO") => {
    startTransition(async () => {
      await switchRoleAction(rol);
      if (rol === "CIUDADANO") {
        router.push("/tramites");
      } else {
        router.push("/funcionario");
      }
    });
  };

  const currentRol = currentUser?.rol || "CIUDADANO";

  return (
    <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-lg p-1 text-xs">
      <span className="text-slate-500 hidden sm:inline px-2 font-medium">Modo Rol:</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleSwitch("CIUDADANO")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
          currentRol === "CIUDADANO"
            ? "bg-white text-emerald-800 shadow-sm font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <User className="w-3.5 h-3.5 text-emerald-600" />
        Ciudadano
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => handleSwitch("FUNCIONARIO_TECNICO")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
          currentRol === "FUNCIONARIO_TECNICO"
            ? "bg-slate-900 text-white shadow-sm font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
        Funcionario
      </button>
    </div>
  );
}
