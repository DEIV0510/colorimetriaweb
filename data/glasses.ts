// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { TieredReco } from "@/types/face-recommendations";

/** Gafas por forma de rostro: ideales / aceptables / menos recomendadas. */
export const FACE_GLASSES: Record<FaceShapeId, TieredReco> = {
  "ovalo": {
    "great": [
      {
        "name": "Montura rectangular de esquinas suaves",
        "reason": "Aporta líneas horizontales que compensan la ligera predominancia del largo y su suavidad respeta la mandíbula redondeada; ni endurece ni alarga",
        "verdict": "reco"
      },
      {
        "name": "Montura cuadrada",
        "reason": "El ángulo introduce estructura que contrasta con la curva del óvalo sin chocar, y su anchura acompaña los pómulos como punto más ancho",
        "verdict": "reco"
      },
      {
        "name": "Wayfarer / pantos equilibrado",
        "reason": "Su proporción medida encaja con un rostro que no pide corrección; el ancho debe igualar el de tu cara para conservar la simetría natural",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Montura redonda",
        "reason": "Funciona por afinidad con las curvas del óvalo, pero al no aportar contraste puede pasar desapercibida; elígela de tamaño medio para no acentuar el eje vertical",
        "verdict": "neutral"
      },
      {
        "name": "Cat-eye discreto",
        "reason": "Levanta el foco hacia los pómulos, lo cual favorece; solo cuida que el alzado no sea excesivo para no romper el reparto parejo",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Montura estrecha y muy alargada",
        "reason": "Refuerza el eje vertical y empuja el óvalo hacia lo estirado, que es su único desequilibrio posible",
        "verdict": "evitar"
      },
      {
        "name": "Montura sobredimensionada que cubre del pómulo al mentón",
        "reason": "Al ocupar demasiada altura tapa la zona ancha natural y acorta visualmente el rostro rompiendo la proporción 1.5x",
        "verdict": "evitar"
      }
    ]
  },
  "redondo": {
    "great": [
      {
        "name": "Montura rectangular / angular",
        "reason": "Los cantos rectos y las esquinas marcadas introducen los ángulos ausentes y su eje horizontal ancho corta la curva de las mejillas.",
        "verdict": "reco"
      },
      {
        "name": "Wayfarer / browline",
        "reason": "La barra superior fuerte añade estructura en la parte alta y sube el punto focal, dando altura al rostro.",
        "verdict": "reco"
      },
      {
        "name": "Montura geométrica (hexagonal, cat-eye angular)",
        "reason": "Las aristas y los vértices ascendentes aportan definición y elevan las líneas hacia las sienes, alargando.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Cuadrada de esquinas ligeramente suaves",
        "reason": "Mantiene el ángulo que equilibra la redondez pero suaviza para no endurecer en exceso; buen término medio.",
        "verdict": "neutral"
      },
      {
        "name": "Aviador",
        "reason": "Su forma de gota estira hacia abajo y afina, aunque su curva inferior pide una montura no demasiado grande para no repetir lo redondo.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Montura redonda tipo Lennon",
        "reason": "Repite exactamente la curva del rostro y refuerza la ausencia de ángulos, redondeando aún más.",
        "verdict": "evitar"
      },
      {
        "name": "Montura ovalada grande",
        "reason": "Sus bordes curvos y su anchura acompañan la línea de las mejillas llenas en lugar de contrarrestarla.",
        "verdict": "evitar"
      }
    ]
  },
  "cuadrado": {
    "great": [
      {
        "name": "Montura redonda",
        "reason": "La curva completa del aro se opone directamente a los ángulos rectos de la frente y la mandíbula, y es el contraste más eficaz para suavizar un rostro cuadrado.",
        "verdict": "reco"
      },
      {
        "name": "Montura ovalada",
        "reason": "Su forma alargada y sin esquinas rebaja la sensación de anchura pareja y aporta la curvatura que el contorno recto no tiene.",
        "verdict": "reco"
      },
      {
        "name": "Estilo Pantos (redonda con puente en gota)",
        "reason": "Suma curva y un puente que atrae la mirada hacia el centro y hacia arriba, alejándola de la línea mandibular ancha.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Montura al aire o semi al aire",
        "reason": "Al desaparecer el borde inferior se elimina una línea horizontal que competiría con la mandíbula; conviene que la forma tienda a curva.",
        "verdict": "neutral"
      },
      {
        "name": "Cat-eye suave",
        "reason": "El alza hacia las sienes eleva el foco, aunque si las esquinas son muy marcadas conviene versiones redondeadas para no sumar geometría.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Montura cuadrada o rectangular de ángulos vivos",
        "reason": "Repite exactamente la geometría del rostro; los ángulos de la montura se alinean con los de la mandíbula y multiplican la sensación cuadrada.",
        "verdict": "evitar"
      },
      {
        "name": "Montura tipo browline gruesa y recta",
        "reason": "Su barra superior horizontal y marcada añade otra línea recta a una frente ya ancha, endureciendo el conjunto.",
        "verdict": "evitar"
      }
    ]
  },
  "corazon": {
    "great": [
      {
        "name": "Monturas al aire / rimless en la parte baja",
        "reason": "Sin marco inferior, no cortan ni recargan la mitad superior y dejan que la mirada baje hacia el mentón.",
        "verdict": "reco"
      },
      {
        "name": "Montura con base más ancha que la ceja (tipo aviador invertido)",
        "reason": "El peso visual del marco en la parte inferior aporta anchura a media cara, alejándola de la frente.",
        "verdict": "reco"
      },
      {
        "name": "Ovaladas o redondas suaves",
        "reason": "Sus curvas dulcifican los ángulos de las sienes anchas sin sumar líneas horizontales arriba.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Montura fina metálica rectangular",
        "reason": "Neutral: no recarga la frente, pero conviene que no sea más ancha que las sienes para no ensanchar arriba.",
        "verdict": "neutral"
      },
      {
        "name": "Pantos ligeras",
        "reason": "Funcionan por su parte baja redondeada; vigila que el puente no quede demasiado alto marcando la frente.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Cat-eye marcada de puntas altas",
        "reason": "Levanta el foco hacia las sienes y ensancha la parte superior, reforzando la frente que ya domina.",
        "verdict": "evitar"
      },
      {
        "name": "Monturas pesadas tipo browline (barra superior gruesa)",
        "reason": "La ceja gruesa del marco añade peso justo en la frente ancha, cargando aún más el tercio superior.",
        "verdict": "evitar"
      }
    ]
  },
  "diamante": {
    "great": [
      {
        "name": "Montura browline (Clubmaster)",
        "reason": "Concentra peso y color en la ceja, ensanchando y dando presencia a tu frente estrecha, que es el punto clave a abrir.",
        "verdict": "reco"
      },
      {
        "name": "Ojo de gato",
        "reason": "Los extremos superiores que suben y se abren llevan anchura a la línea de las cejas y despegan la mirada del pómulo.",
        "verdict": "reco"
      },
      {
        "name": "Detalle o color en la parte superior",
        "reason": "Todo el interés visual en la franja alta compensa la frente angosta sin añadir peso sobre el pómulo prominente.",
        "verdict": "reco"
      },
      {
        "name": "Ovaladas suaves",
        "reason": "Sus curvas suavizan la angulosidad del pómulo sin trazar líneas horizontales en tu zona más ancha.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Redondas medianas",
        "reason": "Rompen la angulosidad del rombo; conviene que no bajen ni se ensanchen a la altura del pómulo.",
        "verdict": "neutral"
      },
      {
        "name": "Semi al aire (peso arriba)",
        "reason": "Aligeran la mitad baja y dejan el protagonismo en la ceja, siempre que la línea superior quede bien definida.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Monturas anchas que llegan al pómulo",
        "reason": "Trazan una línea horizontal justo en tu punto más prominente y ensanchan aún más la zona media.",
        "verdict": "evitar"
      },
      {
        "name": "Rectangulares estrechas y angulosas",
        "reason": "Repiten y subrayan la angulosidad del rombo sin aportar el ancho que la frente necesita.",
        "verdict": "evitar"
      },
      {
        "name": "Sin montura (rimless) minimalistas",
        "reason": "Al no aportar estructura arriba, dejan la frente estrecha sin apoyo y todo el peso visual sobre el pómulo.",
        "verdict": "evitar"
      }
    ]
  },
  "alargado": {
    "great": [
      {
        "name": "Monturas anchas rectangulares",
        "reason": "Su ancho marcado cruza el rostro con una línea horizontal fuerte y aporta anchura a media altura, equilibrando el largo.",
        "verdict": "reco"
      },
      {
        "name": "Montura con detalle o color en las sienes",
        "reason": "Atrae la mirada hacia los lados del rostro, ampliando visualmente la zona más estrecha de una cara larga.",
        "verdict": "reco"
      },
      {
        "name": "Estilo browline (parte superior marcada)",
        "reason": "La barra superior gruesa crea un corte horizontal alto que acorta ópticamente el tercio superior del rostro.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Redondas medianas",
        "reason": "La curva suaviza y rompe la verticalidad; funcionan si son suficientemente anchas para no quedar pequeñas en un rostro largo.",
        "verdict": "neutral"
      },
      {
        "name": "Wayfarer clásica",
        "reason": "Aporta cuerpo horizontal decente; neutral porque según la proporción puede quedarse algo justa de ancho para tu cara.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Monturas estrechas y altas",
        "reason": "Una lente más alta que ancha repite y alarga el eje vertical del rostro, acentuando el rasgo en lugar de compensarlo.",
        "verdict": "evitar"
      },
      {
        "name": "Sin montura (rimless) pequeñas",
        "reason": "Al no aportar línea horizontal ni anchura, dejan el rostro sin el contrapeso lateral que necesita.",
        "verdict": "evitar"
      }
    ]
  }
};
