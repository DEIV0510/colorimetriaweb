import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type { GlassesGuide, HairGuide, MakeupGuide, NamedColor } from "@/types/style";
import { SEASONS } from "@/data/seasons";
import { getSeasonColorIndex, toNamedColor } from "./color-index";

/**
 * Cabello, maquillaje y gafas. Se derivan de la paleta y de las características
 * medidas, y se presentan como MUESTRAS con una sola línea de texto: son
 * dominios donde enseñar el color dice más que describirlo.
 *
 * No sustituyen la valoración de un profesional y no se dan referencias
 * comerciales concretas.
 */

/**
 * Tonos de cabello con NOMBRE propio: son hex ajenos a la paleta de vestuario,
 * así que necesitan su propio léxico. Sin él caerían al nombre derivado y dos
 * tonos distintos podrían acabar llamándose igual.
 *
 * Cada banda trae además su juego de `reflejos`, que nunca coincide con los
 * tonos base: un reflejo idéntico al color de partida no es un reflejo.
 */
interface HairBand {
  base: [string, string][];
  reflejos: [string, string][];
}

const HAIR_TONES: Record<
  DetectedFeatures["temperature"],
  { claro: HairBand; medio: HairBand; profundo: HairBand }
> = {
  calida: {
    claro: {
      base: [["#D9B36A", "Rubio miel"], ["#C79F6E", "Rubio dorado"], ["#B58963", "Rubio oscuro"]],
      reflejos: [["#E8CE9A", "Reflejo trigo"], ["#D2A55C", "Reflejo dorado"], ["#C08A4E", "Reflejo caramelo"]],
    },
    medio: {
      base: [["#A9743C", "Castaño cobrizo"], ["#8A5A2E", "Castaño canela"], ["#7A4A1E", "Castaño caoba"]],
      reflejos: [["#C4914E", "Reflejo miel"], ["#B07A3A", "Reflejo cobre"], ["#9C6634", "Reflejo avellana"]],
    },
    profundo: {
      base: [["#4E3A2A", "Castaño chocolate"], ["#3A2418", "Castaño oscuro"], ["#2E211A", "Café profundo"]],
      reflejos: [["#7A5230", "Reflejo caoba"], ["#6A4426", "Reflejo castaño"], ["#5C3A20", "Reflejo nogal"]],
    },
  },
  fria: {
    claro: {
      base: [["#D6C9B0", "Rubio ceniza"], ["#C4B7A8", "Rubio perla"], ["#B0A79E", "Rubio humo"]],
      reflejos: [["#E4DCCE", "Reflejo platino"], ["#CFC4B4", "Reflejo arena fría"], ["#BCB2A6", "Reflejo lino"]],
    },
    medio: {
      base: [["#8A7B6E", "Castaño ceniza"], ["#6E6058", "Castaño humo"], ["#5C5048", "Castaño frío"]],
      reflejos: [["#A2948A", "Reflejo ceniza"], ["#8E8076", "Reflejo topo"], ["#7A6E66", "Reflejo piedra"]],
    },
    profundo: {
      base: [["#3A3230", "Castaño grafito"], ["#2A2422", "Negro suave"], ["#1A1616", "Negro azabache"]],
      reflejos: [["#584E4C", "Reflejo pizarra"], ["#4A4240", "Reflejo carbón"], ["#3E3634", "Reflejo humo"]],
    },
  },
  neutral: {
    claro: {
      base: [["#D2BE96", "Rubio arena"], ["#C0AC8E", "Rubio beige"], ["#AE9C86", "Rubio neutro"]],
      reflejos: [["#E2D2B0", "Reflejo champán"], ["#CDBA9C", "Reflejo avena"], ["#BBA98E", "Reflejo trigo suave"]],
    },
    medio: {
      base: [["#94765A", "Castaño medio"], ["#7C6450", "Castaño natural"], ["#6A5444", "Castaño tierra"]],
      reflejos: [["#AA8C6E", "Reflejo almendra"], ["#96785E", "Reflejo nuez"], ["#84684E", "Reflejo tostado"]],
    },
    profundo: {
      base: [["#443430", "Castaño profundo"], ["#332624", "Castaño noche"], ["#221A18", "Negro cálido"]],
      reflejos: [["#66504A", "Reflejo cacao"], ["#584440", "Reflejo moka"], ["#4A3834", "Reflejo café"]],
    },
  },
  oliva: {
    claro: {
      base: [["#C8B48A", "Rubio oliva"], ["#B4A078", "Rubio bronce"], ["#A08C68", "Rubio tierra"]],
      reflejos: [["#DCC89E", "Reflejo paja"], ["#C6B286", "Reflejo bronce claro"], ["#B29E76", "Reflejo musgo claro"]],
    },
    medio: {
      base: [["#8A7248", "Castaño oliva"], ["#726038", "Castaño bronce"], ["#5E4E30", "Castaño musgo"]],
      reflejos: [["#A08856", "Reflejo oliva"], ["#8C7646", "Reflejo bronce"], ["#786438", "Reflejo tierra"]],
    },
    profundo: {
      base: [["#3E3424", "Castaño selva"], ["#2C2618", "Negro oliva"], ["#1E1A12", "Negro tierra"]],
      reflejos: [["#5C4E36", "Reflejo musgo"], ["#4E422C", "Reflejo bosque"], ["#403624", "Reflejo humus"]],
    },
  },
};

