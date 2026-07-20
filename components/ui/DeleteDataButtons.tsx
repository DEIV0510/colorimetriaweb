"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/auth";

export function DeleteDataButtons() {
  const resetPhoto = useAnalysisStore((s) => s.resetPhoto);
  const resetAll = useAnalysisStore((s) => s.resetAll);
  const [message, setMessage] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="secondary"
        onClick={() => {
          resetPhoto();
          setMessage("Se eliminó la selfie temporal y el análisis actual.");
        }}
      >
        <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
        Eliminar selfie y análisis actual
      </Button>
      <Button
        variant="secondary"
        disabled={working}
        onClick={async () => {
          setWorking(true);
          resetAll();
          // Supabase guarda el token de sesión (con el correo) en localStorage,
          // no en sessionStorage: sin cerrar sesión, prometer que "se eliminaron
          // todos los datos" sería falso y dejaría la cuenta abierta.
          if (isSupabaseConfigured) await signOut();
          setWorking(false);
          setMessage(
            isSupabaseConfigured
              ? "Se eliminaron los datos del análisis y se cerró tu sesión en este navegador."
              : "Se eliminaron todos los datos del análisis guardados en este navegador."
          );
        }}
      >
        <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
        {working ? "Eliminando…" : "Eliminar todos mis datos de este navegador"}
      </Button>
      {message && (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
