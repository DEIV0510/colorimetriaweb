import type { FaceShapeId } from "@/types/face-shape";

/**
 * Preguntas frecuentes del escáner de geometría facial. Una lista general
 * (válida para todo el módulo) y un apunte propio por forma, para que la sección
 * no repita lo mismo en las seis.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const GENERAL_FAQ: FaqItem[] = [
  {
    q: "¿Esto es un diagnóstico definitivo?",
    a: "No. Es una estimación a partir de los puntos que la cámara detecta en tu rostro. El encuadre, el ángulo y el peinado influyen, así que tómalo como una guía, no como una etiqueta fija.",
  },
  {
    q: "¿Y si estoy entre dos formas?",
    a: "Es lo normal: casi ningún rostro es una forma pura. Por eso mostramos un porcentaje para cada una. Si tu segunda posibilidad es alta, mira también sus consejos: muchos servirán para tu rostro.",
  },
  {
    q: "¿Puedo cambiar la forma de mi rostro?",
    a: "La estructura ósea no cambia con el estilo, pero sí se puede equilibrar visualmente. De eso trata el balance por oposición: no se corrige el rostro, se juega con líneas y volúmenes para armonizar las proporciones.",
  },
  {
    q: "¿Tengo que seguir estas recomendaciones al pie de la letra?",
    a: "No. Son criterios orientativos de asesoría de imagen, no reglas. Tu gusto y tu personalidad mandan; esto solo te da el porqué detrás de cada opción para que elijas con más información.",
  },
  {
    q: "¿Por qué me pide una foto de frente y sin flequillo tapando la cara?",
    a: "Las medidas se toman sobre el contorno y la mandíbula. Si el pelo o un ángulo lateral los tapan, las proporciones salen distorsionadas y la forma detectada puede cambiar.",
  },
];

export const SHAPE_FAQ: Record<FaceShapeId, FaqItem> = {
  ovalo: {
    q: "Si el óvalo es tan equilibrado, ¿me vale cualquier estilo?",
    a: "Casi. Tienes mucha libertad, así que la decisión pasa más por tu color, tu gusto y la ocasión que por corregir proporciones. El único cuidado es no romper la simetría con un elemento demasiado extremo.",
  },
  redondo: {
    q: "¿El pelo corto me redondea más la cara?",
    a: "No por ser corto, sino por dónde lleva el volumen. Un corto con altura arriba y despejado a los lados alarga; un corto redondeado a la altura de las mejillas sí acentúa la redondez.",
  },
  cuadrado: {
    q: "¿Suavizar la mandíbula significa esconderla?",
    a: "No. La mandíbula marcada es un rasgo con carácter; suavizar es acompañarla con curvas y movimiento para que no sea lo único que se ve, no taparla.",
  },
  corazon: {
    q: "¿Por qué me dicen que evite volumen en la frente?",
    a: "Porque tu frente ya es la parte más ancha. Añadirle volumen o un flequillo denso acentúa el contraste con el mentón estrecho; el equilibrio llega dando peso abajo, no arriba.",
  },
  diamante: {
    q: "¿No basta con disimular los pómulos?",
    a: "Apagar los pómulos suele salir peor. Funciona mejor lo contrario: ensanchar la frente y la mandíbula, que son estrechas, para que los pómulos dejen de ser el único punto ancho.",
  },
  alargado: {
    q: "¿El flequillo es obligatorio en mi rostro?",
    a: "No es obligatorio, pero ayuda mucho: acorta la frente, que suele ser lo que más alarga la cara. Si no quieres flequillo, gana anchura con ondas y capas a la altura de las mejillas.",
  },
};
