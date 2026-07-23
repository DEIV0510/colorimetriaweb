import type { FaceMeasurements, NormalizedPoint } from "@/types/face-shape";

/**
 * Silueta del rostro DETECTADO (no una cara ilustrada): traza el contorno real
 * de la persona y, encima, dibuja los estilos como línea limpia. Sirve al
 * simulador y a la comparación para probar peinados, gafas, escotes, aretes y
 * barba sobre la propia forma, sin caras de dibujo y sin necesitar hiperrealismo.
 */

export type HairVariant = "none" | "volumen-alto" | "cortina" | "lados";
export type GlassesVariant = "none" | "redondas" | "rectangulares" | "ojo-de-gato";
export type NecklineVariant = "none" | "v" | "redondo" | "barco";
export type EarringVariant = "none" | "colgante" | "aro" | "boton";
export type BeardVariant = "none" | "corta" | "definida";

export interface SilhouetteStyles {
  hair?: HairVariant;
  glasses?: GlassesVariant;
  neckline?: NecklineVariant;
  earrings?: EarringVariant;
  beard?: BeardVariant;
}

const VB_W = 120;
const VB_H = 176;
// Caja donde se encaja el rostro; deja aire arriba (pelo) y abajo (escote/barba)
const BOX = { x: 24, y: 30, w: 72, h: 96 };

const INK = "#7e125a";
const LINE = "#d6207e";
const SOFT = "#fdd7e9";
const HAIR = "#3a2233";

interface Pt {
  x: number;
  y: number;
}

function buildMapper(contour: NormalizedPoint[]) {
  const xs = contour.map((p) => p.x);
  const ys = contour.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const bw = maxX - minX || 1;
  const bh = maxY - minY || 1;
  const scale = Math.min(BOX.w / bw, BOX.h / bh);
  const drawW = bw * scale;
  const drawH = bh * scale;
  const offX = BOX.x + (BOX.w - drawW) / 2;
  const offY = BOX.y + (BOX.h - drawH) / 2;
  return (p: NormalizedPoint): Pt => ({
    x: offX + (p.x - minX) * scale,
    y: offY + (p.y - minY) * scale,
  });
}

