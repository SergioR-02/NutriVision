import { DetectionResult, LegacyDetectionResult, LegacyIngredient } from '../types';

/**
 * Formats a number to maximum 2 decimal places
 */
const formatNumber = (value: number): number => {
  return Math.round(value * 100) / 100;
};

/**
 * Converts backend DetectionResult to the format expected by DetectionResults component
 */
export const convertBackendToLegacyFormat = (backendResult: DetectionResult): LegacyDetectionResult => {
  // Convert detections to legacy ingredients format
  const ingredients: LegacyIngredient[] = backendResult.detections.map((detection) => {
    // Convert normalized bbox to percentage position
    const [x1, y1, x2, y2] = detection.normalized_bbox;
    const position = {
      x: formatNumber(x1 * 100),
      y: formatNumber(y1 * 100),
      width: formatNumber((x2 - x1) * 100),
      height: formatNumber((y2 - y1) * 100),
    };

    // Convert nutrition data
    const nutrition = {
      calories: formatNumber(typeof detection.nutrition.calories === 'string' 
        ? parseFloat(detection.nutrition.calories) || 0 
        : detection.nutrition.calories),
      protein: formatNumber(typeof detection.nutrition.protein === 'string' 
        ? parseFloat(detection.nutrition.protein) || 0 
        : detection.nutrition.protein),
      carbs: formatNumber(typeof detection.nutrition.carbs === 'string' 
        ? parseFloat(detection.nutrition.carbs) || 0 
        : detection.nutrition.carbs),
      fat: formatNumber(typeof detection.nutrition.fat === 'string' 
        ? parseFloat(detection.nutrition.fat) || 0 
        : detection.nutrition.fat),
      fiber: formatNumber(typeof detection.nutrition.fiber === 'string' 
        ? parseFloat(detection.nutrition.fiber) || 0 
        : detection.nutrition.fiber),
      sugar: 0, // Backend doesn't provide sugar, set to 0
      sodium: 0, // Backend doesn't provide sodium, set to 0
    };

    return {
      id: detection.id.toString(),
      name: detection.label,
      confidence: Math.round(detection.confidence * 100),
      position,
      nutrition,
    };
  });

  // Calculate total nutrition
  const totalNutrition = ingredients.reduce((total, ingredient) => ({
    calories: formatNumber(total.calories + ingredient.nutrition.calories),
    protein: formatNumber(total.protein + ingredient.nutrition.protein),
    carbs: formatNumber(total.carbs + ingredient.nutrition.carbs),
    fat: formatNumber(total.fat + ingredient.nutrition.fat),
    fiber: formatNumber(total.fiber + ingredient.nutrition.fiber),
    sugar: formatNumber(total.sugar + ingredient.nutrition.sugar),
    sodium: formatNumber(total.sodium + ingredient.nutrition.sodium),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });

  // Calculate average confidence
  const avgConfidence = ingredients.length > 0 
    ? Math.round(ingredients.reduce((sum, ing) => sum + ing.confidence, 0) / ingredients.length)
    : 0;

  return {
    imageUrl: backendResult.processed_image,
    ingredients,
    totalNutrition,
    confidence: avgConfidence,
    resolution: `${backendResult.original_size.width}×${backendResult.original_size.height}`,
    objectsDetected: backendResult.total_objects,
  };
};
