"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CloudUpload } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import { saveAnalysis } from "@/lib/supabase/analyses";
import type { ClassificationResult } from "@/types/classification";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import type { ImageQualityResult } from "@/types/quality";
import type { SkinColorResult } from "@/types/color";

interface Props {
  classification: ClassificationResult;
  answers: QuestionnaireAnswers;
  quality: ImageQualityResult | null;
  skinColor: SkinColorResult | null;
  photoDataUrl: string | null;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function SaveToAccount({
  classification,
  answers,
  quality,
  skinColor,
  photoDataUrl,
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(isSupabaseConfigured);
  const [savePhoto, setSavePhoto] = useState(false);
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getCurrentUser()
      .then(setUser)
      .finally(() => setChecking(false));
  }, []);

  // Sin Supabase la app funciona completa en modo invitado: no tiene sentido
  // ofrecer un guardado que no existe.
  if (!isSupabaseConfigured || checking) return null;

  if (!user) {
    return (
      <section className="mb-8 rounded-2xl border border-line bg-white/60 p-4 text-sm text-espresso-soft">
        <p>
          Este análisis vive solo en este navegador y desaparecerá al cerrar la pestaña.{" "}
          <Link href="/cuenta" className="text-clay-dark underline underline-offset-4">
            Crea una cuenta
          </Link>{" "}
          si quieres conservarlo en tu historial.
        </p>
      </section>
    );
  }

  if (state === "saved") {
    return (
      <section className="mb-8 flex items-center gap-3 rounded-2xl border border-line bg-white/60 p-4">
        <Check size={20} className="shrink-0 text-emerald-600" aria-hidden="true" />
        <p className="text-sm text-espresso-soft" role="status">
          Guardado en tu cuenta.{" "}
          <Link href="/cuenta" className="text-clay-dark underline underline-offset-4">
            Ver mi historial
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8 rounded-2xl border border-line bg-white/60 p-4">
      <h2 className="mb-1 font-serif text-lg font-medium text-espresso">
        Guardar en mi cuenta
      </h2>
      <p className="mb-3 text-sm text-stone">
        Se guardará el resultado y tus respuestas. Nada se envía a un servidor si no
        pulsas este botón.
      </p>

      {/* Consentimiento separado para la imagen, tal y como declara la política. */}
      <label className="mb-4 flex cursor-pointer items-start gap-3 text-sm text-espresso-soft">
        <input
          type="checkbox"
          checked={savePhoto}
          onChange={(e) => setSavePhoto(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-clay"
        />
        Guardar también mi selfie (se sube a un almacenamiento privado y solo tú puedes
        verla)
      </label>

      <Button
        disabled={state === "saving"}
        onClick={async () => {
          if (!quality || !skinColor) {
            setState("error");
            setMessage("Faltan datos del análisis para guardarlo.");
            return;
          }
          setState("saving");
          setMessage(null);
          const result = await saveAnalysis({
            classification,
            answers,
            quality,
            skinColor,
            photoDataUrl,
            savePhoto,
          });
          if (result.ok) {
            setState("saved");
          } else {
            setState("error");
            setMessage(result.message);
          }
        }}
      >
        <CloudUpload size={18} strokeWidth={1.75} aria-hidden="true" />
        {state === "saving" ? "Guardando…" : "Guardar en mi cuenta"}
      </Button>

      {state === "error" && message && (
        <p className="mt-3 text-sm text-clay-dark" role="alert">
          {message}
        </p>
      )}
    </section>
  );
}
