"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Camera } from "lucide-react";
import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type { DrapingColor, FaceMask } from "@/types/virtual-draping";
import { GROUP_LABELS } from "@/types/virtual-draping";
import type { JewelryPiece } from "@/data/metal-palettes";
import type { GarmentTemplateId } from "@/data/garment-templates";
import { SEASONS, SEASON_LIST } from "@/data/seasons";
import { getDrapingPalette, getStarterSelection } from "@/data/draping-palettes";
import { createFaceMask, FaceMaskError } from "@/lib/virtual-draping/create-face-mask";
import { buildComparisons } from "@/data/color-comparisons";
import { ColorFan } from "./ColorFan";
import { ColorCarousel } from "./ColorCarousel";
import { FabricDrape } from "./FabricDrape";
import { SideBySideComparison } from "./SideBySideComparison";
import { VirtualGarment } from "./VirtualGarment";
import { MetalComparison } from "./MetalComparison";
import { GarmentAnalyzer } from "./GarmentAnalyzer";
import { ExportImageButton } from "./ExportImageButton";

type Mode = "abanico" | "tela" | "prenda" | "comparar" | "metales" | "analizar";

const MODE_LABELS: Record<Mode, string> = {
  abanico: "Abanico",
  tela: "Tela",
  prenda: "Prenda",
  comparar: "Comparar",
  metales: "Metales",
  analizar: "Mi ropa",
};

/** En estos modos el color activo lo elige el carrusel de la paleta */
const PALETTE_MODES: Mode[] = ["abanico", "tela", "prenda"];


/** Grupos que se pueden ver en el abanico */
type FanScope = "inicial" | "principal" | "neutro" | "evitar" | "todos";

const SCOPE_LABELS: Record<FanScope, string> = {
  inicial: "Selección",
  principal: GROUP_LABELS.principal,
  neutro: GROUP_LABELS.neutro,
  evitar: GROUP_LABELS.evitar,
  todos: "Paleta completa",
};

