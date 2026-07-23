import type { FaceShapeId } from "@/types/face-shape";
import type { GlassesVariant, NecklineVariant } from "@/components/face-shape/FaceSilhouette";

/**
 * Datos de la comparación "recomendado vs poco recomendable", mapeados a las
 * variantes concretas que sabe dibujar la silueta. Se autoedita aquí (y no desde
 * las recomendaciones en texto libre) porque la comparación necesita una forma
 * exacta que el SVG pueda representar.
 */

export interface Opposition<V> {
  reco: V;
  avoid: V;
  reason: string;
}

export interface ShapeComparison {
  glasses: Opposition<GlassesVariant>;
  neckline: Opposition<NecklineVariant>;
}

export const FACE_COMPARISONS: Record<FaceShapeId, ShapeComparison> = {
  ovalo: {
    glasses: {
      reco: "rectangulares",
      avoid: "ojo-de-gato",
      reason:
        "Con tu equilibrio casi cualquier montura funciona; una de proporción media respeta tu armonía, mientras que una muy extrema es lo único que podría desplazarla.",
    },
    neckline: {
      reco: "redondo",
      avoid: "barco",
      reason:
        "Te sienta casi cualquier escote; el redondo mantiene la proporción y solo uno muy ancho restaría algo de tu longitud natural.",
    },
  },
  redondo: {
    glasses: {
      reco: "rectangulares",
      avoid: "redondas",
      reason:
        "Las monturas angulares aportan la definición que a tu rostro le falta; las redondas repiten la curva de tus mejillas y lo redondean aún más.",
    },
    neckline: {
      reco: "v",
      avoid: "redondo",
      reason:
        "El escote en V abre una línea vertical que estiliza; el redondo repite la curva y ensancha el tercio medio.",
    },
  },
  cuadrado: {
    glasses: {
      reco: "redondas",
      avoid: "rectangulares",
      reason:
        "Las monturas redondeadas suavizan tu mandíbula marcada; las rectangulares duplican los ángulos que ya tienes.",
    },
    neckline: {
      reco: "redondo",
      avoid: "barco",
      reason:
        "La curva del escote redondo contrarresta la angulosidad; el barco, recto y horizontal, subraya la anchura de la mandíbula.",
    },
  },
  corazon: {
    glasses: {
      reco: "redondas",
      avoid: "ojo-de-gato",
      reason:
        "Las monturas redondeadas suavizan la frente ancha sin sumarle peso arriba; el ojo de gato sube y ensancha justo donde ya eres más ancha.",
    },
    neckline: {
      reco: "barco",
      avoid: "v",
      reason:
        "El escote barco ensancha la parte baja y equilibra tu mentón estrecho; el pico en V estrecha aún más hacia abajo y acentúa el afinamiento.",
    },
  },
  diamante: {
    glasses: {
      reco: "ojo-de-gato",
      avoid: "redondas",
      reason:
        "Las monturas con peso en la parte superior ensanchan tu frente estrecha; unas pequeñas y redondas dejan el pómulo como único punto ancho.",
    },
    neckline: {
      reco: "barco",
      avoid: "v",
      reason:
        "El barco amplía la línea de los hombros y el tercio superior; el pico en V estrecha hacia el centro y deja el pómulo más protagonista.",
    },
  },
  alargado: {
    glasses: {
      reco: "rectangulares",
      avoid: "redondas",
      reason:
        "Una montura ancha añade líneas horizontales y acorta el rostro; unas pequeñas y redondas no aportan la anchura que necesitas.",
    },
    neckline: {
      reco: "barco",
      avoid: "v",
      reason:
        "La horizontal amplia del barco corta la verticalidad; el escote en V alarga todavía más el rostro.",
    },
  },
};
