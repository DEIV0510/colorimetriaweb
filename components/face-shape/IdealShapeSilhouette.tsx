import type { FaceShapeId } from "@/types/face-shape";

/**
 * Siluetas de referencia de las seis formas de rostro, en línea limpia (contorno,
 * orejas, nacimiento del pelo y flechas de medida), al estilo de las fichas
 * clásicas de visagismo. Son ideogramas de la forma "de libro", no la cara de la
 * persona: la del usuario se dibuja aparte, sobre su selfie y su contorno real.
 */

const STROKE = "#2a1622";
const ARROW = "#7e125a";

interface Geometry {
  /** Contorno principal del rostro */
  outline: string;
  /** Nacimiento del pelo (arco interior superior) */
  hairline: string;
  /** Flechas de medida y guías (dibujadas en ARROW, con posible discontinua) */
  guides: (props: { dash: string }) => React.ReactNode;
}

// viewBox 0 0 200 250. Centro x = 100. Corona ~32, mentón ~200-218.
const SHAPES: Record<FaceShapeId, Geometry> = {
  ovalo: {
    outline:
      "M100 34 C 150 34 168 76 168 116 C 168 158 140 204 100 208 C 60 204 32 158 32 116 C 32 76 50 34 100 34 Z",
    hairline: "M52 74 C 70 52 130 52 148 74",
    guides: ({ dash }) => (
      <>
        <HArrow y={94} x1={44} x2={156} />
        <HArrow y={124} x1={34} x2={166} />
        <line x1={100} y1={30} x2={100} y2={44} stroke={ARROW} strokeWidth={1.4} strokeDasharray={dash} />
        <polyline points="96,38 100,30 104,38" fill="none" stroke={ARROW} strokeWidth={1.4} />
      </>
    ),
  },
  redondo: {
    outline:
      "M100 36 C 152 36 172 84 172 122 C 172 166 142 198 100 200 C 58 198 28 166 28 122 C 28 84 48 36 100 36 Z",
    hairline: "M50 80 C 70 58 130 58 150 80",
    guides: () => (
      <>
        <HArrow y={122} x1={30} x2={170} />
        <VArrow x={100} y1={40} y2={198} thin />
      </>
    ),
  },
  cuadrado: {
    outline:
      "M100 34 C 132 34 158 40 160 62 L 162 148 C 162 174 150 190 128 196 L 72 196 C 50 190 38 174 38 148 L 40 62 C 42 40 68 34 100 34 Z",
    hairline: "M50 66 C 72 50 128 50 150 66",
    guides: ({ dash }) => (
      <>
        <HArrow y={120} x1={40} x2={160} />
        <line x1={44} y1={150} x2={44} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
        <line x1={156} y1={150} x2={156} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
        <line x1={44} y1={214} x2={156} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
      </>
    ),
  },
  corazon: {
    outline:
      "M100 44 C 152 32 178 68 174 108 C 170 150 132 194 100 216 C 68 194 30 150 26 108 C 22 68 48 32 100 44 Z",
    hairline: "M52 72 C 66 56 82 54 100 66 C 118 54 134 56 148 72",
    guides: ({ dash }) => (
      <>
        <HArrow y={112} x1={34} x2={166} />
        <line x1={40} y1={116} x2={100} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
        <line x1={160} y1={116} x2={100} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
      </>
    ),
  },
  diamante: {
    outline:
      "M100 38 C 122 40 134 56 140 82 C 148 102 158 116 158 122 C 150 162 126 200 100 216 C 74 200 50 162 42 122 C 42 116 52 102 60 82 C 66 56 78 40 100 38 Z",
    hairline: "M64 78 C 76 62 124 62 136 78",
    guides: ({ dash }) => (
      <>
        <HArrow y={122} x1={42} x2={158} />
        <line x1={44} y1={122} x2={100} y2={40} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
        <line x1={156} y1={122} x2={100} y2={40} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
        <line x1={44} y1={122} x2={100} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
        <line x1={156} y1={122} x2={100} y2={214} stroke={ARROW} strokeWidth={1.2} strokeDasharray={dash} />
      </>
    ),
  },
  alargado: {
    outline:
      "M100 28 C 142 28 160 60 160 100 L 160 150 C 160 186 134 214 100 218 C 66 214 40 186 40 150 L 40 100 C 40 60 58 28 100 28 Z",
    hairline: "M52 70 C 72 50 128 50 148 70",
    guides: () => (
      <>
        <HArrow y={124} x1={42} x2={158} />
        <VArrow x={100} y1={36} y2={210} />
      </>
    ),
  },
};

/** Flecha horizontal con cabezas a ambos lados. */
function HArrow({ y, x1, x2 }: { y: number; x1: number; x2: number }) {
  return (
    <g stroke={ARROW} strokeWidth={1.5} fill="none" strokeLinecap="round">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <polyline points={`${x1 + 7},${y - 4} ${x1},${y} ${x1 + 7},${y + 4}`} />
      <polyline points={`${x2 - 7},${y - 4} ${x2},${y} ${x2 - 7},${y + 4}`} />
    </g>
  );
}

/** Flecha vertical con cabezas arriba y abajo. */
function VArrow({ x, y1, y2, thin }: { x: number; y1: number; y2: number; thin?: boolean }) {
  return (
    <g stroke={ARROW} strokeWidth={thin ? 1.3 : 1.5} fill="none" strokeLinecap="round">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <polyline points={`${x - 4},${y1 + 7} ${x},${y1} ${x + 4},${y1 + 7}`} />
      <polyline points={`${x - 4},${y2 - 7} ${x},${y2} ${x + 4},${y2 - 7}`} />
    </g>
  );
}

/** Orejas, iguales para todas las siluetas. */
function Ears() {
  return (
    <g fill="none" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round">
      <path d="M40 116 C 26 112 24 138 34 156 C 40 164 48 160 48 152" />
      <path d="M160 116 C 174 112 176 138 166 156 C 160 164 152 160 152 152" />
    </g>
  );
}

export function IdealShapeSilhouette({
  shape,
  showGuides = true,
  className,
  title,
}: {
  shape: FaceShapeId;
  showGuides?: boolean;
  className?: string;
  title?: string;
}) {
  const g = SHAPES[shape];
  return (
    <svg
      viewBox="0 0 200 250"
      role="img"
      aria-label={title ?? `Silueta de referencia de un rostro ${shape}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Ears />
      <path
        d={g.outline}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path d={g.hairline} fill="none" stroke={STROKE} strokeWidth={1.4} strokeLinecap="round" />
      {showGuides && g.guides({ dash: "4 4" })}
    </svg>
  );
}
