export interface NutritionInfo {
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  fiber: number | string;
  vitamin_c: number | string;
  benefits: string;
  sugar?: number;
  sodium?: number;
}

export interface DetectedIngredient {
  id: number;
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
  normalized_bbox: [number, number, number, number];
  area: number;
  nutrition: NutritionInfo;
}

export interface NutritionalSummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  ingredients_count: number;
}

export interface DetectionResult {
  success: boolean;
  detections: DetectedIngredient[];
  processed_image: string;
  original_size: {
    width: number;
    height: number;
  };
  total_objects: number;
  nutritional_summary: NutritionalSummary;
  message: string;
}

// Legacy types for compatibility with existing UI components
export interface LegacyIngredient {
  id: string;
  name: string;
  confidence: number;
  position: { x: number; y: number; width: number; height: number };
  nutrition: { 
    calories: number; 
    protein: number; 
    carbs: number; 
    fat: number; 
    fiber: number; 
    sugar: number; 
    sodium: number 
  };
}

export interface LegacyDetectionResult {
  imageUrl: string;
  ingredients: LegacyIngredient[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  confidence: number;
  resolution: string;
  objectsDetected: number;
}