import type { OutfitTemplate } from "@/types/style";

/**
 * Plantillas de conjunto. Declaran ROLES y cascadas de color, nunca hex
 * concretos: el motor las resuelve contra la paleta de cada estación, así que
 * 12 estaciones × 7 ocasiones salen de estas pocas plantillas sin escribir
 * cientos de textos.
 *
 * `colorSource` va en orden de preferencia. El reparto por luminosidad deja
 * huecos en 11 de las 12 estaciones (verano-claro no tiene colores oscuros,
 * otono-profundo no tiene claros), de ahí la cascada.
 */
export const OUTFIT_TEMPLATES: OutfitTemplate[] = [
  {
    id: "casual",
    occasion: "casual",
    title: "Día a día",
    styleTags: ["casual", "minimalista", "urbano"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["paleta-media", "paleta-clara", "paleta-oscura", "cualquier-paleta"],
        garments: {
          femenina: [
            { label: "Blusa de algodón", id: "blusa" },
            { label: "Camiseta de punto fino", id: "camiseta" },
          ],
          masculina: [
            { label: "Camiseta de algodón", id: "camiseta" },
            { label: "Camisa de manga corta", id: "camisa" },
          ],
          neutral: [
            { label: "Camiseta de algodón", id: "camiseta" },
            { label: "Camisa ligera", id: "camisa" },
          ],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["soporte-denim", "neutro-medio", "neutro-oscuro", "cualquier-neutro"],
        garments: {
          femenina: [
            { label: "Jean recto", id: "pantalon" },
            { label: "Pantalón de algodón", id: "pantalon" },
          ],
          masculina: [
            { label: "Jean recto", id: "pantalon" },
            { label: "Chino de algodón", id: "pantalon" },
          ],
          neutral: [
            { label: "Jean recto", id: "pantalon" },
            { label: "Pantalón de algodón", id: "pantalon" },
          ],
        },
      },
      {
        slot: "calzado",
        role: "secundario",
        nearFace: false,
        colorSource: ["neutro-medio", "neutro-oscuro", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Tenis de cuero", id: "zapato" }],
          masculina: [{ label: "Tenis de cuero", id: "zapato" }],
          neutral: [{ label: "Tenis de cuero", id: "zapato" }],
        },
      },
      {
        slot: "accesorio",
        role: "acento",
        nearFace: false,
        optional: true,
        colorSource: ["paleta-statement", "cualquier-paleta"],
        garments: {
          femenina: [{ label: "Bolso cruzado", id: "bolso" }],
          masculina: [{ label: "Morral compacto", id: "bolso" }],
          neutral: [{ label: "Bolso cruzado", id: "bolso" }],
        },
      },
    ],
  },
  {
    id: "trabajo",
    occasion: "trabajo",
    title: "Trabajo u oficina",
    styleTags: ["clasico", "elegante", "minimalista"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["neutro-claro", "paleta-clara", "paleta-media", "cualquier-paleta"],
        garments: {
          femenina: [
            { label: "Camisa de popelina", id: "camisa" },
            { label: "Blusa de seda", id: "blusa" },
          ],
          masculina: [{ label: "Camisa de vestir", id: "camisa" }],
          neutral: [{ label: "Camisa de vestir", id: "camisa" }],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "neutro-medio", "paleta-oscura", "cualquier-neutro"],
        garments: {
          femenina: [
            { label: "Pantalón sastre", id: "pantalon" },
            { label: "Falda lápiz", id: "falda" },
          ],
          masculina: [{ label: "Pantalón sastre", id: "pantalon" }],
          neutral: [{ label: "Pantalón sastre", id: "pantalon" }],
        },
      },
      {
        slot: "capa",
        role: "secundario",
        nearFace: true,
        colorSource: ["paleta-oscura", "neutro-oscuro", "paleta-media", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Blazer estructurado", id: "chaqueta" }],
          masculina: [{ label: "Blazer estructurado", id: "chaqueta" }],
          neutral: [{ label: "Blazer estructurado", id: "chaqueta" }],
        },
      },
      {
        slot: "calzado",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Zapato cerrado", id: "zapato" }],
          masculina: [{ label: "Zapato de cuero", id: "zapato" }],
          neutral: [{ label: "Zapato de cuero", id: "zapato" }],
        },
      },
    ],
  },
  {
    id: "elegante",
    occasion: "elegante",
    title: "Elegante",
    styleTags: ["elegante", "clasico"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["paleta-statement", "paleta-media", "cualquier-paleta"],
        garments: {
          femenina: [
            { label: "Vestido midi", id: "vestido" },
            { label: "Blusa de seda", id: "blusa" },
          ],
          masculina: [{ label: "Camisa de algodón fino", id: "camisa" }],
          neutral: [{ label: "Camisa de algodón fino", id: "camisa" }],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "neutro-medio", "paleta-oscura", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Pantalón de pinzas", id: "pantalon" }],
          masculina: [{ label: "Pantalón de pinzas", id: "pantalon" }],
          neutral: [{ label: "Pantalón de pinzas", id: "pantalon" }],
        },
      },
      {
        slot: "calzado",
        role: "secundario",
        nearFace: false,
        colorSource: ["neutro-oscuro", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Zapato de tacón bajo", id: "zapato" }],
          masculina: [{ label: "Zapato Oxford", id: "zapato" }],
          neutral: [{ label: "Zapato de vestir", id: "zapato" }],
        },
      },
    ],
  },
  {
    id: "cita",
    occasion: "cita",
    title: "Salida o cita",
    styleTags: ["romantico", "elegante", "creativo"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["paleta-statement", "paleta-media", "cualquier-paleta"],
        garments: {
          femenina: [
            { label: "Blusa fluida", id: "blusa" },
            { label: "Vestido corto", id: "vestido" },
          ],
          masculina: [{ label: "Camisa entallada", id: "camisa" }],
          neutral: [{ label: "Camisa entallada", id: "camisa" }],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "soporte-denim", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [
            { label: "Jean oscuro", id: "pantalon" },
            { label: "Falda midi", id: "falda" },
          ],
          masculina: [{ label: "Jean oscuro", id: "pantalon" }],
          neutral: [{ label: "Jean oscuro", id: "pantalon" }],
        },
      },
      {
        slot: "calzado",
        role: "secundario",
        nearFace: false,
        colorSource: ["neutro-medio", "neutro-oscuro", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Botín de cuero", id: "zapato" }],
          masculina: [{ label: "Botín de cuero", id: "zapato" }],
          neutral: [{ label: "Botín de cuero", id: "zapato" }],
        },
      },
      {
        slot: "accesorio",
        role: "acento",
        nearFace: false,
        optional: true,
        colorSource: ["paleta-statement", "cualquier-paleta"],
        garments: {
          femenina: [{ label: "Bolso pequeño", id: "bolso" }],
          masculina: [{ label: "Cinturón de cuero", id: "bolso" }],
          neutral: [{ label: "Bolso pequeño", id: "bolso" }],
        },
      },
    ],
  },
  {
    id: "noche",
    occasion: "noche",
    title: "Evento de noche",
    styleTags: ["elegante", "creativo"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["paleta-oscura", "paleta-statement", "neutro-oscuro", "cualquier-paleta"],
        garments: {
          femenina: [
            { label: "Vestido de noche", id: "vestido" },
            { label: "Blusa de satén", id: "blusa" },
          ],
          masculina: [{ label: "Camisa de vestir", id: "camisa" }],
          neutral: [{ label: "Camisa de vestir", id: "camisa" }],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "soporte-oscuro", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Pantalón de vestir", id: "pantalon" }],
          masculina: [{ label: "Pantalón de vestir", id: "pantalon" }],
          neutral: [{ label: "Pantalón de vestir", id: "pantalon" }],
        },
      },
      {
        slot: "capa",
        role: "secundario",
        nearFace: true,
        optional: true,
        colorSource: ["neutro-oscuro", "paleta-oscura", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Blazer de terciopelo", id: "chaqueta" }],
          masculina: [{ label: "Saco estructurado", id: "chaqueta" }],
          neutral: [{ label: "Saco estructurado", id: "chaqueta" }],
        },
      },
      {
        slot: "calzado",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "soporte-oscuro", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Zapato de tacón", id: "zapato" }],
          masculina: [{ label: "Zapato de vestir", id: "zapato" }],
          neutral: [{ label: "Zapato de vestir", id: "zapato" }],
        },
      },
    ],
  },
  {
    id: "clima-calido",
    occasion: "clima-calido",
    title: "Clima cálido",
    styleTags: ["casual", "minimalista", "romantico"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["paleta-clara", "paleta-media", "neutro-claro", "cualquier-paleta"],
        garments: {
          femenina: [
            { label: "Blusa de lino", id: "blusa" },
            { label: "Vestido ligero", id: "vestido" },
          ],
          masculina: [{ label: "Camisa de lino", id: "camisa" }],
          neutral: [{ label: "Camisa de lino", id: "camisa" }],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-claro", "soporte-blanco", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [
            { label: "Pantalón de lino", id: "pantalon" },
            { label: "Falda fluida", id: "falda" },
          ],
          masculina: [{ label: "Pantalón de lino", id: "pantalon" }],
          neutral: [{ label: "Pantalón de lino", id: "pantalon" }],
        },
      },
      {
        slot: "calzado",
        role: "secundario",
        nearFace: false,
        colorSource: ["neutro-claro", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Sandalia de cuero", id: "zapato" }],
          masculina: [{ label: "Mocasín ligero", id: "zapato" }],
          neutral: [{ label: "Sandalia de cuero", id: "zapato" }],
        },
      },
    ],
  },
  {
    id: "clima-frio",
    occasion: "clima-frio",
    title: "Clima frío",
    styleTags: ["clasico", "urbano", "minimalista"],
    slots: [
      {
        slot: "superior",
        role: "principal",
        nearFace: true,
        colorSource: ["paleta-media", "paleta-oscura", "cualquier-paleta"],
        garments: {
          femenina: [{ label: "Suéter de lana", id: "camiseta" }],
          masculina: [{ label: "Suéter de lana", id: "camiseta" }],
          neutral: [{ label: "Suéter de lana", id: "camiseta" }],
        },
      },
      {
        slot: "capa",
        role: "secundario",
        nearFace: true,
        colorSource: ["neutro-oscuro", "neutro-medio", "paleta-oscura", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Abrigo largo", id: "abrigo" }],
          masculina: [{ label: "Abrigo largo", id: "abrigo" }],
          neutral: [{ label: "Abrigo largo", id: "abrigo" }],
        },
      },
      {
        slot: "inferior",
        role: "neutro",
        nearFace: false,
        colorSource: ["neutro-oscuro", "soporte-denim", "neutro-medio", "cualquier-neutro"],
        garments: {
          femenina: [{ label: "Pantalón de lana", id: "pantalon" }],
          masculina: [{ label: "Pantalón de lana", id: "pantalon" }],
          neutral: [{ label: "Pantalón de lana", id: "pantalon" }],
        },
      },
      {
        slot: "accesorio",
        role: "acento",
        nearFace: true,
        optional: true,
        colorSource: ["paleta-statement", "paleta-media", "cualquier-paleta"],
        garments: {
          femenina: [{ label: "Bufanda de lana", id: "bufanda" }],
          masculina: [{ label: "Bufanda de lana", id: "bufanda" }],
          neutral: [{ label: "Bufanda de lana", id: "bufanda" }],
        },
      },
    ],
  },
];
