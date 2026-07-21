import type { ClassificationResult, DetectedFeatures, SeasonId } from "@/types/classification";
import type { StylePreferences } from "@/types/preferences";
import type {
  MetalAdvice,
  NamedColor,
  OutfitCombination,
  OutfitPiece,
  OutfitTemplate,
  Presentation,
  TemplateSlot,
} from "@/types/style";
import { OUTFIT_TEMPLATES } from "@/data/outfit-templates";
import { SEASON_STYLE_VOICE } from "@/data/style-recommendations";
import { SEASONS } from "@/data/seasons";
import {
  getSeasonColorIndex,
  resolveBucket,
  resolveBucketCascade,
  type SeasonColorIndex,
} from "./color-index";
import { measureHarmony } from "./harmony";
import {
  composeAccentTip,
  composeContrastTip,
  composeOutfitExplanation,
} from "./compose-explanation";
import { pick } from "./seeded-random";

/** Separación mínima de luminosidad entre prendas contiguas. Sin ella, un
 *  conjunto de invierno profundo es una mancha y uno de verano claro se
 *  disuelve. */
const MIN_DELTA_L = 12;

/**
 * Elige el color de una prenda degradando en este orden:
 *   1. del bucket preferente, sin repetir y separado en luminosidad
 *   2. del bucket preferente, sin repetir
 *   3. de la cascada ampliada, sin repetir  ← evita el color duplicado
 *   4. lo que haya
 */
function chooseDistinct(
  preferred: NamedColor[],
  fallback: NamedColor[],
  used: NamedColor[],
  seed: string
): NamedColor {
  const isFree = (c: NamedColor) => !used.some((u) => u.hex === c.hex);
  const isSeparated = (c: NamedColor) =>
    used.every((u) => Math.abs(c.lightness - u.lightness) >= MIN_DELTA_L);

  const free = preferred.filter(isFree);
  const separated = free.filter(isSeparated);
  if (separated.length > 0) return pick(separated, seed) ?? separated[0];
  if (free.length > 0) return pick(free, seed) ?? free[0];

  const widerFree = fallback.filter(isFree);
  const widerSeparated = widerFree.filter(isSeparated);
  if (widerSeparated.length > 0) return pick(widerSeparated, seed) ?? widerSeparated[0];
  if (widerFree.length > 0) return pick(widerFree, seed) ?? widerFree[0];

  return pick(preferred, seed) ?? preferred[0] ?? fallback[0];
}

function buildMetalAdvice(seasonId: SeasonId, features: DetectedFeatures): MetalAdvice {
  const season = SEASONS[seasonId];
  const [primary, secondary] = season.metals;

  const finish: MetalAdvice["finish"] =
    features.intensity === "brillante"
      ? "pulido"
      : features.intensity === "suave"
        ? "mate"
        : "satinado";

  const scale: MetalAdvice["scale"] =
    features.contrast === "alto"
      ? "llamativa"
      : features.contrast === "bajo"
        ? "delicada"
        : "media";

  const stonesByTemperature: Record<DetectedFeatures["temperature"], string[]> = {
    calida: ["Ámbar", "Topacio", "Cornalina", "Ojo de tigre"],
    fria: ["Zafiro", "Amatista", "Aguamarina", "Perla gris"],
    neutral: ["Cuarzo rosa", "Labradorita", "Perla", "Jade suave"],
    oliva: ["Jade", "Turmalina verde", "Peridoto", "Ágata musgo"],
  };

  return {
    primary,
    secondary: secondary ?? primary,
    finish,
    scale,
    stones: stonesByTemperature[features.temperature],
    pairingNote: `Con intensidad ${features.intensity} y contraste ${features.contrast}, un acabado ${finish} en escala ${scale} acompaña sin competir.`,
  };
}

