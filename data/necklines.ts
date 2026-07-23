// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { StyleItem } from "@/types/face-recommendations";

/** Escotes (V, redondo, cuadrado, barco, halter, corazón) y cómo equilibran. */
export const NECKLINES: Record<FaceShapeId, StyleItem[]> = {
  "ovalo": [
    {
      "name": "Escote en V",
      "reason": "La V repite y suaviza el largo del óvalo sin exagerarlo cuando es moderada; si es muy profunda alarga de más, así que mantenla contenida",
      "verdict": "neutral"
    },
    {
      "name": "Escote redondo",
      "reason": "Su curva hace eco de la suavidad de la mandíbula y aporta una horizontal amable que equilibra el eje vertical",
      "verdict": "reco"
    },
    {
      "name": "Escote cuadrado",
      "reason": "Las líneas horizontales de su base compensan el largo del rostro y su estructura contrasta con la curva del óvalo sin endurecer",
      "verdict": "reco"
    },
    {
      "name": "Escote barco",
      "reason": "Es el más horizontal de todos: ensancha ópticamente a la altura de los hombros y contrarresta cualquier tendencia a alargar",
      "verdict": "reco"
    },
    {
      "name": "Halter",
      "reason": "Sube las líneas hacia el cuello formando una V invertida que estrecha y alarga el conjunto rostro-escote, restando al reparto parejo del óvalo",
      "verdict": "evitar"
    },
    {
      "name": "Escote corazón",
      "reason": "Sus curvas dialogan bien con el óvalo y aporta suavidad; mantén el pico central discreto para que no añada verticalidad",
      "verdict": "neutral"
    }
  ],
  "redondo": [
    {
      "name": "Escote en V",
      "reason": "El vértice hacia abajo abre una línea vertical que alarga el rostro y el cuello, el mejor aliado del contorno redondo.",
      "verdict": "reco"
    },
    {
      "name": "Halter",
      "reason": "Sube en diagonal hacia el cuello y despeja los hombros, estilizando y aportando verticalidad.",
      "verdict": "reco"
    },
    {
      "name": "Escote en corazón",
      "reason": "Combina algo de curva con un pico central que alarga; equilibrio suave entre ángulo y dulzura.",
      "verdict": "reco"
    },
    {
      "name": "Escote cuadrado",
      "reason": "Sus esquinas rectas aportan el ángulo que falta; solo cuida que no sea demasiado ancho para no acentuar mejillas.",
      "verdict": "neutral"
    },
    {
      "name": "Escote barco",
      "reason": "Ensancha la zona superior y repite la horizontalidad; refuerza justo la anchura que el rostro redondo ya tiene de sobra.",
      "verdict": "evitar"
    },
    {
      "name": "Escote redondo cerrado",
      "reason": "La curva alta junto al cuello hace eco de la redondez facial y acorta, sumando en lugar de restar.",
      "verdict": "evitar"
    }
  ],
  "cuadrado": [
    {
      "name": "Escote en V",
      "reason": "La diagonal abierta rompe la horizontalidad de la línea mandibular y alarga el rostro, suavizando la sensación cuadrada por oposición.",
      "verdict": "reco"
    },
    {
      "name": "Escote redondo",
      "reason": "Su curva repite la suavidad que buscamos y equilibra los ángulos rectos del contorno superior.",
      "verdict": "reco"
    },
    {
      "name": "Escote corazón",
      "reason": "Combina curva y una ligera apertura en punta que estiliza verticalmente sin añadir líneas rectas.",
      "verdict": "reco"
    },
    {
      "name": "Escote halter",
      "reason": "Sube las líneas hacia el cuello y afina los hombros, restando anchura a la zona que iguala con la mandíbula; mejor si el borde es curvo.",
      "verdict": "neutral"
    },
    {
      "name": "Escote barco",
      "reason": "Corre paralelo a la mandíbula y subraya su anchura y sus ángulos, lo contrario de la curva que buscamos aportar.",
      "verdict": "evitar"
    },
    {
      "name": "Escote cuadrado",
      "reason": "Reproduce literalmente los ángulos rectos del rostro a la altura del pecho, duplicando la geometría que intentamos suavizar.",
      "verdict": "evitar"
    }
  ],
  "corazon": [
    {
      "name": "Escote barco",
      "reason": "Ensancha los hombros y la base del rostro: el contrapunto exacto a una frente ancha sobre un mentón fino.",
      "verdict": "reco"
    },
    {
      "name": "Escote cuadrado",
      "reason": "Los ángulos horizontales aportan estructura y anchura al tercio inferior, equilibrando la punta del mentón.",
      "verdict": "reco"
    },
    {
      "name": "Escote halter",
      "reason": "Al recoger la tela hacia el cuello afina el tercio inferior, justo la zona que el corazón necesita ensanchar; acentúa el contraste con la frente.",
      "verdict": "evitar"
    },
    {
      "name": "Escote redondo",
      "reason": "Su curva suave acompaña sin recargar; neutral porque ni corrige ni acentúa el desequilibrio.",
      "verdict": "neutral"
    },
    {
      "name": "Escote corazón",
      "reason": "Su forma lobulada repite el contorno del rostro en corazón; funciona solo si es amplio y no demasiado marcado.",
      "verdict": "neutral"
    },
    {
      "name": "Escote en V profundo",
      "reason": "Dibuja una punta descendente que refuerza el triángulo invertido y alarga hacia el mentón fino.",
      "verdict": "evitar"
    }
  ],
  "diamante": [
    {
      "name": "Barco",
      "reason": "Extiende la línea de hombros y crea anchura abajo que equilibra tanto la frente como el maxilar estrechos.",
      "verdict": "reco"
    },
    {
      "name": "Redondo",
      "reason": "Su curva amplia aporta suavidad y algo de ancho al tercio inferior sin generar puntas angulosas.",
      "verdict": "reco"
    },
    {
      "name": "Cuadrado",
      "reason": "Sus líneas horizontales dan estructura y anchura al maxilar estrecho, compensando la base afilada.",
      "verdict": "reco"
    },
    {
      "name": "Corazón / sweetheart",
      "reason": "La curva superior suaviza; su punto central puede acercar la mirada al pómulo, úsalo con equilibrio.",
      "verdict": "neutral"
    },
    {
      "name": "V profunda",
      "reason": "Alarga y afina; estiliza pero no aporta el ancho que tu mandíbula estrecha necesita para equilibrar.",
      "verdict": "neutral"
    },
    {
      "name": "Halter",
      "reason": "Cierra los hombros hacia el cuello y estrecha la parte alta, dejando el pómulo como único punto ancho.",
      "verdict": "evitar"
    }
  ],
  "alargado": [
    {
      "name": "Escote barco",
      "reason": "Su línea casi horizontal de hombro a hombro es la máxima aliada de una cara larga: aporta anchura visual y acorta el eje vertical.",
      "verdict": "reco"
    },
    {
      "name": "Escote redondo",
      "reason": "La curva amplia repite una horizontal suave bajo el cuello que ensancha y equilibra la verticalidad del rostro.",
      "verdict": "reco"
    },
    {
      "name": "Escote cuadrado",
      "reason": "Los ángulos y la base horizontal crean un marco ancho que contrarresta el largo; muy favorecedor.",
      "verdict": "reco"
    },
    {
      "name": "Escote halter",
      "reason": "Converge hacia el cuello y forma líneas que suben en punta, estirando el eje vertical y estrechando los hombros.",
      "verdict": "evitar"
    },
    {
      "name": "Escote en V profundo",
      "reason": "La punta descendente prolonga la línea del rostro hacia abajo, acentuando el largo que buscas equilibrar.",
      "verdict": "evitar"
    },
    {
      "name": "Escote corazón",
      "reason": "Combina algo de curva y una ligera V; neutral porque suaviza pero su punta central puede alargar si es muy pronunciada.",
      "verdict": "neutral"
    }
  ]
};
