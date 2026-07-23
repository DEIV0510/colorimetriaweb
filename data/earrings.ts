// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { StyleItem } from "@/types/face-recommendations";

/** Aretes: largos, cortos, geométricos, redondos, colgantes. */
export const EARRINGS: Record<FaceShapeId, StyleItem[]> = {
  "ovalo": [
    {
      "name": "Largos rectos (barras / lineales)",
      "reason": "Añaden verticalidad que un óvalo ya alargado no necesita; si te gustan, mejor cortos para no estirar más el eje",
      "verdict": "neutral"
    },
    {
      "name": "Cortos tipo botón",
      "reason": "No interfieren con la proporción equilibrada y dejan que el contorno armónico hable por sí solo; opción segura para esta forma",
      "verdict": "reco"
    },
    {
      "name": "Geométricos (triángulo, rombo)",
      "reason": "El ángulo aporta un contraste interesante frente a la curva suave del óvalo sin desequilibrar, siempre que sean de tamaño contenido",
      "verdict": "reco"
    },
    {
      "name": "Redondos / aros medianos",
      "reason": "Su curva ensancha ligeramente a la altura de la mandíbula y refuerza la horizontal, ideal para conservar el reparto parejo del rostro",
      "verdict": "reco"
    },
    {
      "name": "Colgantes con volumen a media altura",
      "reason": "Concentran atención en la franja de los pómulos, tu punto más ancho; evita los muy largos y finos que alargarían el eje",
      "verdict": "reco"
    }
  ],
  "redondo": [
    {
      "name": "Colgantes largos y rectos (barras, lágrimas alargadas)",
      "reason": "Trazan una línea vertical descendente que estira el rostro y aleja la atención del ancho de las mejillas.",
      "verdict": "reco"
    },
    {
      "name": "Geométricos angulares (triángulos, rombos, kite)",
      "reason": "Los vértices y aristas aportan la definición que la cara sin ángulos necesita.",
      "verdict": "reco"
    },
    {
      "name": "Threaders o largos finos tipo cadena",
      "reason": "Alargan sin sumar volumen lateral, reforzando la verticalidad.",
      "verdict": "reco"
    },
    {
      "name": "Ear cuff / trepador ascendente",
      "reason": "Dibuja una diagonal hacia arriba que eleva la mirada; efecto neutro-positivo según el peinado.",
      "verdict": "neutral"
    },
    {
      "name": "Botón pequeño discreto",
      "reason": "No desequilibra pero tampoco corrige: aporta poco al alargamiento buscado.",
      "verdict": "neutral"
    },
    {
      "name": "Argollas grandes y redondas",
      "reason": "El círculo junto a la mejilla llena repite la curva del rostro y lo ensancha.",
      "verdict": "evitar"
    }
  ],
  "cuadrado": [
    {
      "name": "Aros redondos (créoles)",
      "reason": "El círculo colgando junto a la mandíbula introduce curva justo en la zona más angular y la disuelve por contraste.",
      "verdict": "reco"
    },
    {
      "name": "Colgantes con gota u óvalo",
      "reason": "El movimiento y la forma curva alargan la línea del rostro y suavizan la esquina mandibular en lugar de marcarla.",
      "verdict": "reco"
    },
    {
      "name": "Largos que caen en curva",
      "reason": "Aportan verticalidad (algo de altura/alargamiento) y bordes suaves, ambos objetivos del balance del cuadrado.",
      "verdict": "reco"
    },
    {
      "name": "Redondos tipo botón pequeño",
      "reason": "Discretos y curvos, no compiten ni añaden ángulos; funcionan como acento neutro.",
      "verdict": "neutral"
    },
    {
      "name": "Geométricos angulares (cuadrados, triángulos, barras rectas)",
      "reason": "Sus esquinas repiten y subrayan la angularidad de la mandíbula, reforzando la línea que queremos ablandar.",
      "verdict": "evitar"
    }
  ],
  "corazon": [
    {
      "name": "Colgantes largos tipo lágrima o gota",
      "reason": "Su volumen desciende hacia la mandíbula y el mentón, llevando peso visual al tercio inferior estrecho.",
      "verdict": "reco"
    },
    {
      "name": "Redondos y aros medianos",
      "reason": "La curva ancha a la altura del maxilar ensancha ópticamente la zona afilada de la mandíbula.",
      "verdict": "reco"
    },
    {
      "name": "Chandelier que se abren abajo",
      "reason": "Terminan más anchos en su base, sumando cuerpo justo donde el rostro se estrecha en punta.",
      "verdict": "reco"
    },
    {
      "name": "Trepadores / ear climbers que suben por la oreja",
      "reason": "Concentran el brillo arriba, cerca de las sienes anchas, sin aportar nada al mentón fino.",
      "verdict": "evitar"
    },
    {
      "name": "Geométricos invertidos (triángulo con punta hacia abajo)",
      "reason": "Repiten y refuerzan la forma en punta del rostro en lugar de contrarrestarla; mejor los que se ensanchan hacia abajo.",
      "verdict": "evitar"
    }
  ],
  "diamante": [
    {
      "name": "Colgantes en lágrima o pera (anchos abajo)",
      "reason": "Se ensanchan en la parte inferior y aportan cuerpo a la altura de la mandíbula estrecha, rellenando el tercio bajo.",
      "verdict": "reco"
    },
    {
      "name": "Largos que caen hacia el maxilar",
      "reason": "Dirigen volumen y mirada hacia el tercio inferior, dándole presencia a tu zona más angosta.",
      "verdict": "reco"
    },
    {
      "name": "Redondos medianos (aros)",
      "reason": "Suavizan la angulosidad; elige los que caigan hacia el mentón y no queden justo a la altura del pómulo.",
      "verdict": "neutral"
    },
    {
      "name": "Botón o cortos pegados al lóbulo",
      "reason": "Discretos y seguros; no corrigen el desequilibrio pero tampoco marcan el pómulo prominente.",
      "verdict": "neutral"
    },
    {
      "name": "Geométricos anchos a media cara",
      "reason": "Sus picos y su ancho a la altura del pómulo repiten y refuerzan la prominencia que buscas calmar.",
      "verdict": "evitar"
    }
  ],
  "alargado": [
    {
      "name": "Botón o topo redondo grande",
      "reason": "Aporta un punto de anchura y curva a la altura del lóbulo sin sumar longitud vertical, ideal para una cara larga.",
      "verdict": "reco"
    },
    {
      "name": "Aro mediano-grande",
      "reason": "El círculo añade líneas horizontales y volumen lateral junto a la mandíbula, ensanchando el tercio inferior.",
      "verdict": "reco"
    },
    {
      "name": "Colgante largo lineal",
      "reason": "Las gotas verticales prolongan la línea del rostro hacia abajo y refuerzan la sensación de largo que buscas equilibrar.",
      "verdict": "evitar"
    },
    {
      "name": "Geométrico ancho (cuadrado/triangular)",
      "reason": "Las formas que crecen a lo ancho introducen horizontalidad; funcionan bien siempre que no sean alargadas.",
      "verdict": "reco"
    },
    {
      "name": "Trepador corto pegado al lóbulo",
      "reason": "Discreto y sin caída; neutral porque no desequilibra pero tampoco aporta la anchura que más te favorece.",
      "verdict": "neutral"
    }
  ]
};