function resolvePiece(
  slot: TemplateSlot,
  index: SeasonColorIndex,
  presentation: Presentation,
  used: NamedColor[],
  seed: string,
  avoidGarments: string[]
): OutfitPiece | null {
  const options = slot.garments[presentation] ?? slot.garments.neutral;
  const allowed = options.filter(
    (g) => !avoidGarments.some((a) => g.label.toLowerCase().includes(a.toLowerCase()))
  );
  // Si el usuario evita todas las prendas del slot y es opcional, se omite
  if (allowed.length === 0) {
    if (slot.optional) return null;
    return null;
  }

  const garment = pick(allowed, `${seed}:garment`) ?? allowed[0];
  // Preferimos el bucket más específico, pero conservamos el resto de la
  // cascada como reserva: algunos buckets tienen un solo color y sin reserva
  // dos prendas del mismo conjunto acababan repitiéndolo.
  const preferred = resolveBucket(index, slot.colorSource);
  const fallback = resolveBucketCascade(index, slot.colorSource);
  const color = chooseDistinct(preferred, fallback, used, `${seed}:color`);

  return {
    slot: slot.slot,
    garment: garment.label,
    garmentId: garment.id,
    color,
    role: slot.role,
    nearFace: slot.nearFace,
  };
}

function buildOutfit(
  template: OutfitTemplate,
  classification: ClassificationResult,
  presentation: Presentation,
  preferences: StylePreferences
): OutfitCombination {
  const seasonId = classification.primary.seasonId;
  const index = getSeasonColorIndex(seasonId);
  const voice = SEASON_STYLE_VOICE[seasonId];
  const baseSeed = `${seasonId}:${template.id}:${presentation}`;

  const used: NamedColor[] = [];
  const pieces: OutfitPiece[] = [];

  for (const slot of template.slots) {
    const piece = resolvePiece(
      slot,
      index,
      presentation,
      used,
      `${baseSeed}:${slot.slot}`,
      preferences.avoidGarments
    );
    if (!piece) continue;
    used.push(piece.color);
    pieces.push(piece);
  }

  const primary =
    pieces.find((p) => p.role === "principal")?.color ?? pieces[0]?.color ?? index.palette[0];
  const neutral =
    pieces.find((p) => p.role === "neutro")?.color ?? index.neutrals[0] ?? index.palette[0];
  const secondary =
    pieces.find((p) => p.role === "secundario")?.color ?? neutral;
  const accent = pieces.find((p) => p.role === "acento")?.color ?? null;

  const harmony = measureHarmony(primary, neutral);
  const metal = buildMetalAdvice(seasonId, classification.features);

  return {
    id: `${seasonId}:${template.id}:${presentation}`,
    occasion: template.occasion,
    title: template.title,
    pieces,
    primary,
    secondary,
    neutral,
    accent,
    metal,
    harmony,
    harmonyExplanation: composeOutfitExplanation({
      primary,
      neutral,
      accent,
      harmony,
      features: classification.features,
      occasion: template.occasion,
      voice,
    }),
    contrastTip: composeContrastTip(harmony, classification.features.contrast),
    accentTip: composeAccentTip(accent, classification.features),
    styleTags: template.styleTags,
    presentation,
  };
}

/**
 * Devuelve los conjuntos filtrados por las preferencias del usuario.
 * Sin preferencias devuelve las 7 ocasiones en presentación neutral.
 * Nunca deja una ocasión pedida sin resultado.
 */
export function selectOutfits(
  classification: ClassificationResult,
  preferences: StylePreferences
): OutfitCombination[] {
  const presentation: Presentation = preferences.presentation ?? "neutral";

  let templates = OUTFIT_TEMPLATES;

  if (preferences.occasions.length > 0) {
    templates = templates.filter((t) => preferences.occasions.includes(t.occasion));
  }

  if (preferences.styles.length > 0) {
    const byStyle = templates.filter((t) =>
      t.styleTags.some((tag) => preferences.styles.includes(tag))
    );
    // Si el filtro de estilo deja todo vacío, se ignora antes que devolver nada
    if (byStyle.length > 0) templates = byStyle;
  }

  if (templates.length === 0) templates = OUTFIT_TEMPLATES;

  return templates.map((t) => buildOutfit(t, classification, presentation, preferences));
}
