"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ChevronDown,
  Download,
  Gem,
  Palette,
  RotateCcw,
  Shirt,
  Smile,
  Sparkles,
  Trash2,
} from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TabBar, TabPanel, type TabItem } from "@/components/ui/Tabs";
import { ColorSwatchGrid } from "@/components/results/ColorSwatchGrid";
import { NamedSwatchGrid } from "@/components/results/NamedSwatchGrid";
import { OutfitCard } from "@/components/results/OutfitCard";
import { SaveToAccount } from "@/components/results/SaveToAccount";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { useHasHydrated } from "@/lib/store/use-hydrated";
import { useTabHash } from "@/lib/hooks/use-tab-hash";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SEASONS } from "@/data/seasons";
import { generateReportPdf } from "@/lib/report/generate-pdf";
import { buildStyleGuide } from "@/lib/style/build-style-guide";
import { formatMetal, COMPATIBILITY_LABELS } from "@/lib/style/harmony";
import { faceAvoidAdvice } from "@/lib/style/face-colors";

const FEATURE_LABELS = {
  temperature: { calida: "Cálida", fria: "Fría", neutral: "Neutral", oliva: "Oliva" },
  depth: { clara: "Clara", media: "Media", profunda: "Profunda" },
  intensity: { brillante: "Brillante", media: "Media", suave: "Suave" },
  contrast: { bajo: "Bajo", medio: "Medio", alto: "Alto" },
};

const TABS = [
  { id: "resultado", label: "Tu resultado", icon: Sparkles },
  { id: "paleta", label: "Tu paleta", icon: Palette },
  { id: "outfits", label: "Tus outfits", icon: Shirt },
  { id: "joyas", label: "Joyas", icon: Gem },
  { id: "rostro", label: "Cerca del rostro", icon: Smile },
  { id: "informe", label: "Informe", icon: Download },
] as const satisfies readonly TabItem[];

const TAB_IDS = TABS.map((t) => t.id);
type TabId = (typeof TABS)[number]["id"];

