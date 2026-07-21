import { converter } from "culori";
import type { SeasonId } from "@/types/classification";
import type { ColorBucket, ColorFamily, ColorSource, NamedColor } from "@/types/style";
import { SEASONS } from "@/data/seasons";
import { COLOR_NAMES, SEASON_SUPPORT_NEUTRALS } from "@/data/color-names";

const toLch = converter("lch");

function finite(value: number | undefined, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Familia cromática a partir del tono LCH. Los acromáticos van a "neutro". */
export function familyOf(hue: number, chroma: number): ColorFamily {
  if (chroma < 10) return "neutro";
  const h = ((hue % 360) + 360) % 360;
  if (h < 20) return "rojo";
  if (h < 40) return "terracota";
  if (h < 55) return "naranja";
  if (h < 75) return "ambar";
  if (h < 95) return "mostaza";
  if (h < 115) return "oliva";
  if (h < 155) return "verde";
  if (h < 200) return "turquesa";
  if (h < 250) return "azul";
  if (h < 285) return "indigo";
  if (h < 315) return "violeta";
  if (h < 340) return "magenta";
  return "rosa";
}

/**
 * Nombre de respaldo. En producción no debería ejecutarse nunca: hay un test
 * que exige que todo hex del catálogo tenga nombre curado. Existe para que un
 * hex nuevo sin nombrar no rompa la app.
 */
function deriveName(hex: string, lightness: number, family: ColorFamily): string {
  const tone = lightness > 70 ? "claro" : lightness < 35 ? "profundo" : "medio";
  const base: Record<ColorFamily, string> = {
    rojo: "Rojo",
    terracota: "Terracota",
    naranja: "Naranja",
    ambar: "Ámbar",
    mostaza: "Mostaza",
    oliva: "Oliva",
    verde: "Verde",
    turquesa: "Turquesa",
    azul: "Azul",
    indigo: "Índigo",
    violeta: "Violeta",
    magenta: "Magenta",
    rosa: "Rosa",
    marron: "Marrón",
    neutro: "Neutro",
  };
  return `${base[family]} ${tone}`;
}

const cache = new Map<string, NamedColor>();

export function toNamedColor(hex: string, source: ColorSource): NamedColor {
  const key = `${hex.toUpperCase()}|${source}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const upper = hex.toUpperCase();
  const lch = toLch({
    mode: "rgb",
    r: parseInt(upper.slice(1, 3), 16) / 255,
    g: parseInt(upper.slice(3, 5), 16) / 255,
    b: parseInt(upper.slice(5, 7), 16) / 255,
  });

  const lightness = finite(lch?.l);
  const chroma = finite(lch?.c);
  const hue = finite(lch?.h);
  const family = familyOf(hue, chroma);

  const named: NamedColor = {
    hex: upper,
    name: COLOR_NAMES[upper] ?? deriveName(upper, lightness, family),
    family,
    lightness: Math.round(lightness * 10) / 10,
    chroma: Math.round(chroma * 10) / 10,
    hue: Math.round(hue),
    isNeutral: chroma < 12,
    source,
  };

  cache.set(key, named);
  return named;
}

export interface SeasonColorIndex {
  seasonId: SeasonId;
  palette: NamedColor[];
  neutrals: NamedColor[];
  support: NamedColor[];
  avoid: NamedColor[];
  /** Todos los que se pueden vestir (paleta + neutros + soporte) */
  wearable: NamedColor[];
  buckets: Record<ColorBucket, NamedColor[]>;
}

const indexCache = new Map<SeasonId, SeasonColorIndex>();

function buildBuckets(
  palette: NamedColor[],
  neutrals: NamedColor[],
  support: NamedColor[]
): Record<ColorBucket, NamedColor[]> {
  const byChroma = [...palette].sort((a, b) => b.chroma - a.chroma);

  return {
    // El más saturado de la paleta es el que "habla" en un conjunto
    "paleta-statement": byChroma.slice(0, 4),
    "paleta-clara": palette.filter((c) => c.lightness >= 68),
    "paleta-media": palette.filter((c) => c.lightness >= 42 && c.lightness < 68),
    "paleta-oscura": palette.filter((c) => c.lightness < 42),
    "paleta-apagada": palette.filter((c) => c.chroma < 25),
    "neutro-claro": neutrals.filter((c) => c.lightness >= 65),
    "neutro-medio": neutrals.filter((c) => c.lightness >= 35 && c.lightness < 65),
    "neutro-oscuro": neutrals.filter((c) => c.lightness < 35),
    "soporte-denim": support.filter((c) => c.family === "azul" || c.family === "indigo"),
    "soporte-blanco": support.filter((c) => c.lightness >= 85),
    "soporte-oscuro": support.filter((c) => c.lightness < 35),
    "cualquier-neutro": [...neutrals, ...support],
    "cualquier-paleta": palette,
  };
}

export function getSeasonColorIndex(seasonId: SeasonId): SeasonColorIndex {
  const cached = indexCache.get(seasonId);
  if (cached) return cached;

  const season = SEASONS[seasonId];
  const palette = season.palette.map((h) => toNamedColor(h, "paleta"));
  const neutrals = season.neutrals.map((h) => toNamedColor(h, "neutro"));
  const support = (SEASON_SUPPORT_NEUTRALS[seasonId] ?? []).map((h) =>
    toNamedColor(h, "soporte")
  );
  const avoid = season.avoid.map((h) => toNamedColor(h, "evitar"));

  const index: SeasonColorIndex = {
    seasonId,
    palette,
    neutrals,
    support,
    avoid,
    wearable: [...palette, ...neutrals, ...support],
    buckets: buildBuckets(palette, neutrals, support),
  };

  indexCache.set(seasonId, index);
  return index;
}

/**
 * Resuelve la cascada de buckets y devuelve el primero con contenido.
 * El reparto por luminosidad deja huecos en 11 de las 12 estaciones, así que
 * cada slot declara varias fuentes en orden de preferencia.
 */
export function resolveBucket(
  index: SeasonColorIndex,
  cascade: readonly ColorBucket[]
): NamedColor[] {
  for (const bucket of cascade) {
    const colors = index.buckets[bucket];
    if (colors && colors.length > 0) return colors;
  }
  // Último recurso: cualquier color vestible. Nunca devolvemos vacío.
  return index.wearable;
}

/**
 * Igual que `resolveBucket`, pero devuelve la unión ACUMULADA de la cascada,
 * de más preferente a menos, sin repetir.
 *
 * Hace falta porque algunos buckets tienen un único color: si el pantalón ya lo
 * gastó, el calzado no tenía de dónde elegir y acababa repitiéndolo. Con la
 * unión, se puede seguir bajando por la cascada hasta encontrar uno libre.
 */
export function resolveBucketCascade(
  index: SeasonColorIndex,
  cascade: readonly ColorBucket[]
): NamedColor[] {
  const seen = new Set<string>();
  const out: NamedColor[] = [];
  const push = (colors: NamedColor[] | undefined) => {
    for (const color of colors ?? []) {
      if (seen.has(color.hex)) continue;
      seen.add(color.hex);
      out.push(color);
    }
  };
  for (const bucket of cascade) push(index.buckets[bucket]);
  push(index.wearable);
  return out;
}
