import type { SeasonId, SeasonProfile } from "@/types/classification";
import { SEASON_AVOID, SEASON_METALS, SEASON_NEUTRALS, SEASON_PALETTES } from "./palettes";

interface SeasonMeta {
  id: SeasonId;
  name: string;
  description: string;
  temperature: SeasonProfile["temperature"];
  depth: SeasonProfile["depth"];
  intensity: SeasonProfile["intensity"];
  contrast: SeasonProfile["contrast"];
  recommendations: string[];
}

const SEASON_META: SeasonMeta[] = [
  {
    id: "primavera-clara",
    name: "Primavera clara",
    description:
      "Colores cálidos, claros y delicados. Predominan tonos luminosos con baja profundidad.",
    temperature: "calida",
    depth: "clara",
    intensity: "media",
    contrast: "bajo",
    recommendations: [
      "Prioriza tonos claros y cálidos cerca del rostro.",
      "Evita colores muy oscuros u opacos, pueden restar luminosidad.",
      "Los metales dorados claros suelen favorecer más que los plateados fríos.",
    ],
  },
  {
    id: "primavera-calida",
    name: "Primavera cálida",
    description:
      "Tonos cálidos, vívidos y de profundidad media. Base amarilla o dorada predominante.",
    temperature: "calida",
    depth: "media",
    intensity: "brillante",
    contrast: "medio",
    recommendations: [
      "Los colores cálidos y saturados suelen aportar frescura al rostro.",
      "Combina con neutros cálidos como camel o marfil.",
      "Evita tonos fríos apagados, pueden verse apagados sobre la piel.",
    ],
  },
  {
    id: "primavera-brillante",
    name: "Primavera brillante",
    description:
      "Colores cálidos, claros y muy vívidos. Alto contraste con intensidad marcada.",
    temperature: "calida",
    depth: "media",
    intensity: "brillante",
    contrast: "alto",
    recommendations: [
      "Los colores intensos y puros suelen resultar más favorecedores que los apagados.",
      "Usa contraste entre prendas para reforzar tu luminosidad natural.",
      "Evita combinaciones de tonos empolvados o grisáceos.",
    ],
  },
  {
    id: "verano-claro",
    name: "Verano claro",
    description:
      "Tonos fríos, claros y suaves. Base rosada o azulada con baja profundidad.",
    temperature: "fria",
    depth: "clara",
    intensity: "suave",
    contrast: "bajo",
    recommendations: [
      "Los tonos pastel fríos suelen ser los más favorecedores.",
      "Evita colores muy oscuros o muy cálidos cerca del rostro.",
      "La plata y los metales fríos suelen combinar mejor que el oro intenso.",
    ],
  },
  {
    id: "verano-frio",
    name: "Verano frío",
    description:
      "Tonos fríos de profundidad media con intensidad moderada. Base azulada marcada.",
    temperature: "fria",
    depth: "media",
    intensity: "media",
    contrast: "medio",
    recommendations: [
      "Los tonos joya fríos y apagados suelen resultar armoniosos.",
      "Evita tonos cálidos tipo naranja o mostaza.",
      "El contraste moderado entre prendas favorece más que el contraste extremo.",
    ],
  },
  {
    id: "verano-suave",
    name: "Verano suave",
    description:
      "Tonos fríos-neutros, apagados y de bajo a medio contraste.",
    temperature: "neutral",
    depth: "media",
    intensity: "suave",
    contrast: "bajo",
    recommendations: [
      "Los tonos empolvados y neutros suelen favorecer más que los muy saturados.",
      "Evita colores muy brillantes o fluorescentes.",
      "Los metales mate y apagados suelen quedar mejor que los muy brillantes.",
    ],
  },
  {
    id: "otono-suave",
    name: "Otoño suave",
    description:
      "Tonos cálidos-neutros, apagados, de profundidad y contraste medios.",
    temperature: "neutral",
    depth: "media",
    intensity: "suave",
    // Contraste medio, como dice su descripcion: con "bajo" quedaba con la
    // misma tupla que verano-suave y no podia salir nunca como resultado.
    contrast: "medio",
    recommendations: [
      "Los tonos tierra suaves suelen ser los más armoniosos.",
      "Evita colores muy fríos o muy saturados.",
      "Las combinaciones tono sobre tono suelen favorecer más que el alto contraste.",
    ],
  },
  {
    id: "otono-calido",
    name: "Otoño cálido",
    description:
      "Tonos cálidos, terrosos y de profundidad media. Base dorada u oliva marcada.",
    temperature: "calida",
    depth: "media",
    intensity: "media",
    contrast: "medio",
    recommendations: [
      "Los tonos tierra, mostaza y terracota suelen resultar favorecedores.",
      "Evita tonos fríos intensos como fucsia o azul eléctrico.",
      "El oro y el bronce suelen combinar mejor que la plata brillante.",
    ],
  },
  {
    id: "otono-profundo",
    name: "Otoño profundo",
    description:
      "Tonos cálidos, profundos e intensos. Alto contraste con base oscura.",
    temperature: "calida",
    depth: "profunda",
    intensity: "media",
    contrast: "alto",
    recommendations: [
      "Los colores profundos y cálidos suelen aportar más armonía que los claros.",
      "Evita tonos pastel o muy claros cerca del rostro.",
      "El contraste marcado entre prendas suele favorecer tu profundidad natural.",
    ],
  },
  {
    id: "invierno-brillante",
    name: "Invierno brillante",
    description:
      "Tonos fríos, vívidos y de alto contraste. Base azulada muy marcada.",
    temperature: "fria",
    depth: "media",
    intensity: "brillante",
    contrast: "alto",
    recommendations: [
      "Los colores puros y saturados suelen ser los más favorecedores.",
      "Evita tonos apagados o mezclados, pueden restar viveza.",
      "El blanco y negro puro suelen funcionar muy bien como base.",
    ],
  },
  {
    id: "invierno-frio",
    name: "Invierno frío",
    description:
      "Tonos fríos, de profundidad media-alta y contraste marcado.",
    temperature: "fria",
    // Profundidad media, como dice su descripcion: con "profunda" quedaba con
    // la misma tupla que invierno-profundo y no podia salir nunca.
    depth: "media",
    intensity: "media",
    contrast: "alto",
    recommendations: [
      "Los tonos joya fríos suelen resultar muy favorecedores.",
      "Evita colores cálidos terrosos como mostaza o camel.",
      "La plata y el platino suelen combinar mejor que el oro cálido.",
    ],
  },
  {
    id: "invierno-profundo",
    name: "Invierno profundo",
    description:
      "Tonos fríos, muy profundos e intensos. Alto contraste con base oscura marcada.",
    temperature: "fria",
    depth: "profunda",
    intensity: "media",
    contrast: "alto",
    recommendations: [
      "Los colores profundos y saturados suelen aportar más armonía que los claros.",
      "Evita tonos pastel o cálidos claros cerca del rostro.",
      "El contraste alto entre prendas suele favorecer tu profundidad natural.",
    ],
  },
];

export const SEASONS: Record<SeasonId, SeasonProfile> = Object.fromEntries(
  SEASON_META.map((meta) => [
    meta.id,
    {
      ...meta,
      palette: SEASON_PALETTES[meta.id],
      neutrals: SEASON_NEUTRALS[meta.id],
      metals: SEASON_METALS[meta.id],
      avoid: SEASON_AVOID[meta.id],
    },
  ])
) as Record<SeasonId, SeasonProfile>;

export const SEASON_LIST: SeasonProfile[] = Object.values(SEASONS);
