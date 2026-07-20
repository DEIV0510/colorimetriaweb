import { jsPDF } from "jspdf";
import type { ClassificationResult } from "@/types/classification";
import type { SeasonProfile } from "@/types/classification";

const FEATURE_LABELS = {
  temperature: { calida: "Cálida", fria: "Fría", neutral: "Neutral", oliva: "Oliva" },
  depth: { clara: "Clara", media: "Media", profunda: "Profunda" },
  intensity: { brillante: "Brillante", media: "Media", suave: "Suave" },
  contrast: { bajo: "Bajo", medio: "Medio", alto: "Alto" },
};

export interface ReportOptions {
  userName?: string;
  includeSelfie: boolean;
  photoDataUrl?: string | null;
}

const MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export function buildReportPdf(
  classification: ClassificationResult,
  season: SeasonProfile,
  secondarySeason: SeasonProfile,
  options: ReportOptions
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const heading = (text: string, size = 13) => {
    ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(46, 32, 25);
    doc.text(text, MARGIN, y);
    y += size * 0.55;
  };

  const paragraph = (text: string, size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(74, 58, 48);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, MARGIN, y);
      y += 5;
    }
  };

  const swatchRow = (colors: string[]) => {
    const perRow = 8;
    const size = (CONTENT_WIDTH - (perRow - 1) * 2) / perRow;
    for (let i = 0; i < colors.length; i += perRow) {
      ensureSpace(size + 4);
      const rowColors = colors.slice(i, i + perRow);
      rowColors.forEach((color, index) => {
        const x = MARGIN + index * (size + 2);
        doc.setFillColor(color);
        doc.setDrawColor(228, 218, 208);
        doc.roundedRect(x, y, size, size, 1.5, 1.5, "FD");
      });
      y += size + 3;
    }
    y += 2;
  };

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(46, 32, 25);
  doc.text("ColorIA", MARGIN, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 93, 83);
  doc.text("Informe de colorimetría personal (estimación orientativa)", MARGIN, y);
  y += 8;

  if (options.userName) {
    paragraph(`Nombre: ${options.userName}`);
  }
  paragraph(`Fecha: ${new Date().toLocaleDateString("es-CO")}`);
  y += 3;

  heading("Resultado probable", 15);
  // El porcentaje se normaliza sobre las 12 estaciones, así que incluso un
  // encaje perfecto ronda el 12%. Imprimirlo como "compatibilidad" se leía como
  // un fracaso y contradecía el nivel de confianza mostrado justo debajo.
  paragraph(season.name);
  paragraph(season.description);
  paragraph(`Nivel de confianza estimado: ${Math.round(classification.confidence * 100)}%`);
  paragraph(`Segunda estación más cercana: ${secondarySeason.name}`);
  y += 3;

  heading("Características detectadas");
  paragraph(
    `Temperatura: ${FEATURE_LABELS.temperature[classification.features.temperature]}  ·  ` +
      `Profundidad: ${FEATURE_LABELS.depth[classification.features.depth]}  ·  ` +
      `Intensidad: ${FEATURE_LABELS.intensity[classification.features.intensity]}  ·  ` +
      `Contraste: ${FEATURE_LABELS.contrast[classification.features.contrast]}`
  );
  y += 3;

  heading("Paleta principal");
  swatchRow(season.palette);

  heading("Neutros recomendados");
  swatchRow(season.neutrals);

  heading("Metales sugeridos");
  paragraph(season.metals.join(", "));
  y += 2;

  heading("Colores menos recomendados cerca del rostro");
  swatchRow(season.avoid);

  heading("Recomendaciones de uso");
  season.recommendations.forEach((rec) => paragraph(`• ${rec}`));
  y += 3;

  if (options.includeSelfie && options.photoDataUrl) {
    ensureSpace(70);
    heading("Fotografía utilizada");
    try {
      doc.addImage(options.photoDataUrl, "JPEG", MARGIN, y, 45, 60);
      y += 64;
    } catch {
      paragraph("No se pudo incluir la fotografía en el informe.");
    }
  }

  ensureSpace(28);
  heading("Limitaciones");
  paragraph(
    "Este resultado se genera a partir de una fotografía y un cuestionario. La luz, la cámara, " +
      "la pantalla y otros factores pueden afectar la estimación. No es un diagnóstico profesional " +
      "ni un servicio médico, y no sustituye una asesoría de imagen presencial."
  );

  if (classification.warnings.length > 0) {
    y += 2;
    heading("Advertencias del análisis");
    classification.warnings.forEach((w) => paragraph(`• ${w}`));
  }

  return doc;
}

export function generateReportPdf(
  classification: ClassificationResult,
  season: SeasonProfile,
  secondarySeason: SeasonProfile,
  options: ReportOptions
): void {
  const doc = buildReportPdf(classification, season, secondarySeason, options);
  doc.save(`coloria-informe-${season.id}.pdf`);
}
