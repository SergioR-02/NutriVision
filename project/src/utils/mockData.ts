import { DetectionResult, DetectedIngredient } from '../types';

export const generateMockDetection = (imageUrl: string): DetectionResult => {
  // Mock ingredients for a burger
  const mockIngredients: DetectedIngredient[] = [
    {
      id: '1',
      name: 'Pan de hamburguesa',
      confidence: 94,
      position: { x: 15, y: 10, width: 70, height: 25 },
      nutrition: { calories: 150, protein: 4.5, carbs: 28, fat: 2.5, fiber: 1.2, sugar: 3, sodium: 230 }
    },
    {
      id: '2',
      name: 'Carne de res',
      confidence: 92,
      position: { x: 20, y: 35, width: 60, height: 15 },
      nutrition: { calories: 250, protein: 22, carbs: 0, fat: 18, fiber: 0, sugar: 0, sodium: 75 }
    },
    {
      id: '3',
      name: 'Queso cheddar',
      confidence: 89,
      position: { x: 25, y: 50, width: 50, height: 8 },
      nutrition: { calories: 110, protein: 7, carbs: 1, fat: 9, fiber: 0, sugar: 0, sodium: 180 }
    },
    {
      id: '4',
      name: 'Lechuga',
      confidence: 87,
      position: { x: 30, y: 60, width: 40, height: 10 },
      nutrition: { calories: 5, protein: 0.5, carbs: 1, fat: 0, fiber: 0.5, sugar: 0.5, sodium: 2 }
    },
    {
      id: '5',
      name: 'Tomate',
      confidence: 85,
      position: { x: 35, y: 70, width: 30, height: 8 },
      nutrition: { calories: 10, protein: 0.5, carbs: 2, fat: 0, fiber: 0.5, sugar: 1.5, sodium: 1 }
    }
  ];

  // Calculate total nutrition
  const totalNutrition = mockIngredients.reduce((total, ingredient) => ({
    calories: total.calories + ingredient.nutrition.calories,
    protein: total.protein + ingredient.nutrition.protein,
    carbs: total.carbs + ingredient.nutrition.carbs,
    fat: total.fat + ingredient.nutrition.fat,
    fiber: total.fiber + ingredient.nutrition.fiber,
    sugar: total.sugar + ingredient.nutrition.sugar,
    sodium: total.sodium + ingredient.nutrition.sodium
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });

  return {
    imageUrl,
    ingredients: mockIngredients,
    totalNutrition,
    confidence: 89,
    resolution: '800×520',
    objectsDetected: mockIngredients.length
  };
};