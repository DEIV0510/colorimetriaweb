// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { StyleItem } from "@/types/face-recommendations";

/** Collares: largos, cortos, gargantilla, colgantes. */
export const NECKLACES: Record<FaceShapeId, StyleItem[]> = {
  "ovalo": [
    {
      "name": "Largos (sautoir, opera)",
      "reason": "Crean una línea vertical que prolonga el eje ya largo del óvalo; úsalos con capas o nudo para cortar esa caída si igual los quieres",
      "verdict": "neutral"
    },
    {
      "name": "Cortos (princesa, a la clavícula)",
      "reason": "Cierran una horizontal a la altura del escote que equilibra el largo del rostro y mantiene la proporción sin estirar",
      "verdict": "reco"
    },
    {
      "name": "Gargantilla (choker)",
      "reason": "Refuerza la horizontal cerca del rostro y aporta contraste con el eje vertical; favorece al óvalo por su cuello equilibrado",
      "verdict": "reco"
    },
    {
      "name": "Colgante con dije a media altura",
      "reason": "El dije crea un punto de foco que rompe la verticalidad continua; mantenlo por encima del busto para no alargar la silueta del rostro-cuello",
      "verdict": "reco"
    }
  ],
  "redondo": [
    {
      "name": "Collar largo en V o con dije bajo",
      "reason": "El vértice descendente crea una línea vertical sobre el pecho que alarga todo el conjunto rostro-cuello.",
      "verdict": "reco"
    },
    {
      "name": "Sautoir / cadena muy larga (por debajo del busto)",
      "reason": "Estira la vertical y afina, alejando el foco del ancho de la cara.",
      "verdict": "reco"
    },
    {
      "name": "Colgante con pieza alargada o angular",
      "reason": "Introduce dirección vertical y algo de ángulo, coherente con el balance que busca el rostro redondo.",
      "verdict": "reco"
    },
    {
      "name": "Collar corto tipo princesa",
      "reason": "Cae en un punto neutro; funciona si el dije aporta algo de longitud, si no queda plano.",
      "verdict": "neutral"
    },
    {
      "name": "Gargantilla ajustada (choker)",
      "reason": "La banda horizontal ceñida al cuello acorta y ensancha, reforzando la redondez que quieres compensar.",
      "verdict": "evitar"
    }
  ],
  "cuadrado": [
    {
      "name": "Colgante largo en V o gota",
      "reason": "La línea que baja crea una diagonal curva que alarga el torso-rostro y desvía la lectura de los lados rectos hacia el centro.",
      "verdict": "reco"
    },
    {
      "name": "Cadena larga con dije redondo",
      "reason": "El óvalo o círculo al final del recorrido añade curva y verticalidad, dos apoyos del balance para un contorno angular.",
      "verdict": "reco"
    },
    {
      "name": "Gargantilla rígida ancha",
      "reason": "Rodea el cuello con una línea horizontal firme que refuerza la anchura y la horizontalidad de la mandíbula, justo lo contrario al objetivo.",
      "verdict": "evitar"
    },
    {
      "name": "Corto tipo princesa curvo",
      "reason": "Funciona si cae en curva suave sobre la clavícula; conviene evitar los de eslabón muy geométrico o rígido.",
      "verdict": "neutral"
    }
  ],
  "corazon": [
    {
      "name": "Gargantilla / choker",
      "reason": "Traza una línea horizontal ancha en la base del cuello que corta la caída en punta y ensancha visualmente el tercio inferior.",
      "verdict": "reco"
    },
    {
      "name": "Collar corto tipo princesa",
      "reason": "Se apoya a la altura de la clavícula y aporta anchura cerca de la mandíbula estrecha.",
      "verdict": "reco"
    },
    {
      "name": "Collares cortos con cuentas redondeadas",
      "reason": "El volumen curvo bajo el mentón contrarresta la afilación del rostro.",
      "verdict": "reco"
    },
    {
      "name": "Colgante largo con dije en punta (V pronunciada)",
      "reason": "Crea una línea descendente que repite el triángulo invertido del rostro y alarga hacia abajo en punta.",
      "verdict": "evitar"
    }
  ],
  "diamante": [
    {
      "name": "Gargantilla",
      "reason": "Aporta anchura horizontal en la base del cuello, dando cuerpo visual al tercio inferior estrecho del rombo.",
      "verdict": "reco"
    },
    {
      "name": "Collar corto tipo princesa",
      "reason": "Se asienta cerca del mentón y rellena la zona angosta de la mandíbula con presencia.",
      "verdict": "reco"
    },
    {
      "name": "Colgante largo en V pronunciada",
      "reason": "Su punta baja alarga y estrecha, reforzando el vértice angosto en lugar de ensanchar el maxilar.",
      "verdict": "evitar"
    },
    {
      "name": "Collar largo",
      "reason": "Estiliza el eje vertical pero no suma el ancho que tu mandíbula agradece; úsalo por estilo más que por equilibrio.",
      "verdict": "neutral"
    }
  ],
  "alargado": [
    {
      "name": "Gargantilla (choker)",
      "reason": "Rodea el cuello con una línea horizontal y corta la verticalidad justo bajo el mentón, acortando ópticamente el conjunto rostro-cuello.",
      "verdict": "reco"
    },
    {
      "name": "Collar corto tipo princesa/collar redondo",
      "reason": "Se asienta a lo ancho sobre la clavícula creando una curva horizontal que ensancha la zona y equilibra el largo.",
      "verdict": "reco"
    },
    {
      "name": "Collar largo en V o sautoir",
      "reason": "La caída hasta el pecho dibuja una línea vertical prolongada que estira aún más, sumando al eje que quieres contener.",
      "verdict": "evitar"
    },
    {
      "name": "Colgante en cadena media",
      "reason": "Depende del largo: a media clavícula funciona, pero si baja mucho empieza a alargar; úsalo corto para mantener horizontalidad.",
      "verdict": "neutral"
    }
  ]
};
