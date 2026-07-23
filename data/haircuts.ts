// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { StyleItem, TieredReco } from "@/types/face-recommendations";

/** Cortes de cabello: muy recomendados / recomendados / evitar. */
export const HAIRCUTS: Record<FaceShapeId, TieredReco> = {
  "ovalo": {
    "great": [
      {
        "name": "Media melena (lob) a la altura de la mandíbula",
        "reason": "Corta el eje vertical justo donde la cara ya se afina, así el óvalo mantiene su 1.5x sin estirarse ni redondearse; cae sobre el punto más ancho (pómulos) y lo acompaña en vez de taparlo",
        "verdict": "reco"
      },
      {
        "name": "Corte medio con capas suaves",
        "reason": "Las capas reparten volumen sin cargarlo en un solo punto, respetando que ningún tercio del rostro domine; el óvalo no pide corrección, solo que nada rompa su reparto parejo",
        "verdict": "reco"
      },
      {
        "name": "Corte pixie con textura",
        "reason": "El óvalo tolera dejar la cara despejada porque su contorno ya es armónico; la textura arriba da un poco de altura sin exagerar el largo, y no hay mandíbula ancha ni frente estrecha que esconder",
        "verdict": "reco"
      },
      {
        "name": "Largo por debajo de los hombros con puntas movidas",
        "reason": "El eje largo aguanta melena larga sin verse alargado siempre que las puntas tengan movimiento; el volumen a media altura devuelve peso a la zona de pómulos y evita el efecto 'cortina' que estira",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Flequillo cortina abierto",
        "reason": "Acorta ópticamente la frente lo justo para que, si tu óvalo tira a largo, el eje vertical no se dispare; al abrirse deja ver los pómulos que son tu punto fuerte",
        "verdict": "neutral"
      },
      {
        "name": "Bob recto a la mandíbula",
        "reason": "Funciona porque enmarca sin endurecer, pero al ser una línea muy contundente conviene un pelín de movimiento para no aplanar la suavidad natural de tu mandíbula",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Capas muy largas y planas pegadas a la cara",
        "reason": "Crean líneas verticales continuas que alargan el rostro y rompen el 1.5x hacia un óvalo estirado; el único riesgo real de esta forma es justamente el exceso de largo",
        "verdict": "evitar"
      },
      {
        "name": "Volumen extremo en la coronilla (tupé muy alto)",
        "reason": "Añadir altura a un eje ya largo empuja la proporción hacia lo alargado y desplaza el foco lejos de los pómulos, que es donde tu cara se sostiene",
        "verdict": "evitar"
      }
    ]
  },
  "redondo": {
    "great": [
      {
        "name": "Pompadour / copete con volumen alto",
        "reason": "El pelo empujado hacia arriba en la coronilla suma centímetros verticales que el rostro no tiene, estirando el óvalo y compensando el largo corto igual al ancho.",
        "verdict": "reco"
      },
      {
        "name": "Undercut con laterales muy cortos",
        "reason": "Al vaciar y pegar los lados desaparece el volumen que ensancha las mejillas llenas; el contraste con la masa superior crea líneas verticales y algo de ángulo en la sien.",
        "verdict": "reco"
      },
      {
        "name": "Corte con textura desfilada en punta (spiky)",
        "reason": "Las puntas hacia arriba y las diagonales rompen la curva continua del contorno y aportan los ángulos que el rostro sin aristas necesita.",
        "verdict": "reco"
      },
      {
        "name": "Fringe/flequillo lateral con altura",
        "reason": "Un barrido en diagonal marca una línea oblicua sobre la frente que quiebra la redondez y guía la mirada hacia arriba en lugar de a lo ancho.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Corte medio con capas largas hacia el mentón",
        "reason": "Las capas verticales que caen enmarcando el rostro lo afinan por los lados; funciona si evitas que se abombe a la altura de las mejillas.",
        "verdict": "neutral"
      },
      {
        "name": "Side part definido con raya marcada",
        "reason": "La raya al lado introduce asimetría y una línea diagonal que alarga; cuida que el volumen no crezca sobre las orejas.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Melena redonda tipo casco (bob curvo a la altura de la mejilla)",
        "reason": "El punto más ancho del corte coincide con las mejillas llenas y su curva repite la del rostro, sumando redondez sobre redondez.",
        "verdict": "evitar"
      },
      {
        "name": "Flequillo recto y tupido cubriendo la frente",
        "reason": "Acorta el rostro al recortar la frente visible y refuerza la horizontal, justo lo contrario a la altura que buscas.",
        "verdict": "evitar"
      },
      {
        "name": "Buzz cut muy corto y uniforme",
        "reason": "Sin volumen superior no hay estiramiento vertical y la cabeza se lee tan ancha como alta, acentuando la forma esférica.",
        "verdict": "evitar"
      }
    ]
  },
  "cuadrado": {
    "great": [
      {
        "name": "Capas suaves con movimiento",
        "reason": "Al romper el pelo en mechones curvos y desiguales, la vista deja de leer los lados rectos del rostro cuadrado y se apoya en el movimiento; la ausencia de bordes duros contrarresta la mandíbula angular.",
        "verdict": "reco"
      },
      {
        "name": "Texturizado despuntado (crop texturizado)",
        "reason": "Las puntas irregulares hacia arriba crean redondez y algo de altura en la coronilla, que es justo lo que le falta a un contorno donde ancho de frente y mandíbula se igualan.",
        "verdict": "reco"
      },
      {
        "name": "Media melena ondulada a la altura de la mandíbula",
        "reason": "La onda cae justo sobre el ángulo mandibular y lo envuelve en curva, disolviendo la esquina más marcada del cuadrado en lugar de subrayarla con un corte recto.",
        "verdict": "reco"
      },
      {
        "name": "Pompadour o quiff con volumen arriba",
        "reason": "Concentrar altura en la parte superior alarga visualmente el óvalo y desvía el peso lejos de la línea mandibular, compensando la anchura pareja del rostro.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Side part suave con caída lateral",
        "reason": "La raya al costado introduce una diagonal que corta la simetría frontal recta; funciona si el flequillo se deja algo despeinado y no en bloque geométrico.",
        "verdict": "neutral"
      },
      {
        "name": "Rizos definidos de largo medio",
        "reason": "El rizo aporta curva natural que suaviza los lados, pero conviene mantener volumen arriba para no ensanchar a la altura de las mejillas y la quijada.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Corte recto a la mandíbula (bob geométrico duro)",
        "reason": "La línea horizontal termina exactamente sobre el ángulo mandibular y lo enmarca como un recuadro, reforzando las cuatro esquinas que buscamos suavizar.",
        "verdict": "evitar"
      },
      {
        "name": "Flequillo recto y tupido de borde nítido",
        "reason": "Suma una línea horizontal firme a una frente ya ancha y angular, creando un marco de bordes rectos que acentúa la geometría del rostro.",
        "verdict": "evitar"
      },
      {
        "name": "Buzz cut muy al ras uniforme",
        "reason": "Al pegar el pelo al cráneo revela sin filtro las esquinas de la mandíbula y la frente, dejando el contorno cuadrado totalmente expuesto.",
        "verdict": "evitar"
      }
    ]
  },
  "corazon": {
    "great": [
      {
        "name": "Corte con volumen en la nuca / undercut disconnected",
        "reason": "Al vaciar los laterales sobre las sienes anchas y dejar peso alto-atrás que cae hacia la nuca, se traslada masa visual desde la frente dominante hacia el eje de la mandíbula estrecha.",
        "verdict": "reco"
      },
      {
        "name": "Flequillo lateral desfilado que rompe la frente",
        "reason": "Un barrido diagonal cubre parte de la frente ancha y quiebra su horizontal, restándole protagonismo sin apilar volumen encima.",
        "verdict": "reco"
      },
      {
        "name": "Media melena a la altura de la mandíbula (lob/bob al mentón)",
        "reason": "El corte deposita su punto más ancho justo donde el rostro se afila, engrosando ópticamente el tercio inferior estrecho.",
        "verdict": "reco"
      },
      {
        "name": "Texturizado con puntas hacia afuera bajo la oreja",
        "reason": "Las puntas que se abren a la altura de la mandíbula suman anchura donde falta, contrapesando la punta del mentón.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Capas largas que arrancan del pómulo",
        "reason": "Aportan movimiento en la mitad baja siempre que el arranque no engorde las sienes; pide mantener la coronilla plana.",
        "verdict": "neutral"
      },
      {
        "name": "Crop texturizado corto atrás y arriba controlado",
        "reason": "Funciona si el volumen se concentra atrás y los laterales quedan pegados para no ensanchar más la frente.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Volumen alto y frontal (copete inflado, quiff muy elevado)",
        "reason": "Añade altura y masa sobre la frente que ya es la zona más ancha, acentuando el desequilibrio hacia arriba.",
        "verdict": "evitar"
      },
      {
        "name": "Pixie muy corto y pegado en la nuca",
        "reason": "Deja el tercio inferior sin peso y expone al máximo la frente ancha y el mentón fino, exagerando el triángulo invertido.",
        "verdict": "evitar"
      }
    ]
  },
  "diamante": {
    "great": [
      {
        "name": "Flequillo en cortina o abierto",
        "reason": "El rombo nace estrecho en la frente; un flequillo en cortina rellena las sienes y ensancha esa franja alta, que es justo tu punto más angosto.",
        "verdict": "reco"
      },
      {
        "name": "Bob a la altura del mentón",
        "reason": "Al terminar el pelo en el maxilar, aporta cuerpo y anchura donde tu cara se afina abajo, dando presencia a la mandíbula estrecha sin tocar el pómulo.",
        "verdict": "reco"
      },
      {
        "name": "Capas que arrancan en la mandíbula",
        "reason": "Abren su volumen a la altura del mentón y dan masa al maxilar angosto; si arrancaran en el pómulo, ensancharían tu zona ya prominente.",
        "verdict": "reco"
      },
      {
        "name": "Volumen en coronilla y sienes",
        "reason": "Elevar raíz arriba lleva anchura hacia la frente estrecha y equilibra el eje vertical sin sumar ancho en los pómulos.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Media melena con ondas de oreja hacia abajo",
        "reason": "Funciona si las ondas se concentran del pómulo hacia abajo para dar cuerpo al maxilar; peinada hacia atrás pierde ese apoyo.",
        "verdict": "neutral"
      },
      {
        "name": "Pixie con textura y flequillo arriba",
        "reason": "Sirve si dejas volumen texturizado sobre la frente; muy pegado en los lados deja los pómulos como único punto ancho.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Coleta o moño muy tirante",
        "reason": "Despeja del todo la frente estrecha y estira el pelo sobre los pómulos, marcando el contraste entre tu zona media ancha y las puntas angostas.",
        "verdict": "evitar"
      },
      {
        "name": "Volumen a la altura del pómulo",
        "reason": "Cualquier capa o rizo que abulte en la línea del pómulo suma ancho a tu punto más prominente y exagera el rombo.",
        "verdict": "evitar"
      },
      {
        "name": "Raya al medio muy pegada",
        "reason": "Aplasta las sienes y estrecha la frente, reforzando la parte del rostro que buscas abrir.",
        "verdict": "evitar"
      }
    ]
  },
  "alargado": {
    "great": [
      {
        "name": "Bob a la mandíbula con puntas hacia dentro",
        "reason": "El corte que termina justo en la línea mandibular crea un bloque horizontal de peso a media altura, contrarrestando la caída vertical del rostro alargado; las puntas curvadas hacia dentro cierran el óvalo por los lados.",
        "verdict": "reco"
      },
      {
        "name": "Capas con volumen en las sienes",
        "reason": "Al concentrar cuerpo y curva a la altura de pómulos y sienes, ensanchas visualmente la zona media y rompes la sensación de largo continuo de arriba a abajo.",
        "verdict": "reco"
      },
      {
        "name": "Corte midi con ondas horizontales",
        "reason": "Las ondas que se abren hacia los lados aportan anchura lateral y líneas curvas que cruzan el eje vertical, justo lo que un rostro estrecho y largo necesita.",
        "verdict": "reco"
      },
      {
        "name": "Flequillo recto o cortina",
        "reason": "Acorta ópticamente la frente y por tanto el tercio superior; al poner un límite horizontal arriba, el rostro se lee menos alargado.",
        "verdict": "reco"
      }
    ],
    "good": [
      {
        "name": "Lob (long bob) con textura",
        "reason": "Aún da una base de peso lateral útil, aunque al pasar de la mandíbula empieza a estirar; funciona si mantienes volumen medio y evitas alisado plano.",
        "verdict": "neutral"
      },
      {
        "name": "Media melena con raya al lado",
        "reason": "La raya lateral desplaza volumen a un costado y añade algo de anchura asimétrica; correcto siempre que no quede pegada al cráneo.",
        "verdict": "neutral"
      }
    ],
    "avoid": [
      {
        "name": "Largo liso extremo sin capas",
        "reason": "La cortina de pelo recta y vertical prolonga la línea del rostro y estrecha aún más los lados, acentuando exactamente el rasgo que buscas equilibrar.",
        "verdict": "evitar"
      },
      {
        "name": "Tupé o volumen alto en la coronilla",
        "reason": "Añadir altura arriba estira el tercio superior y suma centímetros verticales, lo contrario del balance que pide una cara larga.",
        "verdict": "evitar"
      }
    ]
  }
};

