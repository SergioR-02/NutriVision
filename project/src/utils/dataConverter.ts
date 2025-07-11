import { DetectionResult, LegacyDetectionResult, LegacyIngredient } from '../types';

/**
 * Converts backend DetectionResult to the format expected by DetectionResults component
 */
export const convertBackendToLegacyFormat = (backendResult: DetectionResult): LegacyDetectionResult => {
  // Convert detections to legacy ingredients format
  const ingredients: LegacyIngredient[] = backendResult.detections.map((detection) => {
    // Convert normalized bbox to percentage position
    const [x1, y1, x2, y2] = detection.normalized_bbox;
    const position = {
      x: x1 * 100,
      y: y1 * 100,
      width: (x2 - x1) * 100,
      height: (y2 - y1) * 100,
    };

    // Convert nutrition data
    const nutrition = {
      calories: typeof detection.nutrition.calories === 'string' 
        ? parseFloat(detection.nutrition.calories) || 0 
        : detection.nutrition.calories,
      protein: typeof detection.nutrition.protein === 'string' 
        ? parseFloat(detection.nutrition.protein) || 0 
        : detection.nutrition.protein,
      carbs: typeof detection.nutrition.carbs === 'string' 
        ? parseFloat(detection.nutrition.carbs) || 0 
        : detection.nutrition.carbs,
      fat: typeof detection.nutrition.fat === 'string' 
        ? parseFloat(detection.nutrition.fat) || 0 
        : detection.nutrition.fat,
      fiber: typeof detection.nutrition.fiber === 'string' 
        ? parseFloat(detection.nutrition.fiber) || 0 
        : detection.nutrition.fiber,
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
    calories: total.calories + ingredient.nutrition.calories,
    protein: total.protein + ingredient.nutrition.protein,
    carbs: total.carbs + ingredient.nutrition.carbs,
    fat: total.fat + ingredient.nutrition.fat,
    fiber: total.fiber + ingredient.nutrition.fiber,
    sugar: total.sugar + ingredient.nutrition.sugar,
    sodium: total.sodium + ingredient.nutrition.sodium,
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
