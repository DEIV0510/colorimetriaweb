"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageShell>
        <p className="py-12 text-center text-ink-muted" role="status">
          Verificando acceso…
        </p>
      </PageShell>
    );
  }

  // La autorización REAL la aplica la función admin_stats() en la base de datos,
  // validando el correo contra la tabla `admins`. Esta comprobación solo evita
  // mostrar un panel vacío a quien todavía no ha iniciado sesión: una variable
  // NEXT_PUBLIC_* nunca sería una barrera de seguridad, porque viaja al cliente.
  if (!isSupabaseConfigured || !user) {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <ShieldAlert size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            Acceso restringido
          </h1>
          <p className="max-w-sm text-pretty text-ink-muted">
            {isSupabaseConfigured
              ? "Inicia sesión con una cuenta registrada como administradora."
              : "Esta instalación no tiene Supabase configurado, así que no hay métricas que mostrar."}
          </p>
          {isSupabaseConfigured && (
            <Link href="/cuenta" className="text-brand-700 underline underline-offset-4">
              Iniciar sesión
            </Link>
          )}
        </div>
      </PageShell>
    );
  }

  return <AdminDashboard />;
}
