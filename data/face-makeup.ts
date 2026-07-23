// GENERADO a partir de recomendaciones por forma de rostro (visagismo, balance por
// oposición). Contenido revisado por críticos de exactitud y diferenciación.
// Editable a mano: es la fuente de verdad, no se regenera automáticamente.
import type { FaceShapeId } from "@/types/face-shape";
import type { MakeupReco } from "@/types/face-recommendations";

/** Maquillaje de contorno: dónde iluminar, dónde dar profundidad, cómo equilibrar. */
export const FACE_MAKEUP: Record<FaceShapeId, MakeupReco> = {
  "ovalo": {
    "illuminate": "Un toque de luz en el centro de la frente, el arco de la ceja y encima del pómulo realza la zona ancha natural sin recargarla; el óvalo pide mantener, no reconstruir.",
    "contour": "Sombra muy sutil solo bajo el pómulo si quieres definir; evita oscurecer frente y mentón, que alargaría un rostro ya de eje largo.",
    "balance": "Trabaja en horizontal: rubor difuminado hacia la sien (no hacia abajo) y cejas con tendencia recta más que muy arqueada, para acompañar el reparto parejo y no estirar el conjunto."
  },
  "redondo": {
    "illuminate": "Centro de la frente, dorso de la nariz y un toque en el mentón: una franja vertical iluminada tira del rostro hacia arriba y abajo, alargándolo.",
    "contour": "Bajo los pómulos (en diagonal hacia la oreja) y en los laterales de las mejillas y sienes, para hundir el ancho y esculpir el ángulo que falta.",
    "balance": "Cejas con un ángulo o quiebre marcado en lugar de arco muy redondo; rubor aplicado en diagonal hacia arriba, no en círculo sobre la manzana; así se añaden líneas ascendentes que rompen la redondez."
  },
  "cuadrado": {
    "illuminate": "Centro de la frente, el arco de Cupido y el hueso bajo la ceja para atraer luz al centro y ganar verticalidad; un toque en el mentón central para alargar.",
    "contour": "Sombra difuminada en las esquinas externas de la frente y, sobre todo, en los ángulos de la mandíbula para que retrocedan y se redondee el contorno.",
    "balance": "Rubor aplicado en diagonal ascendente hacia la sien (no horizontal) para levantar y curvar; ceja con un arco suave y redondeado en vez de recto; todo bien difuminado para que no aparezcan líneas nuevas."
  },
  "corazon": {
    "illuminate": "Ilumina el centro del mentón y la línea de la mandíbula para atraerlos hacia delante y dar presencia al tercio inferior estrecho.",
    "contour": "Difumina profundidad en los laterales de la frente y en las sienes anchas para hacer retroceder la zona que domina.",
    "balance": "Trabaja la horizontal en el tercio inferior: rubor en dirección hacia las orejas y a media mejilla para ensanchar ópticamente, y cejas de trazo suave (no muy elevadas ni gruesas) para no sumar peso arriba."
  },
  "diamante": {
    "illuminate": "Ilumina las sienes y los laterales de la frente para abrir y ensanchar esa franja estrecha; añade un toque de luz en el centro del mentón para traer hacia delante el maxilar angosto.",
    "contour": "Aplica profundidad justo bajo el pómulo y sobre su punto más saliente, difuminando hacia la oreja, para hacer retroceder la prominencia que domina el rostro.",
    "balance": "Trabaja las cejas con algo de horizontalidad y cola poco elevada para dar ancho a la frente; coloca el rubor más hacia el centro de la mejilla, nunca sobre el hueso alto, para no reforzar el pómulo. La idea es sumar presencia arriba y abajo, y calmar el centro."
  },
  "alargado": {
    "illuminate": "Ilumina los laterales de las mejillas y bajo los pómulos hacia las sienes para traer esas zonas hacia delante y ensanchar la parte media del rostro.",
    "contour": "Da profundidad con un tono más oscuro en el nacimiento del pelo (frente) y en la punta del mentón, para restar centímetros al eje vertical.",
    "balance": "Trabaja el rubor en horizontal, extendido hacia las orejas en lugar de subirlo, y define las cejas con un trazo más recto que arqueado: ambas cosas suman líneas horizontales que equilibran el largo."
  }
};
