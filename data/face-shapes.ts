import type { FaceShapeId } from "@/types/face-shape";

/**
 * Contenido educativo y de balance por oposición por forma de rostro.
 *
 * El balance por oposición es el principio de visagismo que guía todo el módulo:
 * casi nunca se "corrige" un rostro, se EQUILIBRA introduciendo las líneas o los
 * volúmenes que le faltan y atenuando los que dominan. Cada forma pide lo
 * contrario de lo que le sobra, así que cada explicación es distinta por
 * definición: lo que equilibra un rostro redondo desequilibra uno alargado.
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
        "El óvalo se considera la forma más equilibrada porque sus proporciones se acercan al ideal clásico: la cara es algo más larga que ancha, los pómulos son la parte más amplia y todo desciende en una curva suave hasta un mentón redondeado.",
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
        "Puedes permitirte casi cualquier corte, escote o montura: es la forma con más libertad.",
        "Evita tapar del todo la frente o cargar mucho volumen en un solo lado, que desplazaría el eje de simetría.",
        "Mantén una escala media en gafas y accesorios; los extremos son lo único que puede desequilibrarte.",
        "Si quieres un foco, realza los pómulos: es tu punto naturalmente más favorecido.",
      ],
      goal: "Preservar el equilibrio que ya tienes en vez de introducir compensaciones que no necesitas.",
    },
  },

  redondo: {
    education: {
      tagline: "Suave y luminoso",
      essence:
        "El rostro redondo mide casi lo mismo de largo que de ancho, con mejillas llenas, líneas curvas y una mandíbula y un nacimiento del pelo redondeados. Transmite suavidad y un aire juvenil.",
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
        "Como al rostro redondo le faltan líneas verticales y ángulos, el balance por oposición consiste en aportárselos: se busca alargar visualmente y añadir algo de definición donde todo es curva.",
      techniques: [
        "Alarga con volumen en la coronilla y con líneas verticales que estiren la mirada hacia arriba.",
        "Introduce ángulos y puntas —en el corte, en las gafas, en el escote— donde el rostro solo tiene curvas.",
        "Prefiere escotes en V y en pico: abren una línea vertical que afina las mejillas.",
        "En accesorios, alarga con colgantes y pendientes largos; evita los aros y las formas muy redondas, que repiten lo que ya sobra.",
      ],
      goal: "Crear la ilusión de un rostro algo más largo y estructurado, restando protagonismo a la anchura de las mejillas.",
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
        "Frente al alargado, no es notablemente más largo que ancho.",
        "Frente al diamante, la frente es tan ancha como los pómulos, no estrecha.",
      ],
    },
    balance: {
      principle:
        "El rostro cuadrado ya tiene ángulos de sobra, así que el balance por oposición aporta lo contrario: curvas. El objetivo es suavizar la fuerza de la mandíbula y añadir algo de redondez y altura sin negar su carácter.",
      techniques: [
        "Suaviza con curvas, capas y ondas; las texturas redondeadas restan dureza a la línea recta de la mandíbula.",
        "Evita cortes muy geométricos y líneas rectas que caen justo sobre la mandíbula: refuerzan el ángulo en lugar de disolverlo.",
        "Prefiere escotes redondos y ovalados, que devuelven curva a la zona.",
        "Elige gafas y pendientes de contorno redondeado; los marcos cuadrados duplican la angulosidad que ya tienes.",
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
        "El peso visual está arriba: frente ancha y mandíbula estrecha. El balance por oposición busca lo contrario, dar anchura y presencia al tercio inferior y no añadir volumen a una frente que ya domina.",
      techniques: [
        "Aporta volumen o anchura a la altura de la mandíbula, donde el rostro se estrecha.",
        "Evita el volumen alto en la coronilla y los flequillos que ensanchan aún más la frente.",
        "Prefiere escotes que amplían la parte baja —barco, cuadrado, halter— para compensar el mentón afinado.",
        "Usa pendientes que terminan a la altura de la mandíbula y la ensanchan; en gafas, dales algo de presencia en la parte inferior.",
      ],
      goal: "Repartir el peso visual hacia abajo para equilibrar una frente ancha con una mandíbula estrecha.",
    },
  },

  diamante: {
    education: {
      tagline: "Pómulos protagonistas",
      essence:
        "El rostro diamante tiene los pómulos como punto más ancho y prominente, con la frente y la mandíbula más estrechas y, a menudo, un mentón afinado. Es una forma angulosa y muy expresiva, con la anchura concentrada en el centro.",
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
        "Da anchura a la frente con flequillos o volumen en la parte alta, y algo de cuerpo a la altura de la mandíbula.",
        "Evita los recogidos muy tirantes, que marcan todavía más el pómulo al despejar las sienes.",
        "Prefiere escotes que amplían la línea de los hombros y el tercio superior.",
        "Elige pendientes anchos a la altura de la mandíbula y gafas con presencia en la parte superior —tipo ojo de gato— para ensanchar visualmente la frente.",
      ],
      goal: "Equilibrar unos pómulos protagonistas dando presencia a la frente y a la mandíbula.",
    },
  },

  alargado: {
    education: {
      tagline: "Vertical y estilizado",
      essence:
        "El rostro alargado es visiblemente más largo que ancho, con los lados bastante rectos y anchuras de frente, pómulos y mandíbula parecidas. Suele tener la frente o el mentón largos y transmite elegancia y verticalidad.",
      proportions:
        "El largo supera con claridad al ancho, la variación de anchura entre las tres zonas es pequeña y la dirección vertical domina todo el rostro.",
      differentiators: [
        "Frente al óvalo, el largo es marcado, no moderado.",
        "Frente al cuadrado, comparte los lados rectos pero es mucho más largo.",
        "Frente al diamante, la anchura es uniforme, sin unos pómulos que sobresalgan.",
      ],
    },
    balance: {
      principle:
        "Lo que sobra es longitud y lo que falta es anchura. El balance por oposición introduce líneas horizontales y volumen lateral para contrarrestar la verticalidad y 'acortar' visualmente el rostro.",
      techniques: [
        "Añade volumen a los lados —ondas, capas a la altura de las mejillas— para ganar anchura.",
        "Evita el pelo muy largo y liso y los cortes que estiran todavía más el rostro.",
        "Un flequillo acorta el tercio superior y rompe la línea vertical de la frente.",
        "Prefiere escotes horizontales —barco, cuadrado— y accesorios anchos o redondos antes que largos; en gafas, busca presencia horizontal.",
      ],
      goal: "Crear anchura y romper la línea vertical para que el rostro se perciba más corto y equilibrado.",
    },
  },
};
