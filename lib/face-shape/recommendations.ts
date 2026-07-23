import type { FaceShapeId } from "@/types/face-shape";
import type { FaceRecommendationBundle } from "@/types/face-recommendations";
import { HAIRCUTS, HAIRSTYLES } from "@/data/haircuts";
import { FACE_GLASSES } from "@/data/glasses";
import { NECKLINES } from "@/data/necklines";
import { BEARDS } from "@/data/beards";
import { EARRINGS } from "@/data/earrings";
import { NECKLACES } from "@/data/necklaces";
import { HATS } from "@/data/hats";
import { FACE_MAKEUP } from "@/data/face-makeup";

/**
 * Reúne, para una forma, las recomendaciones que viven repartidas por categoría
 * en data/*.ts. Cada archivo es la fuente de verdad de su categoría; esto solo
 * las junta para la interfaz.
 */
export function getFaceRecommendations(shape: FaceShapeId): FaceRecommendationBundle {
  return {
    haircuts: HAIRCUTS[shape],
    hairstyles: HAIRSTYLES[shape],
    beard: BEARDS[shape],
    glasses: FACE_GLASSES[shape],
    earrings: EARRINGS[shape],
    necklaces: NECKLACES[shape],
    necklines: NECKLINES[shape],
    hats: HATS[shape],
    makeup: FACE_MAKEUP[shape],
  };
}
