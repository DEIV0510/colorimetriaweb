import { Camera, Palette, ShieldCheck, UserCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageShell } from "@/components/ui/PageShell";

const steps = [
  {
    icon: UserCheck,
    title: "Prepara tu rostro",
    description:
      "Retira maquillaje, filtros y accesorios. Busca luz natural e indirecta.",
  },
  {
    icon: Camera,
    title: "Toma tu selfie",
    description:
      "Usa la cámara frontal de tu celular. El análisis se procesa en tu propio dispositivo.",
  },
  {
    icon: Palette,
    title: "Recibe tu paleta",
    description:
      "Obtén una estimación de tu estación de color con recomendaciones prácticas.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <section className="flex flex-col items-center gap-6 pt-6 text-center sm:pt-12">
        <span className="rounded-full bg-clay-soft px-4 py-1.5 text-sm font-medium text-clay-dark">
          Colorimetría personal
        </span>
        <h1 className="max-w-lg text-balance font-serif text-4xl font-semibold leading-tight text-espresso sm:text-5xl">
          Descubre los colores que mejor armonizan contigo
        </h1>
        <p className="max-w-md text-pretty text-lg leading-relaxed text-stone">
          Tómate una selfie y responde unas preguntas rápidas. Analizamos tus
          tonos de piel, cabello y ojos para estimar tu paleta ideal.
        </p>
        <LinkButton href="/preparacion" className="mt-2">
          Comenzar mi análisis
        </LinkButton>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white/60 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory-soft text-clay-dark">
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-serif text-sm text-stone">
                Paso {index + 1}
              </span>
            </div>
            <h2 className="font-serif text-lg font-medium text-espresso">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-stone">
              {description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12 flex items-start gap-3 rounded-2xl border border-line bg-ivory-soft p-5">
        <ShieldCheck
          size={22}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0 text-clay-dark"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-espresso-soft">
          El resultado es una estimación orientativa y puede variar según la
          iluminación y la cámara.
        </p>
      </section>
    </PageShell>
  );
}
