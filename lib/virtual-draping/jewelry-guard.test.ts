import { describe, expect, it } from "vitest";
import { metalGuardLine, renderMetals } from "./render-metals";
import { renderVirtualGarment } from "./render-virtual-garment";
import { GARMENT_TEMPLATES } from "@/data/garment-templates";
import { JEWELRY_LABELS, METAL_OPTIONS, type JewelryPiece } from "@/data/metal-palettes";
import type { FaceMask } from "@/types/virtual-draping";

/**
 * Una joya sí se dibuja ENCIMA del recorte —un collar cuelga sobre el pecho—,
 * así que la regla de no tocar el rostro no puede sostenerse por el orden de
 * dibujado como en el resto de la prueba. Aquí la sostiene la geometría: nada
 * puede pintarse por encima de la línea de la barbilla.
 *
 * El lienzo falso registra cada punto de trazado que ocurre DESPUÉS de dibujar
 * el rostro; ese es exactamente el conjunto de píxeles que podrían invadirlo.
 */

interface Recorder {
  faceDrawn: boolean;
  /** Puntos trazados después del rostro */
  pointsAfterFace: { x: number; y: number }[];
  operations: string[];
  filters: string[];
  maxLineWidth: number;
}

function createRecordingCanvas(): HTMLCanvasElement & { __rec: Recorder } {
  const rec: Recorder = {
    faceDrawn: false,
    pointsAfterFace: [],
    operations: [],
    filters: [],
    maxLineWidth: 0,
  };

  const point = (x: number, y: number) => {
    if (rec.faceDrawn) rec.pointsAfterFace.push({ x, y });
  };

  const ctx = {
    fillStyle: "#000",
    strokeStyle: "#000",
    lineCap: "butt",
    _lineWidth: 1,
    set lineWidth(value: number) {
      this._lineWidth = value;
      if (rec.faceDrawn) rec.maxLineWidth = Math.max(rec.maxLineWidth, value);
    },
    get lineWidth() {
      return this._lineWidth;
    },
    _composite: "source-over",
    set globalCompositeOperation(value: string) {
      this._composite = value;
      rec.operations.push(`composite:${value}`);
    },
    get globalCompositeOperation() {
      return this._composite;
    },
    set filter(value: string) {
      rec.filters.push(value);
    },
    get filter() {
      return "none";
    },
    clearRect: () => {},
    fillRect(x: number, y: number, w: number, h: number) {
      point(x, y);
      point(x + w, y + h);
    },
    beginPath: () => {},
    closePath: () => {},
    moveTo: (x: number, y: number) => point(x, y),
    lineTo: (x: number, y: number) => point(x, y),
    quadraticCurveTo: (cx: number, cy: number, x: number, y: number) => {
      point(cx, cy);
      point(x, y);
    },
    arc: (x: number, y: number, r: number) => {
      point(x - r, y - r);
      point(x + r, y + r);
    },
    ellipse: (x: number, y: number, rx: number, ry: number) => {
      point(x - rx, y - ry);
      point(x + rx, y + ry);
    },
    rect: (x: number, y: number, w: number, h: number) => {
      point(x, y);
      point(x + w, y + h);
    },
    roundRect: (x: number, y: number, w: number, h: number) => {
      point(x, y);
      point(x + w, y + h);
    },
    save: () => {},
    restore: () => {},
    translate: () => {},
    clip: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    fill: () => rec.operations.push("fill"),
    stroke: () => rec.operations.push("stroke"),
    drawImage: () => {
      rec.operations.push("drawImage:face");
      rec.faceDrawn = true;
    },
  };

  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ctx,
    __rec: rec,
  };

  return canvas as unknown as HTMLCanvasElement & { __rec: Recorder };
}

function makeMask(): FaceMask {
  return {
    canvas: {} as HTMLCanvasElement,
    width: 400,
    height: 400,
    center: { x: 200, y: 190 },
    radius: { x: 120, y: 150 },
    chinY: 330,
    neckWidth: 130,
  };
}

const PIECES: JewelryPiece[] = Object.keys(JEWELRY_LABELS) as JewelryPiece[];

describe("las joyas no invaden el rostro", () => {
  it.each(PIECES)("mantiene %s por debajo de la mandíbula", (piece) => {
    const mask = makeMask();
    const canvas = createRecordingCanvas();
    renderMetals(canvas, mask, {
      metal: METAL_OPTIONS[0],
      piece,
      backdropHex: "#B5541A",
    });

    const rec = canvas.__rec;
    expect(rec.faceDrawn, "el rostro debe dibujarse antes que la joya").toBe(true);

    // La geometría del lienzo falso: el rostro se sitúa en height * 0.4
    const faceY = canvas.height * 0.4 - mask.center.y;
    // El trazo tiene grosor, así que se admite media línea de holgura
    const guard = metalGuardLine(mask, faceY) - rec.maxLineWidth / 2;

    const invasores = rec.pointsAfterFace.filter((p) => p.y < guard);
    expect(
      invasores,
      `puntos por encima de la barbilla (y=${guard}): ${JSON.stringify(invasores)}`
    ).toHaveLength(0);
  });

  it("no aplica filtros ni mezclas al montar las joyas", () => {
    const mask = makeMask();
    for (const piece of PIECES) {
      const canvas = createRecordingCanvas();
      renderMetals(canvas, mask, {
        metal: METAL_OPTIONS[6],
        piece,
        backdropHex: "#0047AB",
      });
      expect(canvas.__rec.filters).toHaveLength(0);
      expect(
        canvas.__rec.operations.filter((op) => op.startsWith("composite:")),
        `${piece} usa un modo de mezcla`
      ).toHaveLength(0);
    }
  });
});

describe("la prenda virtual no toca el rostro", () => {
  it.each(GARMENT_TEMPLATES.map((t) => t.id))(
    "dibuja %s por debajo del rostro y sin borrar el lienzo",
    (id) => {
      const template = GARMENT_TEMPLATES.find((t) => t.id === id)!;
      const mask = makeMask();
      const canvas = createRecordingCanvas();
      renderVirtualGarment(canvas, mask, { hex: "#B5541A", template });

      const rec = canvas.__rec;
      // El rostro va el último: cualquier trazo posterior sería sospechoso
      expect(rec.operations[rec.operations.length - 1]).toBe("drawImage:face");
      expect(rec.pointsAfterFace).toHaveLength(0);
      expect(rec.filters).toHaveLength(0);

      // Borrar con `destination-out` dejaría agujeros transparentes
      expect(
        rec.operations.filter((op) => op === "composite:destination-out")
      ).toHaveLength(0);
    }
  );
});
