import { describe, expect, it } from "vitest";
import { classifySeason } from "./classify-season";
import type { SkinColorResult } from "@/types/color";
import { EMPTY_ANSWERS } from "@/types/questionnaire";
import type { QuestionnaireAnswers } from "@/types/questionnaire";

function makeSkinColor(lab: { l: number; a: number; b: number }, chroma: number, hue: number): SkinColorResult {
  return {
    regions: [],
    combined: {
      rgb: { r: 200, g: 170, b: 140 },
      lab,
      lch: { l: lab.l, c: chroma, h: hue },
    },
    overallConfidence: 0.85,
    lightingWarning: false,
  };
}

const baseInputs = {
  imageQuality: "buena" as const,
  answeredQuestionCount: 6,
  totalQuestionCount: 6,
};

describe("classifySeason", () => {
  it("produces a valid classification with plausible confidence", () => {
    const result = classifySeason({
      skinColor: makeSkinColor({ l: 62, a: 14, b: 20 }, 18, 50),
      answers: { ...EMPTY_ANSWERS, naturalHairColor: "rubio", eyeColor: "azul_gris" },
      ...baseInputs,
    });

    expect(result.primary.seasonId).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.primary.percentage).toBeGreaterThan(0);
  });

  it("does not always return the same season across varied profiles", () => {
    const profiles: Array<[{ l: number; a: number; b: number }, number, number, QuestionnaireAnswers]> = [
      [
        { l: 78, a: 8, b: 14 },
        10,
        45,
        { ...EMPTY_ANSWERS, naturalHairColor: "rubio", eyeColor: "azul_gris", sunReaction: "se_quema_facil" },
      ],
      [
        { l: 35, a: 16, b: 14 },
        14,
        25,
        { ...EMPTY_ANSWERS, naturalHairColor: "negro", eyeColor: "marron_oscuro", sunReaction: "broncea_facil" },
      ],
      [
        { l: 55, a: 18, b: 24 },
        22,
        55,
        { ...EMPTY_ANSWERS, naturalHairColor: "pelirrojo", eyeColor: "verde", sunReaction: "se_quema_y_broncea" },
      ],
      [
        { l: 45, a: 10, b: 10 },
        8,
        20,
        { ...EMPTY_ANSWERS, naturalHairColor: "castano_oscuro", eyeColor: "azul_gris", sunReaction: "se_quema_facil" },
      ],
    ];

    const seasons = profiles.map(([lab, chroma, hue, answers]) =>
      classifySeason({
        skinColor: makeSkinColor(lab, chroma, hue),
        answers,
        ...baseInputs,
      }).primary.seasonId
    );

    const uniqueSeasons = new Set(seasons);
    expect(uniqueSeasons.size).toBeGreaterThan(1);
  });

  it("lowers confidence when image quality is insufficient", () => {
    const good = classifySeason({
      skinColor: makeSkinColor({ l: 60, a: 14, b: 18 }, 16, 48),
      answers: { ...EMPTY_ANSWERS, naturalHairColor: "castano_claro" },
      imageQuality: "buena",
      answeredQuestionCount: 6,
      totalQuestionCount: 6,
    });

    const poor = classifySeason({
      skinColor: makeSkinColor({ l: 60, a: 14, b: 18 }, 16, 48),
      answers: { ...EMPTY_ANSWERS, naturalHairColor: "castano_claro" },
      imageQuality: "insuficiente",
      answeredQuestionCount: 6,
      totalQuestionCount: 6,
    });

    expect(poor.confidence).toBeLessThan(good.confidence);
  });

  // Requisito explícito del producto: la pregunta oro/plata es complementaria y
  // NUNCA puede decidir por sí sola el subtono.
  it("never lets the metal preference flip the detected temperature", () => {
    const labSamples = [
      { l: 78, a: 8, b: 14 },
      { l: 62, a: 14, b: 20 },
      { l: 55, a: 18, b: 24 },
      { l: 45, a: 10, b: 10 },
      { l: 35, a: 16, b: 14 },
      { l: 68, a: 12, b: 17 },
      { l: 50, a: 13, b: 16 },
    ];
    const hairs = ["negro", "castano_oscuro", "castano_claro", "rubio", "pelirrojo"] as const;

    for (const lab of labSamples) {
      for (const hair of hairs) {
        const base = { ...EMPTY_ANSWERS, naturalHairColor: hair, eyeColor: "verde" as const };

        const withGold = classifySeason({
          skinColor: makeSkinColor(lab, 16, 48),
          answers: { ...base, metalPreference: "oro" as const },
          ...baseInputs,
        });
        const withSilver = classifySeason({
          skinColor: makeSkinColor(lab, 16, 48),
          answers: { ...base, metalPreference: "plata" as const },
          ...baseInputs,
        });

        expect(
          withGold.features.temperature,
          `${hair} L=${lab.l}: el metal cambió la temperatura de ${withSilver.features.temperature} a ${withGold.features.temperature}`
        ).toBe(withSilver.features.temperature);
      }
    }
  });

  it("warns when questionnaire is incomplete", () => {
    const result = classifySeason({
      skinColor: makeSkinColor({ l: 60, a: 14, b: 18 }, 16, 48),
      answers: EMPTY_ANSWERS,
      imageQuality: "buena",
      answeredQuestionCount: 0,
      totalQuestionCount: 6,
    });

    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
