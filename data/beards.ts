// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { BeardReco } from "@/types/face-recommendations";

/** Barba por forma de rostro (recomendaciones masculinas). */
export const BEARDS: Record<FaceShapeId, BeardReco> = {
  "ovalo": {
    "summary": "Tu mandíbula suave y proporción equilibrada dan libertad casi total: la barba es más cuestión de estilo que de corrección. El único cuidado es no alargar de más un rostro que ya mide 1.5x, así que evita el pico largo bajo el mentón.",
    "styles": [
      {
        "name": "Barba corta perfilada",
        "reason": "Define la mandíbula suave dándole un toque de estructura sin sumar largo vertical; acompaña el óvalo sin desequilibrarlo",
        "verdict": "reco"
      },
      {
        "name": "Barba media uniforme",
        "reason": "El largo parejo ensancha ligeramente la zona baja y contrarresta cualquier tendencia a alargar, manteniendo el reparto armónico del rostro",
        "verdict": "reco"
      },
      {
        "name": "Barba en punta larga (goatee alargado)",
        "reason": "Prolonga el mentón y estira el eje vertical justo en la dirección que rompe el 1.5x del óvalo; concentra el volumen abajo en lugar de repartirlo",
        "verdict": "evitar"
      }
    ],
    "length": "Corta a media; evita el exceso de largo bajo el mentón para no alargar el eje vertical.",
    "volume": "Uniforme y equilibrado, sin cargar el volumen en la punta de la barbilla.",
    "zones": "Mantén densidad pareja en mejillas y mandíbula; recorta la zona del mentón para que no proyecte hacia abajo."
  },
  "redondo": {
    "summary": "La barba es tu mejor aliada para dibujar el mentón que el rostro redondo tiene difuminado: busca longitud en el mentón y recorte en las mejillas para crear una V y alargar.",
    "styles": [
      {
        "name": "Barba en punta / perilla extendida",
        "reason": "Acumula pelo en el centro del mentón y lo afila hacia abajo, creando el vértice angular que estira el óvalo y contrarresta la curva de la mandíbula.",
        "verdict": "reco"
      },
      {
        "name": "Barba corta degradada (más corta en mejillas, más larga abajo)",
        "reason": "El degradado adelgaza los laterales llenos y deja peso en la base, esculpiendo ángulo sin ensanchar.",
        "verdict": "reco"
      },
      {
        "name": "Barba redonda tupida y uniforme",
        "reason": "Al mantener el mismo largo en mejillas y mentón envuelve el rostro en un círculo de pelo y amplifica la redondez.",
        "verdict": "evitar"
      }
    ],
    "length": "Media a media-larga en el mentón (para ganar longitud vertical), corta en las mejillas.",
    "volume": "Contenido en los laterales, concentrado en la barbilla; nada de abombar las mejillas.",
    "zones": "Vacía y difumina las mejillas y los pómulos; deja crecer y define la línea del mentón y el borde mandibular para marcar ángulo."
  },
  "cuadrado": {
    "summary": "En un rostro cuadrado la barba trabaja mejor cuando redondea la base del mentón en lugar de cuadrarla: buscamos suavizar el ángulo, no dibujarlo con líneas rectas.",
    "styles": [
      {
        "name": "Barba redondeada en el mentón",
        "reason": "Dejar algo más de largo bajo la barbilla y recortarla en curva convierte la esquina mandibular angular en una línea suave, que es el balance por oposición que pide el cuadrado.",
        "verdict": "reco"
      },
      {
        "name": "Barba corta difuminada (degradado)",
        "reason": "El fundido en las mejillas evita el borde recto que remarcaría el lado plano del rostro y deja que la mandíbula se lea más envuelta.",
        "verdict": "neutral"
      },
      {
        "name": "Barba candado/perilla cerrada muy geométrica",
        "reason": "Sus líneas rectas y esquinas definidas repiten la angularidad del mentón cuadrado en vez de contrarrestarla, reforzando el ángulo.",
        "verdict": "evitar"
      }
    ],
    "length": "Media en el mentón (algo más larga abajo para alargar), corta en las mejillas.",
    "volume": "Volumen concentrado en la punta del mentón para alargar el óvalo; mejillas pegadas para no ensanchar.",
    "zones": "Redondear la línea inferior del mentón; suavizar (no marcar con navaja recta) el contorno de la mejilla y el ángulo de la mandíbula."
  },
  "corazon": {
    "summary": "La barba es tu mejor aliada: es el único recurso que añade masa real justo en el tercio inferior estrecho, equilibrando de frente a mentón. Busca ancho en la línea de la mandíbula y en el mentón puntiagudo.",
    "styles": [
      {
        "name": "Barba tupida con densidad en mentón y mandíbula",
        "reason": "Rellena y ensancha la zona más estrecha del rostro, creando la anchura inferior que compensa la frente dominante.",
        "verdict": "reco"
      },
      {
        "name": "Barba cuadrada / boxed beard con línea recta abajo",
        "reason": "El borde inferior recto contrarresta la punta del mentón y da al tercio bajo una base ancha y estable.",
        "verdict": "reco"
      },
      {
        "name": "Perilla o candado estrecho aislado",
        "reason": "Concentra el pelo en la punta del mentón y alarga la cara hacia abajo en punta, subrayando justo el rasgo que buscas suavizar.",
        "verdict": "evitar"
      }
    ],
    "length": "Media a media-larga en mentón y mandíbula; deja crecer donde falta anchura y recorta pómulos para no estrechar el óvalo.",
    "volume": "Máximo en la línea mandibular y el mentón; mínimo en las mejillas altas para no alargar.",
    "zones": "Prioriza densidad en mandíbula y borde inferior; evita concentrar todo en la punta del mentón."
  },
  "diamante": {
    "summary": "La barba es tu mejor aliada: al construir masa en un maxilar estrecho, da el cuerpo que le falta a la base del rombo y equilibra los pómulos anchos y prominentes.",
    "styles": [
      {
        "name": "Barba completa con densidad en el mentón",
        "reason": "Rellena y ensancha la mandíbula estrecha, creando una base más ancha que compensa el pómulo prominente.",
        "verdict": "reco"
      },
      {
        "name": "Barba cuadrada con perfil recto abajo",
        "reason": "Un borde inferior recto añade anchura y estructura al maxilar, contrarrestando la forma que se cierra en punta.",
        "verdict": "reco"
      },
      {
        "name": "Perilla estrecha o candado fino",
        "reason": "Concentra el pelo en el centro y afila más el mentón, acentuando lo angosto de tu tercio inferior.",
        "verdict": "evitar"
      }
    ],
    "length": "Media a algo larga en los lados del mentón y la mandíbula; corta en las mejillas para no invadir ni ensanchar el pómulo.",
    "volume": "Más volumen en la línea mandibular y el mentón; controlado y degradado hacia las patillas para no sumar ancho en la zona alta.",
    "zones": "Densifica maxilar y mentón para dar base; mantén las mejillas limpias o muy cortas para no acercar pelo al pómulo ancho."
  },
  "alargado": {
    "summary": "En un rostro alargado la barba trabaja a tu favor si suma anchura en las mejillas y mantiene corta la zona del mentón: quieres crecer a lo ancho, no a lo largo. El objetivo es acortar la barbilla, no prolongarla.",
    "styles": [
      {
        "name": "Barba completa cuadrada corta",
        "reason": "Rellena las mejillas y da un borde inferior recto y ancho que ensancha el tercio inferior, cortando la sensación de largo del rostro.",
        "verdict": "reco"
      },
      {
        "name": "Barba con más densidad en mejillas y mentón corto",
        "reason": "Al llevar volumen a los lados y mantener el mentón apurado evitas alargar la barbilla, que es lo que estiraría más la cara.",
        "verdict": "reco"
      },
      {
        "name": "Perilla o barba de chivo alargada",
        "reason": "Concentra pelo en punta bajo el mentón y estira el eje vertical, acentuando justamente el largo que buscas compensar.",
        "verdict": "evitar"
      }
    ],
    "length": "Corta a media en mejillas, muy apurada en el mentón; nada de puntas colgantes.",
    "volume": "Volumen lateral en las mejillas para ganar anchura; plano y contenido por debajo de la barbilla.",
    "zones": "Prioriza mejillas y patillas conectadas; controla y recorta la zona del mentón para no sumar verticalidad."
  }
};