export function selectHair(seasonId: SeasonId, features: DetectedFeatures): HairGuide {
  const set = HAIR_TONES[features.temperature];
  const band = features.depth === "clara" ? "claro" : features.depth === "media" ? "medio" : "profundo";
  const toNamed = ([hex, name]: [string, string]): NamedColor => ({
    ...toNamedColor(hex, "soporte"),
    name,
  });

  const tones = set[band].base.map(toNamed);
  const highlights = set[band].reflejos.map(toNamed);

  const avoidByTemperature: Record<DetectedFeatures["temperature"], string> = {
    calida: "Los reflejos cenizos o violetas apagan tu calidez natural.",
    fria: "Los reflejos cobrizos o dorados intensos endurecen el resultado.",
    neutral: "Los extremos, muy dorado o muy ceniza, te desequilibran.",
    oliva: "Los dorados muy amarillos acentúan el verde del subtono.",
  };

  return {
    tones,
    highlights,
    avoid: avoidByTemperature[features.temperature],
    note: "Orientativo: el resultado real depende de tu base y del proceso técnico. Consúltalo con tu colorista.",
  };
}

export function selectMakeup(seasonId: SeasonId, features: DetectedFeatures): MakeupGuide {
  const index = getSeasonColorIndex(seasonId);

  // Labios: los tonos de la paleta con más presencia
  const lips = [...index.palette]
    .filter((c) => c.chroma > 20 && c.lightness > 25 && c.lightness < 70)
    .sort((a, b) => b.chroma - a.chroma)
    .slice(0, 4);

  // Rubor: versiones suaves, menos saturadas y más claras
  const blush = [...index.palette]
    .filter((c) => c.lightness >= 55 && c.chroma > 12)
    .sort((a, b) => a.chroma - b.chroma)
    .slice(0, 4);

  // Sombras: neutros y tonos apagados de la paleta
  const eyes = [...index.neutrals, ...index.palette.filter((c) => c.chroma < 25)].slice(0, 4);

  const baseByTemperature: Record<DetectedFeatures["temperature"], string> = {
    calida: "Bases de subtono cálido (dorado o amarillo)",
    fria: "Bases de subtono frío (rosado)",
    neutral: "Bases de subtono neutro",
    oliva: "Bases de subtono oliva o neutro-verdoso",
  };

  return {
    lips: lips.length > 0 ? lips : index.palette.slice(0, 4),
    blush: blush.length > 0 ? blush : index.palette.slice(0, 4),
    eyes,
    baseFamily: baseByTemperature[features.temperature],
    note: "Son familias de tono, no referencias de producto: el tono exacto de base no se puede determinar con una selfie.",
  };
}

export function selectGlasses(seasonId: SeasonId, features: DetectedFeatures): GlassesGuide {
  const index = getSeasonColorIndex(seasonId);
  const season = SEASONS[seasonId];

  // Monturas: neutros de la estación más un par de tonos de paleta profundos
  const deep = index.palette.filter((c) => c.lightness < 45).slice(0, 2);
  const frames: NamedColor[] = [...index.neutrals.slice(0, 4), ...deep];

  const finish =
    features.intensity === "brillante"
      ? "Acabado pulido o brillante"
      : features.intensity === "suave"
        ? "Acabado mate o satinado"
        : "Acabado satinado";

  const noteByContrast: Record<DetectedFeatures["contrast"], string> = {
    bajo: "Monturas discretas: una montura muy marcada dominaría tus rasgos.",
    medio: "Monturas de grosor medio, ni invisibles ni dominantes.",
    alto: "Puedes con monturas marcadas: tu contraste natural las sostiene.",
  };

  return {
    frames,
    metals: season.metals,
    finish,
    note: noteByContrast[features.contrast],
  };
}
