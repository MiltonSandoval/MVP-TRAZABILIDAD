"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Alert } from "@/shared/components/ui/Alert";
import { loginAction } from "../actions/auth.actions";
import { ShieldCheck, User, Briefcase, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("ciudadano@santacruz.gob.bo");
  const [password, setPassword] = useState("123456");
  const [rolSimulado, setRolSimulado] = useState<"CIUDADANO" | "FUNCIONARIO_TECNICO">("CIUDADANO");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("rolSimulado", rolSimulado);

      const response = await loginAction(formData);

      if (!response.success) {
        setErrorMsg(response.message || "Credenciales inválidas.");
        setIsLoading(false);
        return;
      }

      if (response.redirectTo) {
        router.push(response.redirectTo);
      }
    } catch {
      setErrorMsg("Error inesperado al intentar iniciar sesión.");
      setIsLoading(false);
    }
  };

  const seleccionarRolRapido = (rol: "CIUDADANO" | "FUNCIONARIO_TECNICO") => {
    setRolSimulado(rol);
    if (rol === "CIUDADANO") {
      setEmail("ciudadano@santacruz.gob.bo");
      setPassword("123456");
    } else {
      setEmail("tecnico@santacruz.gob.bo");
      setPassword("123456");
    }
    setErrorMsg(null);
  };

  return (
    <Card className="max-w-md w-full mx-auto border-slate-200/80 shadow-md">
      <CardHeader className="text-center pb-2 bg-gradient-to-b from-emerald-50/50 to-transparent">
        <div className="mx-auto w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-sm mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl text-slate-900">Acceso Seguro al Sistema</CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Gobierno Autónomo Municipal • Oriente Boliviano
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Selector rápido de rol para evaluación ágil */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            Perfiles de prueba para evaluación (DoD):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => seleccionarRolRapido("CIUDADANO")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                rolSimulado === "CIUDADANO"
                  ? "bg-white border-emerald-600 text-emerald-800 shadow-sm ring-1 ring-emerald-500"
                  : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Ciudadano
            </button>
            <button
              type="button"
              onClick={() => seleccionarRolRapido("FUNCIONARIO_TECNICO")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                rolSimulado === "FUNCIONARIO_TECNICO"
                  ? "bg-white border-slate-800 text-slate-900 shadow-sm ring-1 ring-slate-800"
                  : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-700" />
              Funcionario Técnico
            </button>
          </div>
        </div>

        {errorMsg && (
          <Alert variant="danger" title="Error de autenticación">
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo Institucional o Ciudadano"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ejemplo@santacruz.gob.bo"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            <Lock className="w-4 h-4 mr-2" />
            Iniciar Sesión como {rolSimulado === "CIUDADANO" ? "Ciudadano" : "Funcionario"}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          Protegido con políticas de seguridad RLS en PostgreSQL (Supabase)
        </div>
      </CardContent>
    </Card>
  );
}
