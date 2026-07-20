import { converter } from "culori";
import type { LabColor, LchColor, RgbColor } from "@/types/color";

const toLab = converter("lab");
const toLch = converter("lch");

// `??` solo cubre null/undefined: un NaN se propagaria intacto y arruinaria en
// silencio toda la clasificacion posterior.
function finite(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function rgbToLab(rgb: RgbColor): LabColor {
  const result = toLab({ mode: "rgb", r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 });
  return { l: finite(result.l), a: finite(result.a), b: finite(result.b) };
}

export function rgbToLch(rgb: RgbColor): LchColor {
  const result = toLch({ mode: "rgb", r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 });
  return { l: finite(result.l), c: finite(result.c), h: finite(result.h) };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}
