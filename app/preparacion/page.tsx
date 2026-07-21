"use client";

import { useRouter } from "next/navigation";
import {
  Ban,
  Glasses,
  Scissors,
  Sun,
  CloudSun,
  Image as ImageIcon,
  Sparkles,
  Smile,
} from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";

const instructions = [
  { icon: Sparkles, text: "Retira maquillaje y filtros." },
  { icon: Glasses, text: "Retira gafas, sombreros y accesorios." },
  { icon: Scissors, text: "Recoge o aparta el cabello del rostro." },
  { icon: Sun, text: "Busca luz natural indirecta." },
  { icon: CloudSun, text: "Evita luz amarilla o sombras fuertes." },
  { icon: ImageIcon, text: "Utiliza un fondo neutro." },
  { icon: Ban, text: "Limpia la cámara frontal." },
  { icon: Smile, text: "Mantén una expresión neutral." },
];

export default function PreparacionPage() {
  const router = useRouter();
  const { consentGiven, noMakeupConfirmed, setConsent } = useAnalysisStore();

  const canContinue = consentGiven && noMakeupConfirmed;

  return (
    <PageShell>
      <h1 className="mb-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        Prepárate para tu selfie
      </h1>
      <p className="mb-6 text-ink-muted">
        Sigue estas recomendaciones para obtener el análisis más preciso posible.
      </p>

      <ul className="mb-8 grid gap-3 sm:grid-cols-2">
        {instructions.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white/60 p-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100 text-brand-700">
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-sm text-ink-soft">{text}</span>
          </li>
        ))}
      </ul>

      <div className="mb-8 flex flex-col gap-3">
        <Checkbox
          id="no-makeup"
          checked={noMakeupConfirmed}
          onChange={(checked) => setConsent(consentGiven, checked)}
        >
          Confirmo que no estoy utilizando maquillaje ni filtros.
        </Checkbox>
        <Checkbox
          id="consent"
          checked={consentGiven}
          onChange={(checked) => setConsent(checked, noMakeupConfirmed)}
        >
          Autorizo el procesamiento temporal de mi fotografía para generar el
          análisis. Entiendo que la imagen no será almacenada permanentemente
          salvo que lo autorice de manera separada.
        </Checkbox>
      </div>

      <Button
        disabled={!canContinue}
        onClick={() => router.push("/camara")}
        className="w-full sm:w-auto"
      >
        Abrir cámara
      </Button>
    </PageShell>
  );
}
