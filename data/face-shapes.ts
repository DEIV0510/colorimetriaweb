import type { FaceShapeId } from "@/types/face-shape";

/**
 * Contenido educativo y de balance por oposición por forma de rostro.
 *
 * El balance por oposición es el principio de visagismo que guía todo el módulo:
 * casi nunca se "corrige" un rostro, se EQUILIBRA introduciendo las líneas o los
 * volúmenes que le faltan y atenuando los que predominan. Cada forma pide lo
 * contrario de lo que ya domina, así que cada explicación es distinta por
 * definición: lo que equilibra un rostro redondo desequilibra uno alargado.
 * Los criterios sirven a cualquier persona: se mezclan cabello, barba, cejas,
 * monturas y accesorios sin dar por hecho el género de quien lee.
 *
 * Nada de esto es una regla obligatoria ni una norma estética: son criterios
 * orientativos de asesoría de imagen.
 */

export interface FaceShapeEducation {
  /** Frase corta que da identidad a la forma */
  tagline: string;
  /** Qué es, en lenguaje sencillo */
  essence: string;
  /** Las proporciones concretas que la definen */
  proportions: string;
  /** Qué la diferencia de las otras formas (puntos concretos) */
  differentiators: string[];
}

export interface FaceShapeBalance {
  /** Qué se busca equilibrar y por qué, aplicado a ESTA forma */
  principle: string;
  /** Cómo lograrlo, en criterios concretos */
  techniques: string[];
  /** El objetivo visual que persiguen esas técnicas */
  goal: string;
}

export interface FaceShapeContent {
  education: FaceShapeEducation;
  balance: FaceShapeBalance;
}

