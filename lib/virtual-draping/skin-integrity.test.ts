import { describe, expect, it } from "vitest";
import { renderColorFan, renderSingleColor } from "./render-color-fan";
import type { DrapingColor, FaceMask } from "@/types/virtual-draping";

/**
 * El requisito irrenunciable de la prueba virtual: la selfie debe salir
 * cromáticamente IDÉNTICA con cualquier color de fondo. Si un solo píxel de
 * piel cambia entre dos comparaciones, la prueba deja de ser válida — la
 * persona estaría comparando dos caras distintas, no dos colores.
 *
 * Los tests corren en Node, así que se implementa el mínimo de Canvas 2D que
 * usan los renderizadores. Es suficiente para verificar el orden de dibujado
 * y que no se aplican mezclas ni filtros sobre el rostro.
 */

interface FakePixelCanvas {
  width: number;
  height: number;
  pixels: Map<string, string>;
  operations: string[];
  filters: string[];
  composites: string[];
}

function createFakeCanvas(): HTMLCanvasElement & { __fake: FakePixelCanvas } {
  const state: FakePixelCanvas = {
    width: 0,
    height: 0,
    pixels: new Map(),
    operations: [],
    filters: [],
    composites: [],
  };

  const ctx = {
    _fill: "#000",
    _composite: "source-over",
    set fillStyle(value: string) {
      this._fill = value;
    },
    get fillStyle() {
      return this._fill;
    },
    set globalCompositeOperation(value: string) {
      this._composite = value;
      state.composites.push(value);
    },
    get globalCompositeOperation() {
      return this._composite;
    },
    set filter(value: string) {
      state.filters.push(value);
    },
    get filter() {
      return "none";
    },
    strokeStyle: "",
    lineWidth: 1,
    clearRect: () => state.operations.push("clearRect"),
    fillRect(x: number, y: number, w: number, h: number) {
      state.operations.push(`fillRect:${this._fill}`);
      // El fondo pinta todo el lienzo
      for (let py = y; py < y + h; py += 1) {
        for (let px = x; px < x + w; px += 1) {
          state.pixels.set(`${px},${py}`, this._fill);
        }
      }
    },
    beginPath: () => state.operations.push("beginPath"),
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    fill() {
      state.operations.push(`fill:${this._fill}`);
    },
    stroke: () => {},
    drawImage(source: { __face?: Map<string, string> }, dx: number, dy: number) {
      state.operations.push("drawImage:face");
      // El rostro se copia tal cual sobre lo que hubiera debajo
      if (source.__face) {
        for (const [key, value] of source.__face) {
          const [fx, fy] = key.split(",").map(Number);
          state.pixels.set(`${Math.round(fx + dx)},${Math.round(fy + dy)}`, value);
        }
      }
    },
  };

  const canvas = {
    get width() {
      return state.width;
    },
    set width(value: number) {
      state.width = value;
    },
    get height() {
      return state.height;
    },
    set height(value: number) {
      state.height = value;
    },
    getContext: () => ctx,
    __fake: state,
  };

  return canvas as unknown as HTMLCanvasElement & { __fake: FakePixelCanvas };
}

/** Rostro de prueba: 3 píxeles con colores de piel reconocibles */
const SKIN_PIXELS = new Map<string, string>([
  ["10,10", "#C69A7B"],
  ["11,10", "#B5876A"],
  ["10,11", "#D8B199"],
]);

function makeMask(): FaceMask {
  const faceCanvas = { __face: SKIN_PIXELS } as unknown as HTMLCanvasElement;
  return {
    canvas: faceCanvas,
    width: 40,
    height: 40,
    center: { x: 20, y: 20 },
    radius: { x: 14, y: 17 },
    chinY: 32,
    neckWidth: 18,
  };
}

function makeColor(hex: string, id: string): DrapingColor {
  return {
    hex,
    name: id,
    family: "rojo",
    lightness: 50,
    chroma: 30,
    hue: 20,
    isNeutral: false,
    source: "paleta",
    id,
    rgb: { r: 0, g: 0, b: 0 },
    category: "muy-compatible",
    group: "principal",
    compatibility: 80,
    recommendedUse: "",
    pairsWith: [],
  };
}

/** Tonos de piel del rostro de prueba, para localizarlos en el lienzo final */
const SKIN_VALUES = new Set(SKIN_PIXELS.values());

function skinPixelsOf(canvas: HTMLCanvasElement & { __fake: FakePixelCanvas }) {
  const out: string[] = [];
  for (const [key, value] of canvas.__fake.pixels) {
    if (SKIN_VALUES.has(value)) out.push(`${key}=${value}`);
  }
  return out.sort();
}

describe("integridad de la piel", () => {
  it("deja los píxeles del rostro idénticos con dos colores opuestos", () => {
    const mask = makeMask();

    const a = createFakeCanvas();
    renderSingleColor(a, mask, "#000000");

    const b = createFakeCanvas();
    renderSingleColor(b, mask, "#FFFFFF");

    expect(skinPixelsOf(a)).toEqual(skinPixelsOf(b));
    expect(skinPixelsOf(a).length).toBe(SKIN_PIXELS.size);
  });

  it("nunca aplica un filtro al dibujar", () => {
    const mask = makeMask();
    const canvas = createFakeCanvas();
    renderSingleColor(canvas, mask, "#D6207E");
    expect(canvas.__fake.filters).toHaveLength(0);
  });

  it("nunca usa un modo de mezcla que altere el color del rostro", () => {
    const mask = makeMask();
    const canvas = createFakeCanvas();
    renderColorFan(canvas, mask, {
      colors: [makeColor("#B5541A", "a"), makeColor("#0047AB", "b")],
    });
    const blending = canvas.__fake.composites.filter(
      (op) => op !== "source-over"
    );
    expect(blending, `mezclas detectadas: ${blending.join(", ")}`).toHaveLength(0);
  });

  it("dibuja el rostro DESPUÉS del color, nunca antes", () => {
    const mask = makeMask();
    const canvas = createFakeCanvas();
    renderColorFan(canvas, mask, {
      colors: [makeColor("#B5541A", "a"), makeColor("#0047AB", "b")],
    });

    const ops = canvas.__fake.operations;
    const lastColor = Math.max(
      ops.lastIndexOf("fill:#B5541A"),
      ops.lastIndexOf("fill:#0047AB")
    );
    const face = ops.indexOf("drawImage:face");
    expect(face).toBeGreaterThan(lastColor);
  });

  it("mantiene la piel intacta también en el abanico completo", () => {
    const mask = makeMask();

    const warm = createFakeCanvas();
    renderColorFan(warm, mask, {
      colors: [makeColor("#B5541A", "a"), makeColor("#D4A017", "b")],
    });

    const cool = createFakeCanvas();
    renderColorFan(cool, mask, {
      colors: [makeColor("#0047AB", "c"), makeColor("#4B0082", "d")],
    });

    expect(skinPixelsOf(warm)).toEqual(skinPixelsOf(cool));
  });
});
