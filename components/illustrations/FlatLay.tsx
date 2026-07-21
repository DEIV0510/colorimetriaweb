import type { GarmentSlot, OutfitPiece } from "@/types/style";
import { GARMENTS, GARMENT_LABELS, outlineOf } from "./garments";

/**
 * Disposición tipo "flat lay" editorial: las prendas se superponen y giran
 * ligeramente sobre un mismo lienzo, en vez de alinearse como cuadritos. La
 * superposición es lo que hace que cinco formas se lean como UN conjunto.
 */
interface Placement {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

const PLACEMENTS: Record<GarmentSlot, Placement> = {
  // Prenda superior: protagonista, centrada y arriba
  superior: { x: 202, y: 160, scale: 1.04, rotate: -3 },
  // Capa: detrás y desplazada, asomando por el lado
  capa: { x: 120, y: 178, scale: 0.88, rotate: -13 },
  // Inferior: SOLAPADA bajo el dobladillo de la superior. La superposición es
  // lo que hace que cinco formas se lean como un conjunto y no como iconos.
  inferior: { x: 212, y: 296, scale: 0.96, rotate: 2 },
  // Calzado: abajo a la derecha, tocando el bajo del pantalón
  calzado: { x: 296, y: 406, scale: 0.6, rotate: 10 },
  // Accesorio: abajo a la izquierda, metido bajo la prenda inferior
  accesorio: { x: 108, y: 386, scale: 0.54, rotate: -9 },
};

/** Orden de pintado: lo que va detrás primero */
const Z_ORDER: GarmentSlot[] = ["capa", "accesorio", "inferior", "superior", "calzado"];

export function FlatLay({
  pieces,
  title,
  className = "",
}: {
  pieces: OutfitPiece[];
  title: string;
  className?: string;
}) {
  const sorted = [...pieces].sort(
    (a, b) => Z_ORDER.indexOf(a.slot) - Z_ORDER.indexOf(b.slot)
  );

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label={title}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Sombra elíptica difusa que asienta el conjunto */}
      <defs>
        <radialGradient id="flatlay-shadow">
          <stop offset="0%" stopColor="#2A1622" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#2A1622" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="452" rx="150" ry="34" fill="url(#flatlay-shadow)" />

      {sorted.map((piece) => {
        const Garment = GARMENTS[piece.garmentId];
        const place = PLACEMENTS[piece.slot];
        if (!Garment || !place) return null;
        return (
          <g
            key={`${piece.slot}-${piece.garmentId}`}
            transform={`translate(${place.x} ${place.y}) rotate(${place.rotate}) scale(${place.scale}) translate(-100 -100)`}
          >
            <Garment fill={piece.color.hex} />
          </g>
        );
      })}
    </svg>
  );
}

/** Descripción textual del conjunto, para lectores de pantalla */
export function describeOutfit(pieces: OutfitPiece[]): string {
  return pieces
    .map((p) => `${GARMENT_LABELS[p.garmentId].toLowerCase()} ${p.color.name.toLowerCase()}`)
    .join(", ");
}

export { outlineOf };
