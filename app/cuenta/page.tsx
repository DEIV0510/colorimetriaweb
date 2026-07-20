"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Trash2, UserPlus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser, resetPassword, signIn, signOut, signUp } from "@/lib/supabase/auth";
import {
  deleteAllMyAnalyses,
  listMyAnalyses,
  type StoredAnalysis,
} from "@/lib/supabase/analyses";
import { SEASONS } from "@/data/seasons";
import type { SeasonId } from "@/types/classification";

type Mode = "login" | "signup" | "reset";

interface AccountData {
  user: User | null;
  analyses: StoredAnalysis[];
}

async function loadAccount(): Promise<AccountData> {
  const user = await getCurrentUser();
  return { user, analyses: user ? await listMyAnalyses() : [] };
}

export default function CuentaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);

  const applyAccount = useCallback((data: AccountData) => {
    setUser(data.user);
    setAnalyses(data.analyses);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    loadAccount().then(applyAccount);
  }, [applyAccount]);

  if (!isSupabaseConfigured) {
    return (
      <PageShell>
        <h1 className="mb-3 font-serif text-2xl font-semibold text-espresso">Cuenta</h1>
        <p className="mb-6 text-stone">
          Las cuentas todavía no están habilitadas en esta instalación. Puedes usar la
          aplicación completa como invitado.
        </p>
        <Link href="/preparacion" className="text-clay-dark underline underline-offset-4">
          Comenzar mi análisis como invitado
        </Link>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <p className="py-12 text-center text-stone">Cargando…</p>
      </PageShell>
    );
  }

  if (user) {
    return (
      <PageShell>
        <h1 className="mb-1 font-serif text-2xl font-semibold text-espresso">Mi cuenta</h1>
        <p className="mb-6 text-sm text-stone">{user.email}</p>

        <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
          Historial de análisis
        </h2>
        {analyses.length === 0 ? (
          <p className="mb-6 rounded-2xl border border-line bg-white/60 p-4 text-sm text-stone">
            Todavía no has guardado ningún análisis.
          </p>
        ) : (
          <ul className="mb-6 flex flex-col gap-2">
            {analyses.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-2xl border border-line bg-white/60 p-4"
              >
                <div>
                  <p className="font-medium text-espresso">
                    {SEASONS[a.season as SeasonId]?.name ?? a.season}
                  </p>
                  <p className="text-xs text-stone">
                    {new Date(a.created_at).toLocaleDateString("es-CO")} · confianza{" "}
                    {Math.round((a.confidence ?? 0) * 100)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="secondary"
            onClick={async () => {
              await deleteAllMyAnalyses();
              setAnalyses([]);
              setFeedback("Se eliminó todo tu historial.");
            }}
          >
            <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
            Eliminar todo mi historial
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await signOut();
              applyAccount(await loadAccount());
            }}
          >
            <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            Cerrar sesión
          </Button>
        </div>
        {feedback && (
          <p className="mt-4 text-sm text-emerald-700" role="status">
            {feedback}
          </p>
        )}
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 className="mb-2 font-serif text-2xl font-semibold text-espresso">
        {mode === "signup" ? "Crear cuenta" : mode === "reset" ? "Recuperar contraseña" : "Iniciar sesión"}
      </h1>
      <p className="mb-6 text-sm text-stone">
        Crear una cuenta es opcional: sirve para guardar tu historial de análisis.
      </p>

      <form
        className="mb-6 flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setFeedback(null);
          if (mode === "signup") {
            const { error } = await signUp(email, password, name || undefined);
            setFeedback(error ?? "Revisa tu correo para confirmar la cuenta.");
          } else if (mode === "reset") {
            const { error } = await resetPassword(email);
            setFeedback(error ?? "Te enviamos un correo para restablecer la contraseña.");
          } else {
            const { error } = await signIn(email, password);
            if (error) setFeedback(error);
            else applyAccount(await loadAccount());
          }
        }}
      >
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-espresso-soft">
              Nombre (opcional)
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-12 w-full rounded-xl border border-border-interactive bg-ivory px-3 text-base outline-none focus:border-clay"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-espresso-soft">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 w-full rounded-xl border border-border-interactive bg-ivory px-3 text-base outline-none focus:border-clay"
          />
        </div>
        {mode !== "reset" && (
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-espresso-soft">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-12 w-full rounded-xl border border-border-interactive bg-ivory px-3 text-base outline-none focus:border-clay"
            />
          </div>
        )}
        <Button type="submit">
          <UserPlus size={18} strokeWidth={1.75} aria-hidden="true" />
          {mode === "signup" ? "Crear cuenta" : mode === "reset" ? "Enviar enlace" : "Entrar"}
        </Button>
      </form>

      {feedback && (
        <p className="mb-4 text-sm text-espresso-soft" role="status">
          {feedback}
        </p>
      )}

      <div className="flex flex-col gap-2 text-sm">
        {mode !== "login" && (
          <button type="button" onClick={() => setMode("login")} className="text-clay-dark underline underline-offset-4">
            Ya tengo cuenta
          </button>
        )}
        {mode !== "signup" && (
          <button type="button" onClick={() => setMode("signup")} className="text-clay-dark underline underline-offset-4">
            Crear una cuenta nueva
          </button>
        )}
        {mode !== "reset" && (
          <button type="button" onClick={() => setMode("reset")} className="text-clay-dark underline underline-offset-4">
            Olvidé mi contraseña
          </button>
        )}
        <Link href="/preparacion" className="text-stone underline underline-offset-4">
          Continuar como invitado
        </Link>
      </div>
    </PageShell>
  );
}
