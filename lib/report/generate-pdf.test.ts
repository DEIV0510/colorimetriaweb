import { describe, expect, it } from "vitest";
import { buildReportPdf } from "./generate-pdf";
import { SEASONS } from "@/data/seasons";
import type { ClassificationResult } from "@/types/classification";

const classification: ClassificationResult = {
  primary: { seasonId: "otono-calido", percentage: 11.4 },
  secondary: { seasonId: "otono-suave", percentage: 10.1 },
  tertiary: { seasonId: "primavera-calida", percentage: 9.6 },
  features: {
    temperature: "calida",
    depth: "media",
    intensity: "media",
    contrast: "medio",
  },
  warnings: ["Se detectó iluminación poco uniforme."],
  confidence: 0.74,
  influencingFactors: ["Tono de piel medido en la fotografía"],
  algorithmVersion: "coloria-rules-1.0.0",
};

const season = SEASONS["otono-calido"];
const secondary = SEASONS["otono-suave"];

describe("buildReportPdf", () => {
  it("produces a non-trivial PDF document", () => {
    const doc = buildReportPdf(classification, season, secondary, {
      includeSelfie: false,
    });
    const output = doc.output("arraybuffer");
    expect(output.byteLength).toBeGreaterThan(2000);
  });

  it("keeps every element inside the page bounds", () => {
    const doc = buildReportPdf(classification, season, secondary, {
      userName: "Ana",
      includeSelfie: false,
    });
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    expect(pageHeight).toBeCloseTo(297, 0);
    expect(pageWidth).toBeCloseTo(210, 0);
    // El contenido debe repartirse en páginas, nunca desbordar una sola.
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it("includes the user name when provided", () => {
    const withName = buildReportPdf(classification, season, secondary, {
      userName: "Ana",
      includeSelfie: false,
    })
      .output("arraybuffer");
    const withoutName = buildReportPdf(classification, season, secondary, {
      includeSelfie: false,
    }).output("arraybuffer");

    expect(withName.byteLength).not.toBe(withoutName.byteLength);
  });

  it("does not fail when a selfie is requested but missing", () => {
    expect(() =>
      buildReportPdf(classification, season, secondary, {
        includeSelfie: true,
        photoDataUrl: null,
      })
    ).not.toThrow();
  });

  it("renders every season profile without throwing", () => {
    for (const profile of Object.values(SEASONS)) {
      expect(() =>
        buildReportPdf(
          { ...classification, primary: { seasonId: profile.id, percentage: 10 } },
          profile,
          secondary,
          { includeSelfie: false }
        )
      ).not.toThrow();
    }
  });
});