export const FACE_SHAPE_CONTENT: Record<FaceShapeId, FaceShapeContent> = {
  ovalo: {
    education: {
      tagline: "La proporción de referencia",
      essence:
        "El óvalo se toma como proporción de referencia en visagismo porque sus medidas están muy repartidas: la cara es algo más larga que ancha, los pómulos son la parte más amplia y todo desciende en una curva suave hasta un mentón redondeado. No es 'mejor' que las demás, solo la más equilibrada de partida.",
      proportions:
        "El largo ronda una vez y media el ancho, la frente es apenas más amplia que la mandíbula y la línea del rostro se afina de forma gradual, sin ángulos bruscos.",
      differentiators: [
        "Frente al redondo, es claramente más largo que ancho, no casi cuadrado.",
        "Frente al alargado, ese largo es moderado: estiliza sin exagerar la verticalidad.",
        "Frente al corazón, la frente no domina y la transición hacia la mandíbula es progresiva, sin un mentón marcadamente afinado.",
      ],
    },
    balance: {
      principle:
        "Aquí el balance por oposición casi no interviene: el óvalo ya está equilibrado, así que el objetivo no es corregir nada, sino conservar esa armonía. El riesgo no es 'quedarse corto', sino romper la proporción con un elemento que sobresalga demasiado.",
      techniques: [
        "Puedes permitirte casi cualquier corte, escote o montura: es la forma con más libertad de todas.",
        "Evita tapar del todo la frente o cargar mucho volumen en un solo lado, que desplazaría el eje de simetría.",
        "Mantén una escala media en monturas y accesorios; los extremos son lo único que puede desequilibrarte.",
        "Si quieres un foco, realza los pómulos: es tu punto naturalmente más favorecido.",
      ],
      goal: "Conservar el equilibrio que ya tienes, en vez de introducir compensaciones que no necesitas.",
    },
  },

  redondo: {
    education: {
      tagline: "Suave y luminoso",
      essence:
        "El rostro redondo mide casi lo mismo de largo que de ancho, con mejillas llenas, líneas curvas y una mandíbula y un nacimiento del pelo redondeados. Suele percibirse suave y juvenil.",
      proportions:
        "Largo y ancho son casi iguales, la mayor anchura está en las mejillas y no hay ángulos marcados en ningún punto del contorno.",
      differentiators: [
        "Frente al óvalo, es casi tan ancho como largo, sin esa longitud que estiliza.",
        "Frente al cuadrado, la mandíbula es redondeada, no angular.",
        "Frente al corazón, frente y mandíbula tienen una anchura parecida, sin un mentón afinado.",
      ],
    },
    balance: {
      principle:
        "Como al rostro redondo le faltan líneas verticales y ángulos, el balance por oposición consiste en aportárselos: se busca ganar altura y algo de definición donde todo es curva.",
      techniques: [
        "La altura manda: volumen en la coronilla y una raya lateral marcada estiran el rostro más que cualquier otro recurso.",
        "Cambia curvas por líneas: capas largas rectas, puntas hacia dentro y un flequillo abierto en cortina crean los ángulos que la cara no tiene.",
        "En barba, deja algo más de largo en el mentón que en las mejillas para alargar el óvalo; en cejas, una forma con ligera elevación aporta dirección.",
        "Un escote en pico o en V abre una línea vertical que estira visualmente el tercio medio del rostro.",
      ],
      goal: "Que el rostro se lea algo más largo y con más estructura de la que tiene en realidad.",
    },
  },

  cuadrado: {
    education: {
      tagline: "Estructura y carácter",
      essence:
        "El rostro cuadrado tiene la frente, los pómulos y la mandíbula de anchura parecida, con los lados rectos y una mandíbula marcada y angular. Proyecta fuerza y una estructura muy definida.",
      proportions:
        "Las tres anchuras son similares, el largo se acerca al ancho y el rasgo dominante es el ángulo de la mandíbula, bien perceptible.",
      differentiators: [
        "Frente al redondo, la mandíbula es angular en lugar de redondeada.",
        "Frente al alargado, el largo se acerca al ancho: el rostro es casi tan alto como amplio.",
        "Frente al diamante, la frente acompaña a los pómulos en anchura y forma un marco recto de arriba abajo.",
      ],
    },
    balance: {
      principle:
        "El rostro cuadrado ya tiene ángulos de sobra, así que el balance por oposición aporta lo contrario: curvas. El objetivo es suavizar la fuerza de la mandíbula y añadir algo de redondez y altura sin negar su carácter.",
      techniques: [
        "Ondas, capas suaves y mechones que caen por delante de la mandíbula rompen su línea recta con movimiento.",
        "Mantén el pelo despejado en las sienes y con algo de altura arriba: aleja el peso de la esquina de la mandíbula.",
        "En cejas, una curva suave en lugar de una línea recta compensa la angulosidad del rostro.",
        "Si llevas barba, redondéala en el mentón en vez de dejarla en escuadra; los contornos rectos duplican el ángulo que ya tienes.",
        "Elige monturas de esquinas redondeadas u ovaladas antes que marcos cuadrados.",
      ],
      goal: "Equilibrar la fuerza de la mandíbula con suavidad, sin perder la estructura que te caracteriza.",
    },
  },

  corazon: {
    education: {
      tagline: "Frente amplia, mentón afinado",
      essence:
        "El rostro de corazón tiene la frente como parte más ancha, unos pómulos marcados y una mandíbula estrecha que termina en un mentón fino, a veces en punta. La mirada se lleva de forma natural hacia el tercio superior.",
      proportions:
        "La frente supera con claridad a la mandíbula y el rostro se afina de arriba abajo, estrechándose hacia el mentón.",
      differentiators: [
        "Frente al diamante, la parte más ancha es la frente, no los pómulos.",
        "Frente al óvalo, la mandíbula es claramente más estrecha que la frente.",
        "Frente al cuadrado, no hay ángulos: hay un afinamiento progresivo hacia el mentón.",
      ],
    },
    balance: {
      principle:
        "El peso visual está arriba: frente ancha y mandíbula estrecha. El balance por oposición hace lo contrario, baja el peso hacia el tercio inferior y, sobre todo, no suma nada a una frente que ya domina.",
      techniques: [
        "Baja el peso del pelo: una media melena o un largo con cuerpo a la altura del mentón compensa la parte estrecha del rostro.",
        "No cargues la parte alta: evita cardados en la coronilla y flequillos rectos y densos, que ensanchan la frente; un flequillo abierto en cortina la disimula mejor.",
        "Si llevas barba, deja que rellene los laterales del maxilar para dar cuerpo justo donde el rostro se afina.",
        "En cuellos y escotes, los que ganan cuerpo abajo —cuello vuelto, cowl, escote cuadrado amplio— acercan la anchura hacia el mentón; el halter, en cambio, lo estrecha.",
      ],
      goal: "Que la mirada deje de irse solo a la frente y el rostro se perciba parejo de arriba abajo.",
    },
  },

  diamante: {
    education: {
      tagline: "Pómulos protagonistas",
      essence:
        "El rostro diamante tiene los pómulos como punto más ancho y prominente, con la frente y la mandíbula más estrechas. El mentón suele quedar en segundo plano, discreto frente al protagonismo del pómulo. Es una forma angulosa y muy expresiva, con la anchura concentrada en el centro.",
      proportions:
        "Los pómulos sobresalen sobre una frente y una mandíbula estrechas y de anchura parecida, y el rostro es más largo que ancho.",
      differentiators: [
        "Frente al corazón, la frente es estrecha, no la parte más ancha.",
        "Frente al óvalo, los pómulos sobresalen mucho más que la frente y la mandíbula.",
        "Frente al alargado, la anchura se concentra en el centro en lugar de ser uniforme.",
      ],
    },
    balance: {
      principle:
        "Toda la anchura está en los pómulos, mientras frente y mandíbula quedan estrechas. El balance por oposición añade presencia donde falta —arriba y abajo— para que los pómulos dejen de dominar por sí solos.",
      techniques: [
        "Empieza por la frente, que aquí sí es estrecha: un flequillo o cuerpo a la altura de las sienes le da anchura —justo lo contrario que en el corazón, donde la frente ya sobra.",
        "Nada de recogidos tirantes ni rayas centrales que despejan las sienes: dejan el pómulo aún más marcado.",
        "Da presencia al maxilar inferior —con largo que caiga por debajo de la oreja o barba corta en los laterales— para que el pómulo no sea lo único ancho.",
        "En monturas, las que tienen peso en la parte superior amplían visualmente la frente y compensan el centro del rostro.",
      ],
      goal: "Que los pómulos dejen de ser lo único que se ve y el rostro gane un marco parejo, con la frente y la mandíbula presentes.",
    },
  },

  alargado: {
    education: {
      tagline: "Vertical y estilizado",
      essence:
        "El rostro alargado es visiblemente más largo que ancho, con los costados largos y de curvatura mínima y anchuras de frente, pómulos y mandíbula parecidas. Suele tener la frente o el mentón largos y transmite elegancia y verticalidad.",
      proportions:
        "El largo supera con claridad al ancho, la variación de anchura entre las tres zonas es pequeña y la dirección vertical domina todo el rostro.",
      differentiators: [
        "Frente al óvalo, el largo es marcado, no moderado.",
        "Frente al cuadrado, comparte esos costados poco curvos pero es mucho más largo.",
        "Frente al diamante, la anchura es uniforme, sin unos pómulos que sobresalgan.",
      ],
    },
    balance: {
      principle:
        "Lo que predomina es la longitud y lo que falta es anchura. El balance por oposición introduce líneas horizontales y volumen lateral para contrarrestar la verticalidad y 'acortar' visualmente el rostro.",
      techniques: [
        "Gana anchura donde falta: ondas y capas a la altura de las mejillas ensanchan el tercio medio.",
        "Un flequillo —recto o abierto— acorta la frente, que suele ser la zona que más alarga el rostro.",
        "Deja fuera el pelo muy largo y liso y las rayas al medio que caen a plomo: estiran todavía más la cara.",
        "En cuellos, los altos y redondos o las líneas horizontales amplias cortan la vertical mejor que un escote profundo; en accesorios y monturas, busca presencia a lo ancho antes que a lo largo.",
      ],
      goal: "Que el rostro se perciba más corto y equilibrado, con la mirada repartida a lo ancho y no solo de arriba abajo.",
    },
  },
};
