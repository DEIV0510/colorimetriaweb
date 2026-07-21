import type { SeasonId } from "@/types/classification";
import type { SeasonStyleVoice } from "@/types/style";

/**
 * Capa de VOZ por estación: lo único que se escribe a mano.
 *
 * `signature` es obligatorio y se inyecta en cada explicación de conjunto.
 * Es la garantía de que dos estaciones nunca comparten esqueleto de texto,
 * incluso cuando sus cuatro características coinciden — verano-suave y
 * otono-suave solo difieren en contraste, y primavera-calida y
 * primavera-brillante solo en intensidad.
 *
 * `occasionNotes` es incremental: si falta una ocasión, el componedor cae a
 * `signature`. Están completas para las tres estaciones del prototipo.
 */
export const SEASON_STYLE_VOICE: Record<SeasonId, SeasonStyleVoice> = {
  "primavera-clara": {
    seasonId: "primavera-clara",
    essence:
      "Tu paleta vive en la primera hora de la mañana: colores lavados por la luz, tibios pero sin peso.",
    signature:
      "En primavera clara el truco es no cargar: cuando todo el conjunto se mantiene en tonos que la luz atraviesa, tus rasgos son lo primero que se ve.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los tonos muy densos te añaden años cerca de la cara; llévalos de la cintura para abajo.",
  },
  "primavera-calida": {
    seasonId: "primavera-calida",
    essence:
      "Tu paleta tiene la temperatura del cobre y la miel: colores con sol dentro, saturados sin llegar a estridentes.",
    signature:
      "La primavera cálida pide colores que parezcan iluminados desde dentro; en cuanto entra un tono ceniciento, el conjunto se apaga aunque la prenda sea impecable.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los grises fríos y los rosas empolvados te restan el brillo natural; resérvalos para accesorios lejos del rostro.",
  },
  "primavera-brillante": {
    seasonId: "primavera-brillante",
    essence:
      "Tu paleta es de color puro y sin mezcla: tonos limpios, de alta saturación, que no se disculpan.",
    signature:
      "La primavera brillante aguanta color puro que a otras personas les quedaría grande; lo que no perdona son los tonos empolvados, que a tu lado parecen sucios.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los tonos apagados o agrisados te quitan nitidez; si te gustan, úsalos en la prenda inferior.",
  },
  "verano-claro": {
    seasonId: "verano-claro",
    essence:
      "Tu paleta es de acuarela: tonos fríos diluidos en agua, ninguno pesa más que otro.",
    signature:
      "En verano claro los conjuntos funcionan por cercanía, no por choque: dos tonos vecinos y un neutro suave dicen más que cualquier contraste fuerte.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "El negro y los tonos tostados te endurecen el rostro; cámbialos por gris perla o azul niebla arriba.",
  },
  "verano-frio": {
    seasonId: "verano-frio",
    essence:
      "Tu paleta viene del agua profunda: azules, malvas y ciruelas que se sostienen sin necesidad de brillo.",
    signature:
      "El verano frío se luce con tonos que tienen agua dentro; cualquier color con base anaranjada rompe la coherencia del conjunto de inmediato.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los naranjas y mostazas pelean con tu subtono; llévalos solo en calzado o bolso.",
  },
  "verano-suave": {
    seasonId: "verano-suave",
    essence:
      "Tu paleta está tamizada: colores fríos con una veladura gris que los vuelve serenos y fáciles de combinar entre sí.",
    signature:
      "El verano suave gana con mezcla, no con definición: cuando dos tonos apagados se rozan sin marcar el límite, el conjunto se ve caro y tú te ves descansada.",
    occasionNotes: {
      casual:
        "Para el día a día, quédate en tres tonos de la misma familia y deja que la textura haga el trabajo que aquí no debe hacer el color.",
      trabajo:
        "En la oficina, un neutro medio con la camisa un punto más clara basta: el verano suave no necesita el blanco óptico, que le resulta demasiado duro.",
      elegante:
        "Lo elegante en tu caso no es el contraste sino la sutileza: un conjunto tono sobre tono con un accesorio en plata mate se lee más refinado que cualquier combinación marcada.",
      cita: "Para una cita, un malva o un azul empolvado cerca de la cara te suaviza los rasgos más que un color intenso, que tiende a llevarse toda la atención.",
      noche:
        "De noche evita el negro puro: un gris pizarra o un ciruela apagado te dan la misma formalidad sin el corte tan seco contra la piel.",
      "clima-calido":
        "Con calor, los tonos lavados de tu paleta funcionan solos; basta con no meter blanco brillante, que a tu lado se ve azulado.",
      "clima-frio":
        "En frío, superpón tres neutros cercanos entre sí: el verano suave luce mejor en capas apagadas que en un único color fuerte.",
    },
    avoidNearFaceAdvice:
      "Los colores muy saturados o fluorescentes te sobrepasan; si los quieres, que estén lejos del rostro.",
  },
  "otono-suave": {
    seasonId: "otono-suave",
    essence:
      "Tu paleta es de tierra tamizada: verdes, arenas y tostados apagados que parecen vistos con luz de tarde.",
    signature:
      "El otoño suave se sostiene en la tibieza discreta: los tonos deben tener algo de tierra dentro, y en cuanto uno se vuelve frío o brillante, desentona con el resto.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los azules eléctricos y fucsias te resultan demasiado fríos cerca de la cara; llévalos en accesorios pequeños.",
  },
  "otono-calido": {
    seasonId: "otono-calido",
    essence:
      "Tu paleta huele a especias: terracotas, mostazas y verdes oliva con la calidez del cobre.",
    signature:
      "El otoño cálido pide colores con pigmento de tierra; cuando entra un tono frío el conjunto se parte en dos y se nota aunque no se sepa por qué.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los pasteles fríos y los grises azulados te apagan; cámbialos por crema o camel arriba.",
  },
  "otono-profundo": {
    seasonId: "otono-profundo",
    essence:
      "Tu paleta es de bosque al anochecer: tonos densos y cálidos que ganan cuanta más profundidad tienen.",
    signature:
      "El otoño profundo necesita peso: los colores densos te sostienen la mirada, mientras que los claros te dejan sin base y hacen que la ropa parezca de otra persona.",
    occasionNotes: {
      casual:
        "Para el día a día, un tono tierra intenso arriba y un neutro oscuro abajo: tu contraste natural aguanta esa densidad sin esfuerzo.",
      trabajo:
        "En la oficina cambia el negro por un chocolate o un verde muy profundo; conservas la formalidad y ganas la calidez que el negro te quita.",
      elegante:
        "Lo elegante aquí es la saturación profunda: un vino o un petróleo oscuro te favorecen más que cualquier tono medio, que a tu lado se ve indeciso.",
      cita: "Para una cita, un terracota profundo cerca del rostro enciende el tono de piel mucho más que un color claro.",
      noche:
        "De noche estás en tu terreno: cuanto más profundo el tono, mejor te sienta. Un dorado envejecido como único brillo remata el conjunto.",
      "clima-calido":
        "Con calor, no recurras al blanco: usa camel, arena tostada u oliva claro, que son tus claros sin perder la tibieza.",
      "clima-frio":
        "En frío, capas de tonos profundos distintos entre sí: tu paleta permite superponer sin que se vuelva una mancha, porque cada tono tiene su propio pigmento.",
    },
    avoidNearFaceAdvice:
      "Los pasteles y los tonos claros fríos te dejan sin fuerza cerca de la cara; úsalos lejos del rostro o combinados con un tono profundo arriba.",
  },
  "invierno-brillante": {
    seasonId: "invierno-brillante",
    essence:
      "Tu paleta es de color puro sobre fondo nítido: tonos fríos y saturados que piden un blanco o un negro real al lado.",
    signature:
      "El invierno brillante se construye por choque limpio: un color puro contra un neutro rotundo. En cuanto se mete un tono tostado o empolvado, el conjunto pierde el filo.",
    occasionNotes: {
      casual:
        "Para el día a día, un color puro arriba y un jean oscuro abajo: el contraste que a otras personas les resulta excesivo a ti te define los rasgos.",
      trabajo:
        "En la oficina, blanco óptico con un neutro muy oscuro es tu base; añade un solo color saturado como acento y no más.",
      elegante:
        "Lo elegante en tu caso es la nitidez: dos colores, límites claros y plata pulida. Los tonos intermedios te enturbian el conjunto.",
      cita: "Para una cita, un fucsia o un rojo puro cerca del rostro te ilumina; los tonos apagados a tu lado parecen desteñidos.",
      noche:
        "De noche el negro es tuyo de verdad, y un acento en color puro lo levanta. Evita el marrón, que junto a tu paleta se ve apagado.",
      "clima-calido":
        "Con calor, blanco óptico con un turquesa o un magenta: tu paleta no necesita bajar de intensidad porque suba la temperatura.",
      "clima-frio":
        "En frío, un abrigo en neutro rotundo y una bufanda en color puro: el punto de color cerca de la cara es justo lo que tu contraste pide.",
    },
    avoidNearFaceAdvice:
      "Los tonos tostados, empolvados o anaranjados te restan nitidez; llévalos lejos del rostro o cámbialos por su versión fría.",
  },
  "invierno-frio": {
    seasonId: "invierno-frio",
    essence:
      "Tu paleta es de piedra preciosa fría: azules de tinta, esmeraldas y vinos con base azulada.",
    signature:
      "El invierno frío se apoya en tonos joya con base fría; cualquier calidez añadida hace que el conjunto pierda la elegancia seria que lo caracteriza.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los camel, mostazas y naranjas te enfrentan el subtono; úsalos solo en calzado o bolso.",
  },
  "invierno-profundo": {
    seasonId: "invierno-profundo",
    essence:
      "Tu paleta es nocturna: tonos fríos llevados al fondo, donde el color casi se confunde con la oscuridad.",
    signature:
      "El invierno profundo funciona con oscuridad deliberada: los tonos muy densos te sientan como a nadie, y basta un único punto claro para que todo el conjunto respire.",
    occasionNotes: {},
    avoidNearFaceAdvice:
      "Los tonos claros cálidos, como el crema o el melocotón, te desdibujan; llévalos abajo o combinados con un oscuro arriba.",
  },
};
