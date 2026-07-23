// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { StyleItem } from "@/types/face-recommendations";

/** Sombreros por forma de rostro. */
export const HATS: Record<FaceShapeId, StyleItem[]> = {
  "ovalo": [
    {
      "name": "Fedora de ala media",
      "reason": "El ala horizontal equilibra el eje largo del óvalo y su versatilidad encaja con un rostro que admite casi todo; ni aplana ni estira",
      "verdict": "reco"
    },
    {
      "name": "Pamela / ala ancha",
      "reason": "La horizontal amplia contrarresta el largo del rostro y enmarca los pómulos; es de las formas que mejor luce el óvalo por su proporción base",
      "verdict": "reco"
    },
    {
      "name": "Boina ladeada",
      "reason": "Aporta un ángulo asimétrico que juega con el contorno armónico sin sumar altura; deja la frente parcialmente despejada manteniendo el balance",
      "verdict": "reco"
    },
    {
      "name": "Gorro alto tipo beanie muy estirado",
      "reason": "Prolonga la coronilla y alarga el eje vertical del rostro, empujando el óvalo hacia lo estirado; llévalo recogido a la altura de la frente",
      "verdict": "neutral"
    }
  ],
  "redondo": [
    {
      "name": "Fedora o sombrero de copa alta con ala",
      "reason": "La altura de la copa suma verticalidad y las líneas angulares del ala rompen la curva del rostro.",
      "verdict": "reco"
    },
    {
      "name": "Gorro beanie llevado alto (sin pegar)",
      "reason": "Dejar volumen y altura en la coronilla alarga la silueta en vez de aplanarla.",
      "verdict": "reco"
    },
    {
      "name": "Fedora de ala media asimétrica",
      "reason": "El ala inclinada crea una diagonal que aporta ángulo y dinamismo, contrastando con lo redondo.",
      "verdict": "reco"
    },
    {
      "name": "Boina ladeada",
      "reason": "Bien inclinada suma asimetría y altura; mal puesta, plana sobre la frente, tiende a ensanchar.",
      "verdict": "neutral"
    },
    {
      "name": "Bombín redondo (bowler) ajustado",
      "reason": "Su cúpula curva y baja repite la forma esférica del rostro y lo acorta.",
      "verdict": "evitar"
    }
  ],
  "cuadrado": [
    {
      "name": "Fedora de ala curva",
      "reason": "El ala ondulada y la copa redondeada aportan curvas y algo de altura, contrarrestando los ángulos de frente y mandíbula.",
      "verdict": "reco"
    },
    {
      "name": "Boina ladeada",
      "reason": "Su forma blanda y la caída diagonal introducen asimetría y curva que rompen la simetría recta del cuadrado.",
      "verdict": "reco"
    },
    {
      "name": "Sombrero de ala flexible (floppy)",
      "reason": "El ala amplia y ondulante enmarca el rostro con líneas suaves y desvía la atención de la línea mandibular.",
      "verdict": "reco"
    },
    {
      "name": "Gorra plana o con visera recta y rígida",
      "reason": "Su borde horizontal firme suma otra línea recta sobre la frente ancha, endureciendo el conjunto angular.",
      "verdict": "evitar"
    }
  ],
  "corazon": [
    {
      "name": "Fedora de ala media",
      "reason": "El ala horizontal equilibra proyectando anchura a los lados; llevada ligeramente hacia atrás no aplasta ni recarga la frente.",
      "verdict": "reco"
    },
    {
      "name": "Pamela / ala ancha",
      "reason": "El ala ancha reparte peso hacia los lados a la altura del mentón y resta protagonismo a la frente amplia.",
      "verdict": "reco"
    },
    {
      "name": "Boina ladeada",
      "reason": "Rompe la simetría de la frente ancha con una caída asimétrica en lugar de coronarla de volumen.",
      "verdict": "reco"
    },
    {
      "name": "Gorro beanie subido y con volumen en la coronilla",
      "reason": "Suma altura y masa sobre la frente ancha, reforzando el peso del tercio superior.",
      "verdict": "evitar"
    }
  ],
  "diamante": [
    {
      "name": "Ala ancha / pamela",
      "reason": "El ala amplia crea una línea horizontal arriba que ensancha visualmente la frente estrecha.",
      "verdict": "reco"
    },
    {
      "name": "Boina ladeada con volumen",
      "reason": "Aporta cuerpo y anchura en la zona de frente y sienes, tu punto más angosto.",
      "verdict": "reco"
    },
    {
      "name": "Fedora de ala media",
      "reason": "El ala suma algo de ancho arriba mientras la copa no alarga en exceso, equilibrando sin exagerar.",
      "verdict": "reco"
    },
    {
      "name": "Beanie ceñido o gorro alto",
      "reason": "Ciñe las sienes y alarga la cabeza, estrechando aún más la frente y dejando el pómulo protagonista.",
      "verdict": "evitar"
    }
  ],
  "alargado": [
    {
      "name": "Fedora de ala ancha",
      "reason": "El ala horizontal amplia genera una línea que cruza y ensancha, y la copa moderada no suma exceso de altura.",
      "verdict": "reco"
    },
    {
      "name": "Boina ladeada",
      "reason": "Su volumen suave y bajo se posa a lo ancho sin estirar hacia arriba, aportando anchura lateral favorable.",
      "verdict": "reco"
    },
    {
      "name": "Sombrero de copa alta / gorro tipo beanie estirado",
      "reason": "La altura vertical prolonga la línea de la cabeza y refuerza la sensación de largo del rostro.",
      "verdict": "evitar"
    },
    {
      "name": "Capelina de ala baja",
      "reason": "El ala ancha da horizontalidad excelente; cuida que no tape tanto que oculte los pómulos, por eso queda como muy favorable con matiz.",
      "verdict": "reco"
    }
  ]
};
