import { converter, formatHex } from "culori";
import type { GarmentId } from "@/types/style";

const toLch = converter("lch");

/**
 * Contorno derivado del propio relleno, oscurecido en LCH. Un gris global daría
 * aspecto de clipart; un trazo del mismo tono mantiene la pieza integrada.
 */
export function outlineOf(fill: string): string {
  const c = toLch(fill);
  if (!c) return "#00000055";
  return formatHex({ ...c, l: Math.max(6, (c.l ?? 40) * 0.6) }) ?? "#00000055";
}

export interface GarmentProps {
  fill: string;
  /** Si falta, se deriva del relleno */
  stroke?: string;
}

/**
 * Todas las prendas comparten contrato de dibujo para que el conjunto parezca
 * del mismo estudio: viewBox 0 0 200 200, centradas, relleno plano sin
 * degradados, trazo derivado de 5 unidades y esquinas redondeadas.
 */
const STROKE_WIDTH = 5;

function useColors(props: GarmentProps) {
  return { fill: props.fill, stroke: props.stroke ?? outlineOf(props.fill) };
}

const common = {
  strokeWidth: STROKE_WIDTH,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

function Camiseta(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M62 44 L86 34 Q100 48 114 34 L138 44 L156 66 L136 82 L132 76 L132 158 Q100 166 68 158 L68 76 L64 82 L44 66 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M86 34 Q100 48 114 34" fill="none" stroke={stroke} {...common} />
      <path d="M78 150 Q100 156 122 150" fill="none" stroke={stroke} opacity={0.28} {...common} />
    </g>
  );
}

function Blusa(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M64 46 L88 34 Q100 52 112 34 L136 46 L154 72 L134 86 L130 78 L134 156 Q100 168 66 156 L70 78 L66 86 L46 72 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M88 34 Q100 52 112 34" fill="none" stroke={stroke} {...common} />
      <path d="M100 54 L100 148" fill="none" stroke={stroke} opacity={0.24} {...common} />
    </g>
  );
}

function Camisa(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M64 44 L86 34 L100 46 L114 34 L136 44 L154 68 L134 84 L132 78 L132 158 Q100 166 68 158 L68 78 L66 84 L46 68 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      {/* Cuello */}
      <path d="M86 34 L100 46 L114 34" fill="none" stroke={stroke} {...common} />
      <path d="M100 46 L100 156" fill="none" stroke={stroke} opacity={0.32} {...common} />
      <path d="M74 92 L74 132" fill="none" stroke={stroke} opacity={0.2} {...common} />
    </g>
  );
}

function Chaqueta(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M58 44 L84 32 L100 52 L116 32 L142 44 L160 74 L140 88 L138 80 L138 162 Q100 170 62 162 L62 80 L60 88 L40 74 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      {/* Solapas */}
      <path d="M84 32 L100 52 L86 96 Z" fill="none" stroke={stroke} opacity={0.5} {...common} />
      <path d="M116 32 L100 52 L114 96 Z" fill="none" stroke={stroke} opacity={0.5} {...common} />
      <path d="M100 52 L100 158" fill="none" stroke={stroke} opacity={0.28} {...common} />
    </g>
  );
}

function Abrigo(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M56 42 L84 30 L100 50 L116 30 L144 42 L162 76 L142 90 L140 82 L140 176 Q100 184 60 176 L60 82 L58 90 L38 76 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M84 30 L100 50 L86 100 Z" fill="none" stroke={stroke} opacity={0.45} {...common} />
      <path d="M116 30 L100 50 L114 100 Z" fill="none" stroke={stroke} opacity={0.45} {...common} />
      <path d="M100 50 L100 172" fill="none" stroke={stroke} opacity={0.3} {...common} />
      <circle cx={100} cy={112} r={4} fill={stroke} opacity={0.4} />
      <circle cx={100} cy={136} r={4} fill={stroke} opacity={0.4} />
    </g>
  );
}

function Vestido(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M68 42 L88 32 Q100 48 112 32 L132 42 L146 64 L130 76 L126 96 Q152 150 156 176 Q100 190 44 176 Q48 150 74 96 L70 76 L54 64 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M88 32 Q100 48 112 32" fill="none" stroke={stroke} {...common} />
      <path d="M76 100 Q100 108 124 100" fill="none" stroke={stroke} opacity={0.3} {...common} />
    </g>
  );
}

function Pantalon(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M62 26 L138 26 L136 60 L128 178 L104 178 L100 84 L96 178 L72 178 L64 60 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M62 40 L138 40" fill="none" stroke={stroke} opacity={0.35} {...common} />
      <path d="M100 84 L100 40" fill="none" stroke={stroke} opacity={0.22} {...common} />
    </g>
  );
}

function Falda(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M66 34 L134 34 L138 52 Q158 130 164 158 Q100 172 36 158 Q42 130 62 52 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M66 50 L134 50" fill="none" stroke={stroke} opacity={0.35} {...common} />
      <path d="M86 60 Q82 120 76 154" fill="none" stroke={stroke} opacity={0.2} {...common} />
      <path d="M114 60 Q118 120 124 154" fill="none" stroke={stroke} opacity={0.2} {...common} />
    </g>
  );
}

function Zapato(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      {/* Perfil de zapato: empeine alto a la izquierda, puntera a la derecha
          y suela marcada, para que no se lea como una mancha. */}
      <path
        d="M46 74 Q66 66 78 82 Q86 96 92 110 Q104 128 132 132 Q158 136 162 148 L162 154 Q160 160 150 160 L56 160 Q46 158 44 148 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      {/* Suela */}
      <path d="M44 148 L162 148" fill="none" stroke={stroke} opacity={0.45} {...common} />
      {/* Abertura del empeine */}
      <path d="M52 78 Q68 74 76 88" fill="none" stroke={stroke} opacity={0.35} {...common} />
    </g>
  );
}

function Bolso(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path d="M74 76 Q74 36 100 36 Q126 36 126 76" fill="none" stroke={stroke} {...common} />
      <path
        d="M50 76 L150 76 L158 154 Q100 166 42 154 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M50 96 L150 96" fill="none" stroke={stroke} opacity={0.3} {...common} />
    </g>
  );
}

function Bufanda(props: GarmentProps) {
  const { fill, stroke } = useColors(props);
  return (
    <g>
      <path
        d="M52 52 Q100 30 148 52 Q140 74 116 78 L124 156 L96 160 L92 82 Q64 78 52 52 Z"
        fill={fill}
        stroke={stroke}
        {...common}
      />
      <path d="M96 96 L120 94" fill="none" stroke={stroke} opacity={0.28} {...common} />
      <path d="M98 124 L122 122" fill="none" stroke={stroke} opacity={0.28} {...common} />
    </g>
  );
}

export const GARMENTS: Record<GarmentId, (props: GarmentProps) => React.JSX.Element> = {
  blusa: Blusa,
  camiseta: Camiseta,
  camisa: Camisa,
  chaqueta: Chaqueta,
  abrigo: Abrigo,
  vestido: Vestido,
  pantalon: Pantalon,
  falda: Falda,
  zapato: Zapato,
  bolso: Bolso,
  bufanda: Bufanda,
};

export const GARMENT_LABELS: Record<GarmentId, string> = {
  blusa: "Blusa",
  camiseta: "Camiseta",
  camisa: "Camisa",
  chaqueta: "Chaqueta",
  abrigo: "Abrigo",
  vestido: "Vestido",
  pantalon: "Pantalón",
  falda: "Falda",
  zapato: "Calzado",
  bolso: "Bolso",
  bufanda: "Bufanda",
};