/** Peinados con el porqué de que funcionen en cada forma. */
export const HAIRSTYLES: Record<FaceShapeId, StyleItem[]> = {
  "ovalo": [
    {
      "name": "Recogido bajo con mechones sueltos junto al rostro",
      "reason": "Despeja el contorno armónico y los mechones a la altura del pómulo mantienen ahí el foco; al ir bajo no suma eje vertical que estire el óvalo",
      "verdict": "reco"
    },
    {
      "name": "Coleta media relajada",
      "reason": "Ni tan alta que alargue el rostro ni tan baja que lo apague; aprovecha que el óvalo no necesita disimular nada y deja la cara limpia",
      "verdict": "reco"
    },
    {
      "name": "Ondas a media altura",
      "reason": "Concentran cuerpo en la franja de los pómulos, reforzando el punto más ancho natural y evitando que el pelo caiga en línea recta y alargue",
      "verdict": "reco"
    },
    {
      "name": "Moño alto muy tirante",
      "reason": "Estilizado, pero al elevar todo el volumen añade centímetros a un eje ya largo; úsalo suelto de raíces o con algún mechón para no romper la proporción",
      "verdict": "neutral"
    }
  ],
  "redondo": [
    {
      "name": "Recogido alto (moño o coleta en la coronilla)",
      "reason": "Concentra masa arriba y despeja los lados, alargando el rostro y liberando la línea de la mandíbula redondeada.",
      "verdict": "reco"
    },
    {
      "name": "Volumen en raíces con caída lisa a los lados",
      "reason": "La altura en la coronilla más el pelo pegado en las sienes crea una silueta ovalada, más larga que ancha.",
      "verdict": "reco"
    },
    {
      "name": "Ondas verticales sueltas cayendo por debajo del mentón",
      "reason": "El movimiento largo y descendente dirige la vista hacia abajo y estiliza, siempre que el volumen no se acumule en las mejillas.",
      "verdict": "reco"
    },
    {
      "name": "Coleta baja tirante pegada a los lados",
      "reason": "Al eliminar volumen lateral afina el contorno; combínala con algo de altura en la corona para no aplanar.",
      "verdict": "neutral"
    }
  ],
  "cuadrado": [
    {
      "name": "Ondas sueltas hacia afuera",
      "reason": "El giro de la punta alejándose de la cara abre curvas alrededor de la quijada y quiebra la verticalidad recta de los lados.",
      "verdict": "reco"
    },
    {
      "name": "Recogido alto suelto con mechones al frente",
      "reason": "Sube el punto focal y deja caer hilos curvos que ablandan las esquinas de la mandíbula sin taparla por completo.",
      "verdict": "reco"
    },
    {
      "name": "Volumen en la coronilla peinado hacia atrás",
      "reason": "Añadir altura arriba estira la proporción vertical y resta protagonismo a la anchura pareja de frente y quijada.",
      "verdict": "reco"
    },
    {
      "name": "Ondas asimétricas cayendo sobre un lado",
      "reason": "La diagonal desigual rompe la simetría en bloque del cuadrado y envuelve un solo ángulo mandibular en curva.",
      "verdict": "reco"
    }
  ],
  "corazon": [
    {
      "name": "Recogido bajo suelto a la altura de la nuca",
      "reason": "Concentra el peso abajo-atrás, alineado con la mandíbula estrecha, y despeja sin inflar la frente.",
      "verdict": "reco"
    },
    {
      "name": "Ondas sueltas que empiezan bajo la mandíbula",
      "reason": "El movimiento vive en el tercio inferior y ensancha ópticamente la zona del mentón fino.",
      "verdict": "reco"
    },
    {
      "name": "Raya lateral profunda",
      "reason": "Rompe la simetría y la horizontal de la frente ancha, desviando la mirada del punto más dominante.",
      "verdict": "reco"
    },
    {
      "name": "Coleta alta y tirante",
      "reason": "Estira el pelo hacia atrás, deja la frente totalmente descubierta y sube el foco a la zona que ya domina.",
      "verdict": "evitar"
    }
  ],
  "diamante": [
    {
      "name": "Flequillo cruzado hacia un lado",
      "reason": "Rellena y cubre parcialmente la frente estrecha, rompiendo el vértice superior del rombo y restando aire a esa zona angosta.",
      "verdict": "reco"
    },
    {
      "name": "Semirrecogido con volumen en la coronilla",
      "reason": "Sube masa arriba donde te falta anchura y deja cuerpo suelto cerca del maxilar; ensancha los dos extremos del eje vertical.",
      "verdict": "reco"
    },
    {
      "name": "Ondas que caen bajo la oreja",
      "reason": "Concentran cuerpo a la altura del mentón para dar presencia al maxilar estrecho sin tocar la línea del pómulo.",
      "verdict": "reco"
    },
    {
      "name": "Recogido bajo con mechones sueltos en la cara",
      "reason": "Válido si dejas mechones que suavicen el pómulo; totalmente tirante lo deja desnudo y como único punto ancho.",
      "verdict": "neutral"
    }
  ],
  "alargado": [
    {
      "name": "Ondas sueltas a media altura",
      "reason": "El movimiento curvo concentrado en pómulos y mandíbula rellena los lados y quiebra la verticalidad con líneas horizontales.",
      "verdict": "reco"
    },
    {
      "name": "Recogido bajo con mechones sueltos a los lados",
      "reason": "Al dejar volumen suave enmarcando las mejillas y mantener el nudo bajo (no alto), ensanchas la zona media sin sumar altura.",
      "verdict": "reco"
    },
    {
      "name": "Semirecogido con volumen en coronilla suave",
      "reason": "Un poco de raíz da forma, pero el foco de anchura queda a los lados; equilibrado si el volumen no se dispara hacia arriba.",
      "verdict": "neutral"
    },
    {
      "name": "Coleta alta muy tirante",
      "reason": "Estira el rostro hacia arriba y despeja los lados, alargando la cara; resérvalo para cuando busques el efecto contrario.",
      "verdict": "evitar"
    }
  ]
};
