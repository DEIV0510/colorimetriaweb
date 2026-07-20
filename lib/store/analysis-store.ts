import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ImageQualityResult } from "@/types/quality";
import type { CaptureValidation } from "@/types/face";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { EMPTY_ANSWERS } from "@/types/questionnaire";
import type { SkinColorResult } from "@/types/color";
import type { ClassificationResult } from "@/types/classification";

interface AnalysisState {
  photoDataUrl: string | null;
  photoQuality: ImageQualityResult | null;
  captureValidation: CaptureValidation | null;
  answers: QuestionnaireAnswers;
  skinColor: SkinColorResult | null;
  classification: ClassificationResult | null;
  consentGiven: boolean;
  noMakeupConfirmed: boolean;
  pipelineError: string | null;

  setPhoto: (dataUrl: string | null) => void;
  setPhotoQuality: (quality: ImageQualityResult | null) => void;
  setCaptureValidation: (validation: CaptureValidation | null) => void;
  setAnswers: (answers: QuestionnaireAnswers) => void;
  setSkinColor: (result: SkinColorResult | null) => void;
  setClassification: (result: ClassificationResult | null) => void;
  setConsent: (consentGiven: boolean, noMakeupConfirmed: boolean) => void;
  setPipelineError: (message: string | null) => void;
  resetPhoto: () => void;
  resetAll: () => void;
}

const initialState = {
  photoDataUrl: null,
  photoQuality: null,
  captureValidation: null,
  answers: EMPTY_ANSWERS,
  skinColor: null,
  classification: null,
  consentGiven: false,
  noMakeupConfirmed: false,
  pipelineError: null,
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      ...initialState,
      setPhoto: (photoDataUrl) => set({ photoDataUrl }),
      setPhotoQuality: (photoQuality) => set({ photoQuality }),
      setCaptureValidation: (captureValidation) => set({ captureValidation }),
      setAnswers: (answers) => set({ answers }),
      setSkinColor: (skinColor) => set({ skinColor }),
      setClassification: (classification) => set({ classification }),
      setConsent: (consentGiven, noMakeupConfirmed) =>
        set({ consentGiven, noMakeupConfirmed }),
      setPipelineError: (pipelineError) => set({ pipelineError }),
      resetPhoto: () =>
        set({
          photoDataUrl: null,
          photoQuality: null,
          captureValidation: null,
          skinColor: null,
          classification: null,
          pipelineError: null,
        }),
      resetAll: () => set(initialState),
    }),
    {
      name: "coloria-analysis",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        photoDataUrl: state.photoDataUrl,
        photoQuality: state.photoQuality,
        captureValidation: state.captureValidation,
        answers: state.answers,
        skinColor: state.skinColor,
        classification: state.classification,
        consentGiven: state.consentGiven,
        noMakeupConfirmed: state.noMakeupConfirmed,
      }),
    }
  )
);