export default function ResultadoPage() {
  const router = useRouter();
  const classification = useAnalysisStore((s) => s.classification);
  const photoDataUrl = useAnalysisStore((s) => s.photoDataUrl);
  const photoQuality = useAnalysisStore((s) => s.photoQuality);
  const skinColor = useAnalysisStore((s) => s.skinColor);
  const answers = useAnalysisStore((s) => s.answers);
  const preferences = useAnalysisStore((s) => s.preferences);
  const resetAll = useAnalysisStore((s) => s.resetAll);

  const hydrated = useHasHydrated();
  const { activeTab, setTab } = useTabHash<TabId>(TAB_IDS, "resultado");
  const [showDetails, setShowDetails] = useState(false);
  const [includeSelfie, setIncludeSelfie] = useState(false);
  const [userName, setUserName] = useState("");

  // Al limpiar el store antes de navegar, el guard se re-ejecutaba con
  // classification ya en null y su replace("/") pisaba al push.
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (hydrated && !classification && !navigatingRef.current) router.replace("/");
  }, [hydrated, classification, router]);

  const leaveTo = (path: string) => {
    navigatingRef.current = true;
    router.push(path);
    resetAll();
  };

  // La guía es determinista, así que memoizarla solo evita recalcular al
  // cambiar de pestaña; el resultado sería idéntico.
  const guide = useMemo(
    () => (classification ? buildStyleGuide(classification, preferences) : null),
    [classification, preferences]
  );

  if (!hydrated) return <LoadingScreen />;
  if (!classification || !guide) return null;

  const season = SEASONS[classification.primary.seasonId];
  const secondary = SEASONS[classification.secondary.seasonId];
  const confidencePct = Math.round(classification.confidence * 100);

  const features = [
    { label: "Temperatura", value: FEATURE_LABELS.temperature[classification.features.temperature] },
    { label: "Profundidad", value: FEATURE_LABELS.depth[classification.features.depth] },
    { label: "Intensidad", value: FEATURE_LABELS.intensity[classification.features.intensity] },
    { label: "Contraste", value: FEATURE_LABELS.contrast[classification.features.contrast] },
  ];

  const allWarnings = [...classification.warnings, ...(photoQuality?.warnings ?? [])];

  return (
    <PageShell>
      {/* PORTADA — fuera de las pestañas: es el ancla de la pantalla */}
      <section className="relative -mx-5 mb-6 overflow-hidden px-5 pb-8 pt-10 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex h-32 opacity-30 blur-2xl"
        >
          {season.palette.slice(0, 8).map((c) => (
            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="relative">
          <span className="label-brand">Tu resultado probable</span>
          <h1 className="mx-auto mb-4 mt-3 max-w-md text-balance font-serif text-[2.75rem] font-light leading-[1.05] text-ink sm:text-5xl">
            {season.name}
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white shadow-glow">
            Confianza estimada · {confidencePct}%
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Segunda estación más cercana:{" "}
            <strong className="font-medium text-brand-700">{secondary.name}</strong>
          </p>
        </div>
      </section>

      {/* ADVERTENCIAS — nunca dentro de una pestaña: califican la fiabilidad */}
      {allWarnings.length > 0 && (
        <Card tone="blush" className="mb-5 flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
          <ul className="flex flex-col gap-1 text-sm text-ink-soft">
            {allWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="sticky top-[68px] z-30 -mx-5 mb-6 border-b border-line/70 bg-blush/90 px-5 py-2 backdrop-blur-md">
        <TabBar
          items={TABS as unknown as TabItem[]}
          activeId={activeTab}
          onChange={(id) => setTab(id as TabId)}
          label="Secciones de tu resultado"
        />
      </div>

      {/* 1 · TU RESULTADO */}
      <TabPanel id="resultado" activeId={activeTab}>
        <section className="mb-8">
          <span className="label-brand">Por qué este resultado</span>
          <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{guide.personalWhy}</p>
        </section>

        <section className="mb-8 grid grid-cols-2 gap-3">
          {features.map((f) => (
            <Card key={f.label} accent="top">
              <p className="label-brand text-[9px]">{f.label}</p>
              <p className="mt-1.5 font-serif text-2xl font-light text-ink">{f.value}</p>
            </Card>
          ))}
        </section>

        <section className="mb-8">
          <span className="label-brand">Cómo llevarlo</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">Recomendaciones</h2>
          <ul className="flex flex-col gap-3">
            {season.recommendations.map((rec, i) => (
              <li key={rec}>
                <Card accent="left" className="pl-5">
                  <span className="mb-1 block font-serif text-lg text-brand-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{rec}</span>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <Card tone="brand" className="mb-8 p-6 text-center">
          <span className="font-script text-3xl text-white/95">Alma e Imagen</span>
          <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed text-white/90">
            Tu paleta hace parte de <strong className="font-medium">Mi Reflejo</strong>, la ruta
            de imagen personal de The Academy. Leidy Sepúlveda te acompaña en el proceso
            completo: sanación emocional, amor propio e imagen.
          </p>
        </Card>
      </TabPanel>

      {/* 2 · TU PALETA */}
      <TabPanel id="paleta" activeId={activeTab}>
        <section className="mb-8">
          <span className="label-brand">Para lucir cerca del rostro</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">Tu paleta principal</h2>
          <NamedSwatchGrid colors={guide.faceColors.highlyRecommended} columns={3} />
        </section>

        <section className="mb-8">
          <span className="label-brand">También te funcionan</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">Compatibles</h2>
          <NamedSwatchGrid colors={guide.faceColors.compatible} columns={3} />
        </section>

        <section className="mb-8">
          <span className="label-brand">Base de tu clóset</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">Neutros</h2>
          <ColorSwatchGrid colors={season.neutrals} columns={6} />
        </section>

        <section className="mb-8">
          <span className="label-brand">Combinaciones exactas</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
            Cómo combinarlos
          </h2>
          <ul className="flex flex-col gap-3">
            {guide.combinations.map((combo, i) => (
              <li key={`${combo.colors.map((c) => c.hex).join("-")}-${i}`}>
                <Card>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="flex gap-1.5">
                      {combo.colors.map((c) => (
                        <span
                          key={c.hex}
                          className="h-9 w-9 rounded-xl ring-1 ring-inset ring-black/10"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </span>
                    <Badge tone={combo.compatibility === "ideal" ? "brand" : "neutral"}>
                      {COMPATIBILITY_LABELS[combo.compatibility]}
                    </Badge>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {combo.whereToUse}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {combo.explanation}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </TabPanel>

      {/* 3 · TUS OUTFITS */}
      <TabPanel id="outfits" activeId={activeTab}>
        <section className="mb-4">
          <span className="label-brand">Conjuntos para ti</span>
          <h2 className="mb-2 mt-2 font-serif text-2xl font-light text-ink">
            Combinaciones de ropa
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Cada conjunto usa únicamente colores de tu paleta. Las ilustraciones son
            orientativas: muestran los colores y la estructura, no prendas concretas.
          </p>
        </section>

        <ul className="flex flex-col gap-5">
          {guide.outfits.map((outfit) => (
            <li key={outfit.id}>
              <OutfitCard outfit={outfit} />
            </li>
          ))}
        </ul>
      </TabPanel>

      {/* 4 · JOYAS */}
      <TabPanel id="joyas" activeId={activeTab}>
        <section className="mb-6">
          <span className="label-brand">Joyería</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
            Metales que armonizan contigo
          </h2>

          <Card tone="blush" className="mb-4">
            <p className="font-serif text-2xl text-ink">
              {formatMetal(guide.jewelry.primary, guide.jewelry.finish)}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Metal secundario compatible: {guide.jewelry.secondary.toLowerCase()}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {guide.jewelry.explanation}
            </p>
          </Card>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <Card>
              <p className="label-brand text-[9px]">Acabado</p>
              <p className="mt-1.5 font-serif text-xl capitalize text-ink">
                {guide.jewelry.finish}
              </p>
            </Card>
            <Card>
              <p className="label-brand text-[9px]">Escala</p>
              <p className="mt-1.5 font-serif text-xl capitalize text-ink">
                {guide.jewelry.scale}
              </p>
            </Card>
          </div>

          <Card className="mb-4">
            <p className="label-brand text-[9px]">Piedras recomendadas</p>
            <p className="mt-1.5 text-sm text-ink-soft">{guide.jewelry.stones.join(" · ")}</p>
          </Card>

          <ul className="flex flex-col gap-3">
            {[guide.jewelry.earrings, guide.jewelry.necklace, guide.jewelry.mixingMetalsAdvice, guide.jewelry.pairingNote].map(
              (text) => (
                <li key={text}>
                  <Card accent="left" className="pl-5">
                    <span className="text-sm leading-relaxed text-ink-soft">{text}</span>
                  </Card>
                </li>
              )
            )}
          </ul>
        </section>

        <section>
          <span className="label-brand">Bolsos, cinturones y calzado</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
            Colores de accesorios
          </h2>
          <NamedSwatchGrid colors={guide.jewelry.accessoryColors} columns={4} />
        </section>
      </TabPanel>

      {/* 5 · CERCA DEL ROSTRO */}
      <TabPanel id="rostro" activeId={activeTab}>
        <section className="mb-6">
          <span className="label-brand">Máximo impacto visual</span>
          <h2 className="mb-2 mt-2 font-serif text-2xl font-light text-ink">
            Colores cerca del rostro
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-soft">
            Camisas, blusas, chaquetas, bufandas, pañuelos y monturas de gafas son las
            prendas que más influyen, porque su color se refleja en tu piel.
          </p>

          <div className="mb-6">
            <h3 className="mb-3 font-serif text-lg text-ink">Altamente recomendados</h3>
            <NamedSwatchGrid colors={guide.faceColors.highlyRecommended} columns={3} />
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-serif text-lg text-ink">Compatibles</h3>
            <NamedSwatchGrid colors={guide.faceColors.compatible} columns={3} />
          </div>

          {guide.faceColors.useWithBalance.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 font-serif text-lg text-ink">Usar con equilibrio</h3>
              <ul className="flex flex-col gap-2">
                {guide.faceColors.useWithBalance.map((item) => (
                  <li key={item.color.hex}>
                    <Card className="flex items-start gap-3">
                      <span
                        className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-inset ring-black/10"
                        style={{ backgroundColor: item.color.hex }}
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block text-sm font-medium text-ink">
                          {item.color.name}
                        </span>
                        <span className="block text-sm leading-relaxed text-ink-soft">
                          {item.howToBalance}
                        </span>
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="mb-2 font-serif text-lg text-ink">Menos favorecedores</h3>
            <p className="mb-3 text-sm leading-relaxed text-ink-soft">
              {faceAvoidAdvice(classification.primary.seasonId)}
            </p>
            <ul className="flex flex-col gap-2">
              {guide.faceColors.lessFlattering.map((item) => (
                <li key={item.color.hex}>
                  <Card className="flex items-start gap-3">
                    <span
                      className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-inset ring-black/10"
                      style={{ backgroundColor: item.color.hex }}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-sm font-medium text-ink">
                        {item.color.name}
                      </span>
                      <span className="block text-sm leading-relaxed text-ink-soft">
                        {item.farFromFaceUse}
                      </span>
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </TabPanel>

      {/* 6 · INFORME */}
      <TabPanel id="informe" activeId={activeTab}>
        <section className="mb-6">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-white/60 p-4 text-left"
            aria-expanded={showDetails}
          >
            <span className="font-medium text-ink">Ver detalles del análisis</span>
            <ChevronDown
              size={20}
              className={`text-ink-muted transition-transform ${showDetails ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {showDetails && (
            <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-line bg-blush-100 p-4 text-sm text-ink-soft">
              <div>
                <p className="mb-1 font-medium text-ink">¿Por qué este resultado?</p>
                <ul className="list-inside list-disc">
                  {classification.influencingFactors.map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium text-ink">Otras estaciones cercanas</p>
                <p>
                  {SEASONS[classification.secondary.seasonId].name} ·{" "}
                  {SEASONS[classification.tertiary.seasonId].name}
                </p>
              </div>
              {photoQuality && (
                <div>
                  <p className="mb-1 font-medium text-ink">Calidad de la fotografía</p>
                  <p className="capitalize">{photoQuality.overallQuality}</p>
                </div>
              )}
            </div>
          )}
        </section>

        <SaveToAccount
          classification={classification}
          answers={answers}
          quality={photoQuality}
          skinColor={skinColor}
          photoDataUrl={photoDataUrl}
        />

        <section className="mb-8 rounded-[1.75rem] border border-line bg-white p-5 shadow-card">
          <span className="label-brand">Para llevar</span>
          <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
            Descargar informe
          </h2>
          <label htmlFor="report-name" className="mb-1 block text-sm text-ink-soft">
            Tu nombre (opcional)
          </label>
          <input
            id="report-name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ej. Ana"
            className="mb-3 min-h-12 w-full rounded-xl border border-border-interactive bg-blush px-3 text-base text-ink outline-none focus:border-brand-600"
          />
          <label className="mb-4 flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={includeSelfie}
              onChange={(e) => setIncludeSelfie(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600"
            />
            Incluir mi selfie en el informe
          </label>
          <Button
            onClick={() =>
              generateReportPdf(classification, season, secondary, {
                userName: userName.trim() || undefined,
                includeSelfie,
                photoDataUrl,
              })
            }
          >
            <Download size={18} strokeWidth={1.75} aria-hidden="true" />
            Descargar informe PDF
          </Button>
        </section>

        <p className="mb-6 rounded-2xl bg-blush-100 p-4 text-sm leading-relaxed text-ink-soft">
          Este resultado se genera a partir de una fotografía y un cuestionario. La luz, la
          cámara y otros factores pueden afectar la estimación. Las recomendaciones de estilo
          son orientativas, no reglas obligatorias.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => leaveTo("/preparacion")} className="sm:flex-1">
            <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
            Repetir análisis
          </Button>
          <Button variant="ghost" onClick={() => leaveTo("/")} className="sm:flex-1">
            <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
            Borrar mis datos
          </Button>
        </div>
      </TabPanel>
    </PageShell>
  );
}