export function VirtualDrapingViewer({
  photoDataUrl,
  seasonId,
  secondarySeasonId,
  features,
}: {
  photoDataUrl: string | null;
  seasonId: SeasonId;
  secondarySeasonId: SeasonId;
  features: DetectedFeatures;
}) {
  // Un solo estado para el resultado de la detección: así el efecto no
  // encadena varios setState y el estado de carga se deriva de su ausencia.
  const [result, setResult] = useState<
    { ok: true; mask: FaceMask } | { ok: false; message: string } | null
  >(null);

  const [mode, setMode] = useState<Mode>("abanico");
  const [activeSeason, setActiveSeason] = useState<SeasonId>(seasonId);
  const [scope, setScope] = useState<FanScope>("inicial");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [fabricTexture, setFabricTexture] = useState(true);
  const [templateId, setTemplateId] = useState<GarmentTemplateId>("camiseta");
  const [metalId, setMetalId] = useState("oro-amarillo");
  const [piece, setPiece] = useState<JewelryPiece>("aretes-medianos");
  const [comparisonIndex, setComparisonIndex] = useState(0);

  // Para exportar se toma el lienzo que esté visible, sea cual sea el modo. Así
  // cada componente conserva su propio ref y no hay que enhebrarlos hacia arriba.
  const stageRef = useRef<HTMLDivElement>(null);
  const getVisibleCanvas = () => stageRef.current?.querySelector("canvas") ?? null;

  // El rostro se detecta UNA sola vez. Cambiar de color o de estación después
  // solo repinta el lienzo: nunca se vuelve a analizar la imagen.
  useEffect(() => {
    if (!photoDataUrl) return;

    let cancelled = false;

    createFaceMask(photoDataUrl)
      .then((mask) => {
        if (!cancelled) setResult({ ok: true, mask });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({
          ok: false,
          message:
            err instanceof FaceMaskError
              ? err.message
              : "No pudimos preparar la prueba virtual con esta fotografía.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [photoDataUrl]);

  const mask = result?.ok ? result.mask : null;

  const palette = useMemo(
    () => getDrapingPalette(activeSeason, features),
    [activeSeason, features]
  );

  const starter = useMemo(() => getStarterSelection(palette), [palette]);

  const fanColors = useMemo((): DrapingColor[] => {
    switch (scope) {
      case "principal":
        return palette.main.slice(0, 16);
      case "neutro":
        return palette.neutrals;
      case "evitar":
        return palette.avoid;
      case "todos":
        return palette.all.slice(0, 24);
      default:
        return starter;
    }
  }, [scope, palette, starter]);

  // El color activo se DERIVA en vez de sincronizarse con un efecto: si el
  // elegido ya no está en el grupo visible, se cae al más compatible. Así no
  // hay renders en cascada al cambiar de grupo o de estación.
  const selectedId = useMemo(() => {
    if (fanColors.length === 0) return null;
    if (pickedId && fanColors.some((c) => c.id === pickedId)) return pickedId;
    return [...fanColors].sort((a, b) => b.compatibility - a.compatibility)[0]?.id ?? null;
  }, [fanColors, pickedId]);

  if (!photoDataUrl) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-white/70 p-6 text-center">
        <AlertTriangle size={22} className="text-brand-700" aria-hidden="true" />
        <p className="text-sm text-ink-soft">
          Tu selfie ya no está disponible en esta sesión.
        </p>
      </div>
    );
  }

  if (result === null) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-white/70 py-14">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <p className="text-sm text-ink-soft" role="status">
          Preparando tu prueba virtual…
        </p>
      </div>
    );
  }

  if (!mask) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-white/70 p-6 text-center">
        <AlertTriangle size={22} className="text-brand-700" aria-hidden="true" />
        <p className="text-sm text-ink-soft">
          {result.ok ? "" : result.message}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Camera size={14} aria-hidden="true" />
          Puedes repetir la selfie desde la pestaña Informe.
        </p>
      </div>
    );
  }

  const seasonOptions: { id: SeasonId; label: string }[] = [
    { id: seasonId, label: `${SEASONS[seasonId].name} (tu resultado)` },
    { id: secondarySeasonId, label: SEASONS[secondarySeasonId].name },
    ...SEASON_LIST.filter((s) => s.id !== seasonId && s.id !== secondarySeasonId).map(
      (s) => ({ id: s.id, label: s.name })
    ),
  ];

  const selectedColor = fanColors.find((c) => c.id === selectedId) ?? fanColors[0];
  const comparisons = buildComparisons(activeSeason, features);
  // Al cambiar de estación el número de pares puede variar, así que el índice
  // se acota antes de usarlo.
  const safeComparisonIndex = Math.min(
    comparisonIndex,
    Math.max(0, comparisons.length - 1)
  );
  const currentComparison = comparisons[safeComparisonIndex];
  const showsPalette = PALETTE_MODES.includes(mode);

  // Si la selfie está encuadrada al rostro, los hombros no salen y la prenda se
  // dibuja con una plantilla. Conviene decirlo en vez de fingir un retrato.
  const shouldersApproximate = mask.chinY + mask.radius.y * 0.55 > mask.height;

  return (
    <div className="flex flex-col gap-5">
      {/* Modo de visualización */}
      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Modo de prueba"
      >
        {(Object.keys(MODE_LABELS) as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            aria-pressed={mode === option}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-4 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              mode === option
                ? "bg-brand-gradient font-semibold text-white shadow-glow"
                : "text-ink-soft hover:text-brand-700"
            }`}
          >
            {MODE_LABELS[option]}
          </button>
        ))}
      </div>

      <div ref={stageRef} className="flex flex-col gap-4">
        {mode === "analizar" ? (
          <GarmentAnalyzer seasonId={activeSeason} features={features} />
        ) : mode === "metales" ? (
          <MetalComparison
            mask={mask}
            features={features}
            backdropHex={selectedColor?.hex ?? "#EDE8E3"}
            metalId={metalId}
            onMetalChange={setMetalId}
            piece={piece}
            onPieceChange={setPiece}
          />
        ) : mode === "comparar" ? (
          <SideBySideComparison
            mask={mask}
            comparisons={comparisons}
            features={features}
            index={safeComparisonIndex}
            onIndexChange={setComparisonIndex}
          />
        ) : mode === "prenda" ? (
          selectedColor && (
            <VirtualGarment
              mask={mask}
              color={selectedColor}
              templateId={templateId}
              onTemplateChange={setTemplateId}
              approximate={shouldersApproximate}
            />
          )
        ) : mode === "tela" ? (
          <>
            {selectedColor && (
              <FabricDrape mask={mask} color={selectedColor} fabric={fabricTexture} />
            )}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={fabricTexture}
                onChange={(e) => setFabricTexture(e.target.checked)}
                className="h-5 w-5 shrink-0 accent-brand-600"
              />
              Simular pliegues de tela
            </label>
          </>
        ) : (
          <ColorFan
            mask={mask}
            colors={fanColors}
            highlightedId={selectedId}
            seasonName={palette.seasonName}
          />
        )}
      </div>

      {/* Qué colores mostrar. Solo donde el color lo elige la paleta. */}
      <div
        className={`-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          showsPalette ? "" : "hidden"
        }`}
        role="group"
        aria-label="Qué colores mostrar"
      >
        {(Object.keys(SCOPE_LABELS) as FanScope[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setScope(option)}
            aria-pressed={scope === option}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              scope === option
                ? "border-brand-600 bg-brand-600 font-medium text-white"
                : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500"
            }`}
          >
            {SCOPE_LABELS[option]}
          </button>
        ))}
      </div>

      {showsPalette && (
        <ColorCarousel
          colors={fanColors}
          selectedId={selectedId}
          onSelect={setPickedId}
        />
      )}

      {mode !== "analizar" && (
        <ExportImageButton
          getCanvas={getVisibleCanvas}
          seasonName={palette.seasonName}
          color={mode === "comparar" ? currentComparison?.a ?? null : selectedColor ?? null}
          secondColor={mode === "comparar" ? currentComparison?.b ?? null : null}
        />
      )}

      {/* Comparar con otra estación */}
      <div>
        <label
          htmlFor="draping-season"
          className="label-brand mb-2 block text-[9px]"
        >
          Ver la paleta de
        </label>
        <select
          id="draping-season"
          value={activeSeason}
          onChange={(e) => setActiveSeason(e.target.value as SeasonId)}
          className="min-h-12 w-full rounded-xl border border-border-interactive bg-white px-3 text-base text-ink outline-none focus:border-brand-600"
        >
          {seasonOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {activeSeason !== seasonId && (
          <p className="mt-2 text-sm text-ink-muted">
            Estás viendo una paleta distinta a tu resultado. Compara cómo cambia la
            armonía y vuelve a {SEASONS[seasonId].name} para tus colores.
          </p>
        )}
      </div>

      <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
        Tu fotografía no se modifica: los colores se colocan detrás del rostro y las
        joyas por debajo de la mandíbula. Todo se dibuja en tu teléfono. Es una
        simulación orientativa; la luz de la foto influye en cómo se percibe cada tono.
      </p>
    </div>
  );
}
