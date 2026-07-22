import { converter } from "culori";
import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type { DrapingColor, DrapingPalette } from "@/types/virtual-draping";
import { getDrapingPalette } from "@/data/draping-palettes";
import { toNamedColor } from "@/lib/style/color-index";
import { loadImage } from "@/lib/image-processing/compress";

const toLch = converter("lch");

/**
 * Analiza la foto de una PRENDA (no de una persona) y la compara con la paleta.
 *
 * Funciona bien con prendas de color sólido, que es el caso habitual al mirar
 * una etiqueta en la tienda. Con estampados devuelve los tonos dominantes, y la
 * interfaz avisa de que la lectura es aproximada.
 *
 * Todo ocurre en el navegador: la foto de la prenda tampoco se sube a ningún
 * servidor.
 */

export interface GarmentColorMatch {
  /** Color extraído de la foto */
  color: DrapingColor;
  /** El tono más parecido dentro de la paleta de la persona */
  closest: DrapingColor;
  /** Distancia perceptual; por debajo de 18 se considera prácticamente el mismo */
  distance: number;
  compatibility: number;
  verdict: "en-tu-paleta" | "cercano" | "lejos-de-tu-paleta";
}

export interface GarmentAnalysis {
  matches: GarmentColorMatch[];
  /** Muchos tonos distintos sugieren estampado, no color sólido */
  looksPatterned: boolean;
  summary: string;
}

/** Distancia perceptual aproximada en el espacio LCH */
function perceptualDistance(
  a: { l: number; c: number; h: number },
  b: { l: number; c: number; h: number }
): number {
  const deltaL = a.l - b.l;
  const deltaC = a.c - b.c;
  let deltaH = Math.abs(a.h - b.h);
  if (deltaH > 180) deltaH = 360 - deltaH;
  // El tono pesa menos cuando el croma es bajo: entre dos grises da igual
  const chromaWeight = Math.min(a.c, b.c) / 60;
  return Math.sqrt(deltaL ** 2 + deltaC ** 2 + (deltaH * chromaWeight) ** 2);
}

function toLchOf(hex: string) {
  const parsed = toLch(hex);
  return {
    l: parsed?.l ?? 0,
    c: parsed?.c ?? 0,
    h: parsed?.h ?? 0,
  };
}

/**
 * Agrupa los píxeles por color y devuelve los dominantes. Se descartan los
 * extremos: el blanco del fondo del catálogo y las sombras profundas no son
 * el color de la prenda.
 */
function dominantColors(data: ImageData, count: number): string[] {
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  const pixels = data.data;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 200) continue;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luminance > 246 || luminance < 16) continue;

    // Cuantización a 24 niveles por canal: suficiente para agrupar sin perder matiz
    const key = `${Math.round(r / 11)},${Math.round(g / 11)},${Math.round(b / 11)}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((bucket) => {
      const to2 = (v: number) =>
        Math.max(0, Math.min(255, Math.round(v / bucket.n)))
          .toString(16)
          .padStart(2, "0");
      return `#${to2(bucket.r)}${to2(bucket.g)}${to2(bucket.b)}`.toUpperCase();
    });
}

function closestInPalette(hex: string, palette: DrapingPalette): {
  closest: DrapingColor;
  distance: number;
} {
  const target = toLchOf(hex);
  let best = palette.all[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of palette.all) {
    if (candidate.group === "evitar") continue;
    const distance = perceptualDistance(target, {
      l: candidate.lightness,
      c: candidate.chroma,
      h: candidate.hue,
    });
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }

  return { closest: best, distance: Math.round(bestDistance * 10) / 10 };
}

export async function analyzeGarmentPhoto(
  dataUrl: string,
  seasonId: SeasonId,
  features: DetectedFeatures
): Promise<GarmentAnalysis> {
  const image = await loadImage(dataUrl);

  // Se trabaja pequeño: para extraer color dominante no hace falta resolución,
  // y en un móvil de gama media un lienzo grande cuesta memoria.
  const size = 160;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No se pudo leer la imagen de la prenda.");
  ctx.drawImage(image, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size);
  const hexes = dominantColors(data, 5);
  const palette = getDrapingPalette(seasonId, features);

  const matches: GarmentColorMatch[] = hexes.map((hex) => {
    const named = toNamedColor(hex, "soporte");
    const { closest, distance } = closestInPalette(hex, palette);

    const verdict: GarmentColorMatch["verdict"] =
      distance < 18 ? "en-tu-paleta" : distance < 34 ? "cercano" : "lejos-de-tu-paleta";

    // La compatibilidad hereda la del tono más parecido, penalizada por lo
    // lejos que esté de él. La penalización es suave dentro del radio que ya
    // consideramos "en tu paleta": ahí la diferencia no se nota al llevarlo.
    const penalty = distance < 18 ? distance * 0.45 : 8 + (distance - 18) * 1.2;
    const compatibility = Math.max(
      25,
      Math.min(96, Math.round(closest.compatibility - penalty))
    );

    return {
      color: {
        ...named,
        id: `prenda-${hex.slice(1).toLowerCase()}`,
        rgb: {
          r: parseInt(hex.slice(1, 3), 16),
          g: parseInt(hex.slice(3, 5), 16),
          b: parseInt(hex.slice(5, 7), 16),
        },
        category:
          verdict === "en-tu-paleta"
            ? "muy-compatible"
            : verdict === "cercano"
              ? "compatible-con-equilibrio"
              : "mejor-lejos-del-rostro",
        group: "principal",
        compatibility,
        recommendedUse:
          verdict === "lejos-de-tu-paleta"
            ? "Mejor lejos del rostro, o combinado con un tono de tu paleta arriba."
            : "Puede funcionar cerca del rostro.",
        pairsWith: [closest.name],
      },
      closest,
      distance,
      compatibility,
      verdict,
    };
  });

  // Varios tonos dominantes y bien separados entre sí sugieren estampado
  const looksPatterned =
    matches.length >= 3 &&
    perceptualDistance(
      toLchOf(matches[0].color.hex),
      toLchOf(matches[2].color.hex)
    ) > 40;

  const best = matches[0];
  const summary = !best
    ? "No pudimos leer el color de la prenda. Prueba con una foto más nítida y con luz uniforme."
    : looksPatterned
      ? `La prenda tiene varios colores. El dominante es ${best.color.name.toLowerCase()}, y ${verdictPhrase(best)}`
      : `El color dominante es ${best.color.name.toLowerCase()}, y ${verdictPhrase(best)}`;

  return { matches, looksPatterned, summary };
}

function verdictPhrase(match: GarmentColorMatch): string {
  if (match.verdict === "en-tu-paleta") {
    return `está prácticamente en tu paleta, muy cerca de tu ${match.closest.name.toLowerCase()}.`;
  }
  if (match.verdict === "cercano") {
    return `se acerca a tu ${match.closest.name.toLowerCase()}, así que te funciona con equilibrio.`;
  }
  return `queda lejos de tu paleta; llévalo alejado del rostro o combinado con tu ${match.closest.name.toLowerCase()} arriba.`;
}
