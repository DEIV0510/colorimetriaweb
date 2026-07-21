import { Camera, Palette, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageShell } from "@/components/ui/PageShell";

const steps = [
  {
    icon: UserCheck,
    title: "Prepara tu rostro",
    description:
      "Sin maquillaje ni filtros, con luz natural indirecta y el cabello despejado.",
  },
  {
    icon: Camera,
    title: "Toma tu selfie",
    description:
      "Con la cámara frontal de tu celular. Todo se procesa dentro de tu dispositivo.",
  },
  {
    icon: Palette,
    title: "Recibe tu paleta",
    description:
      "Tu estación de color con 16 tonos, neutros, metales y qué evitar cerca del rostro.",
  },
];

// Muestra decorativa del hero: son colores reales del catálogo de estaciones.
const heroSwatches = [
  "#D6207E",
  "#B5179E",
  "#F663B0",
  "#C79F6E",
  "#8C9A6E",
  "#7A2E1E",
  "#0B3D91",
  "#FFD9B3",
];

export default function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative -mx-5 overflow-hidden bg-blush-radial px-5 pb-14 pt-10 text-center sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full bg-brand-200/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full bg-brand-300/30 blur-3xl"
        />

        <div className="relative">
          <span className="label-brand">Colorimetría personal</span>

          <h1 className="mx-auto mt-5 max-w-lg text-balance font-serif text-[2.6rem] font-light leading-[1.08] text-ink sm:text-6xl">
            Descubre los colores que{" "}
            <em className="gradient-text font-medium not-italic">armonizan</em> contigo
          </h1>

          <p className="mx-auto mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-ink-soft">
            Una selfie y seis preguntas. Analizamos el tono real de tu piel para estimar
            tu estación de color y la paleta que te favorece.
          </p>

          <div
            aria-hidden="true"
            className="mt-8 flex items-center justify-center gap-1.5"
          >
            {heroSwatches.map((color, i) => (
              <span
                key={color}
                className="h-11 w-11 animate-swatch-in rounded-full shadow-soft ring-2 ring-white/70"
                style={{ backgroundColor: color, animationDelay: `${i * 0.07}s` }}
              />
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center gap-3">
            <LinkButton href="/preparacion" className="px-10">
              <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" />
              Comenzar mi análisis
            </LinkButton>
            <span className="text-xs text-ink-muted">
              Gratis · sin registro · dura 2 minutos
            </span>
          </div>
        </div>
      </section>

      <div className="hairline my-2" aria-hidden="true" />

      {/* PASOS */}
      <section className="reveal mt-12">
        <div className="mb-7 text-center">
          <span className="label-brand">Cómo funciona</span>
          <h2 className="mt-2 font-serif text-3xl font-light text-ink">
            Tres pasos, dos minutos
          </h2>
        </div>

        <ol className="flex flex-col gap-4">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative flex items-start gap-4 overflow-hidden rounded-[1.75rem] border border-line bg-white p-5 shadow-card transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {/* Franja de acento, como las tarjetas de módulo de la academia */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-brand-gradient"
              />
              <span className="ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <span className="label-brand text-[10px]">Paso {index + 1}</span>
                <h3 className="mt-1 font-serif text-xl font-medium text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* AVISO */}
      <section className="reveal mt-12 flex items-start gap-3 rounded-[1.75rem] border border-brand-200 bg-brand-100/60 p-5">
        <ShieldCheck
          size={22}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0 text-brand-700"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-ink">Tu foto no sale de tu celular</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            El análisis se ejecuta dentro de tu navegador. El resultado es una estimación
            orientativa y puede variar según la iluminación y la cámara.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