function contourPath(contour: NormalizedPoint[], map: (p: NormalizedPoint) => Pt): string {
  return (
    contour
      .map((p, i) => {
        const c = map(p);
        return `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

export function FaceSilhouette({
  contour,
  measurements,
  styles,
  className,
  ariaLabel,
}: {
  contour: NormalizedPoint[];
  measurements: FaceMeasurements;
  styles: SilhouetteStyles;
  className?: string;
  ariaLabel: string;
}) {
  // Sin contorno no se puede dibujar la silueta real; se evita romper la vista.
  if (contour.length < 6) {
    return (
      <div
        className={`flex items-center justify-center rounded-[1.5rem] bg-blush-100 p-6 text-center text-xs text-ink-muted ${className ?? ""}`}
      >
        No pudimos trazar la silueta de tu rostro con esta fotografía.
      </div>
    );
  }

  const map = buildMapper(contour);
  const p = measurements.points;
  const top = map(p.top);
  const chin = map(p.chin);
  const fL = map(p.foreheadLeft);
  const fR = map(p.foreheadRight);
  const cL = map(p.cheekLeft);
  const cR = map(p.cheekRight);
  const jL = map(p.jawLeft);
  const jR = map(p.jawRight);
  const mouth = map(p.mouthBottom);

  const midX = (cL.x + cR.x) / 2;
  const faceW = cR.x - cL.x;
  const eyeY = fL.y + (cL.y - fL.y) * 0.62;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={ariaLabel}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pelo por detrás del rostro */}
      {styles.hair && styles.hair !== "none" && (
        <Hair variant={styles.hair} top={top} fL={fL} fR={fR} cL={cL} cR={cR} midX={midX} />
      )}

      {/* Barba por detrás del contorno, sobre la mitad inferior */}
      {styles.beard && styles.beard !== "none" && (
        <Beard variant={styles.beard} jL={jL} jR={jR} chin={chin} mouth={mouth} midX={midX} />
      )}

      {/* Silueta del rostro real */}
      <path
        d={contourPath(contour, map)}
        fill="#f6dfe9"
        stroke={INK}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />

      {/* Escote / prenda bajo el mentón */}
      {styles.neckline && styles.neckline !== "none" && (
        <Neckline variant={styles.neckline} chin={chin} midX={midX} faceW={faceW} />
      )}

      {/* Gafas a la altura de los ojos */}
      {styles.glasses && styles.glasses !== "none" && (
        <Glasses variant={styles.glasses} midX={midX} eyeY={eyeY} faceW={faceW} />
      )}

      {/* Aretes en la línea de la mandíbula */}
      {styles.earrings && styles.earrings !== "none" && (
        <Earrings variant={styles.earrings} jL={jL} jR={jR} faceW={faceW} />
      )}
    </svg>
  );
}

function Hair({
  variant,
  top,
  fL,
  fR,
  cL,
  cR,
  midX,
}: {
  variant: HairVariant;
  top: Pt;
  fL: Pt;
  fR: Pt;
  cL: Pt;
  cR: Pt;
  midX: number;
}) {
  const w = fR.x - fL.x;
  if (variant === "volumen-alto") {
    // Cúpula alta sobre la frente: aporta altura (alarga)
    const h = top.y - 26;
    return (
      <path
        d={`M${fL.x - 6} ${fL.y + 6} C ${fL.x - 8} ${h} ${fR.x + 8} ${h} ${fR.x + 6} ${fR.y + 6} L ${fR.x - 2} ${fR.y} C ${midX} ${top.y - 4} ${fL.x + 2} ${fL.y} ${fL.x - 2} ${fL.y + 6} Z`}
        fill={HAIR}
      />
    );
  }
  if (variant === "lados") {
    // Volumen a los lados, a la altura de las mejillas (ensancha)
    return (
      <g fill={HAIR}>
        <path d={`M${cL.x + 4} ${top.y + 6} C ${cL.x - 20} ${top.y + 10} ${cL.x - 20} ${cL.y} ${cL.x + 2} ${cL.y + 6} L ${cL.x + 6} ${cL.y} C ${cL.x - 4} ${top.y + 20} ${cL.x + 8} ${top.y + 8} ${cL.x + 4} ${top.y + 6} Z`} />
        <path d={`M${cR.x - 4} ${top.y + 6} C ${cR.x + 20} ${top.y + 10} ${cR.x + 20} ${cR.y} ${cR.x - 2} ${cR.y + 6} L ${cR.x - 6} ${cR.y} C ${cR.x + 4} ${top.y + 20} ${cR.x - 8} ${top.y + 8} ${cR.x - 4} ${top.y + 6} Z`} />
        <path d={`M${fL.x - 2} ${fL.y + 4} C ${fL.x - 6} ${top.y - 6} ${fR.x + 6} ${top.y - 6} ${fR.x + 2} ${fR.y + 4} C ${midX} ${top.y + 2} ${fL.x + 2} ${fL.y + 2} ${fL.x - 2} ${fL.y + 4} Z`} />
      </g>
    );
  }
  // cortina: raya al medio, cae a los lados de la frente
  return (
    <g fill={HAIR}>
      <path d={`M${fL.x - 2} ${fL.y + 4} C ${fL.x - 6} ${top.y - 8} ${fR.x + 6} ${top.y - 8} ${fR.x + 2} ${fR.y + 4} L ${midX + w * 0.04} ${top.y + 2} C ${midX} ${top.y - 2} ${midX} ${top.y - 2} ${midX - w * 0.04} ${top.y + 2} Z`} />
      <path d={`M${fL.x - 2} ${fL.y + 4} C ${fL.x - 4} ${cL.y - 8} ${fL.x + 6} ${cL.y - 10} ${fL.x + 10} ${cL.y - 18} L ${fL.x + 6} ${fL.y + 8} Z`} />
      <path d={`M${fR.x + 2} ${fR.y + 4} C ${fR.x + 4} ${cR.y - 8} ${fR.x - 6} ${cR.y - 10} ${fR.x - 10} ${cR.y - 18} L ${fR.x - 6} ${fR.y + 8} Z`} />
    </g>
  );
}

function Glasses({
  variant,
  midX,
  eyeY,
  faceW,
}: {
  variant: GlassesVariant;
  midX: number;
  eyeY: number;
  faceW: number;
}) {
  const dx = faceW * 0.24;
  const rx = faceW * 0.17;
  const ry = rx * 0.82;
  const left = midX - dx;
  const right = midX + dx;
  const stroke = { fill: "none", stroke: INK, strokeWidth: 1.6 } as const;

  if (variant === "redondas") {
    return (
      <g {...stroke}>
        <circle cx={left} cy={eyeY} r={rx * 0.95} />
        <circle cx={right} cy={eyeY} r={rx * 0.95} />
        <path d={`M${left + rx * 0.95} ${eyeY} Q ${midX} ${eyeY - 3} ${right - rx * 0.95} ${eyeY}`} />
      </g>
    );
  }
  if (variant === "ojo-de-gato") {
    const lens = (cx: number, up: number) =>
      `M${cx - rx} ${eyeY + ry * 0.2} Q ${cx - rx} ${eyeY - ry} ${cx} ${eyeY - ry * 0.9} Q ${cx + rx + up} ${eyeY - ry * 1.25} ${cx + rx} ${eyeY - ry * 0.2} Q ${cx + rx} ${eyeY + ry} ${cx} ${eyeY + ry} Q ${cx - rx} ${eyeY + ry} ${cx - rx} ${eyeY + ry * 0.2} Z`;
    return (
      <g {...stroke}>
        <path d={lens(left, -3)} />
        <path d={lens(right, 3)} />
        <path d={`M${left + rx} ${eyeY - ry * 0.3} Q ${midX} ${eyeY - 3} ${right - rx} ${eyeY - ry * 0.3}`} />
      </g>
    );
  }
  // rectangulares
  const rw = rx * 2;
  const rh = ry * 1.8;
  return (
    <g {...stroke}>
      <rect x={left - rx} y={eyeY - rh / 2} width={rw} height={rh} rx={2.5} />
      <rect x={right - rx} y={eyeY - rh / 2} width={rw} height={rh} rx={2.5} />
      <path d={`M${left + rx} ${eyeY} L ${right - rx} ${eyeY}`} />
    </g>
  );
}

function Neckline({
  variant,
  chin,
  midX,
  faceW,
}: {
  variant: NecklineVariant;
  chin: Pt;
  midX: number;
  faceW: number;
}) {
  const shoulderY = chin.y + faceW * 0.55;
  const half = faceW * 0.95;
  const startY = chin.y + faceW * 0.22;
  const left = midX - half;
  const right = midX + half;
  const fill = { fill: SOFT, stroke: INK, strokeWidth: 1.2, strokeLinejoin: "round" } as const;

  let inner: string;
  if (variant === "v") {
    inner = `L ${midX} ${startY + faceW * 0.5}`;
  } else if (variant === "barco") {
    inner = `Q ${midX} ${startY + faceW * 0.04} ${midX} ${startY + faceW * 0.04}`;
  } else {
    // redondo
    inner = `Q ${midX} ${startY + faceW * 0.34} ${midX} ${startY + faceW * 0.34}`;
  }

  return (
    <path
      d={`M${left} ${shoulderY} L ${left} ${startY + faceW * 0.18} Q ${midX - faceW * 0.3} ${startY} ${midX - faceW * 0.14} ${startY} ${inner} Q ${midX + faceW * 0.14} ${startY} ${midX + faceW * 0.3} ${startY} Q ${right} ${startY + faceW * 0.06} ${right} ${startY + faceW * 0.18} L ${right} ${shoulderY} Z`}
      {...fill}
    />
  );
}

function Earrings({
  variant,
  jL,
  jR,
  faceW,
}: {
  variant: EarringVariant;
  jL: Pt;
  jR: Pt;
  faceW: number;
}) {
  const s = faceW * 0.06;
  const y = (jL.y + jR.y) / 2;
  const drops: [number, number][] = [
    [jL.x - s * 0.4, y],
    [jR.x + s * 0.4, y],
  ];
  return (
    <g fill={LINE} stroke={INK} strokeWidth={0.8}>
      {drops.map(([x, ey], i) => {
        if (variant === "aro") {
          return <circle key={i} cx={x} cy={ey + s * 1.4} r={s} fill="none" strokeWidth={1.4} />;
        }
        if (variant === "colgante") {
          return (
            <g key={i}>
              <line x1={x} y1={ey} x2={x} y2={ey + s * 1.6} strokeWidth={1} />
              <path d={`M${x} ${ey + s * 3.2} l ${s * 0.9} -${s * 1.4} l -${s * 0.9} -${s * 0.6} l -${s * 0.9} ${s * 0.6} Z`} />
            </g>
          );
        }
        // boton
        return <circle key={i} cx={x} cy={ey + s} r={s * 0.7} />;
      })}
    </g>
  );
}

function Beard({
  variant,
  jL,
  jR,
  chin,
  mouth,
  midX,
}: {
  variant: BeardVariant;
  jL: Pt;
  jR: Pt;
  chin: Pt;
  mouth: Pt;
  midX: number;
}) {
  const thickness = variant === "definida" ? 1 : 0.5;
  const drop = (chin.y - mouth.y) * (variant === "definida" ? 1.1 : 0.7);
  return (
    <path
      d={`M${jL.x} ${jL.y} Q ${midX} ${chin.y + drop} ${jR.x} ${jR.y} Q ${midX} ${chin.y + drop + 6 * thickness} ${jL.x} ${jL.y} Z`}
      fill={HAIR}
      opacity={0.92}
    />
  );
}
