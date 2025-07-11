
import { useState } from 'react';
import { LegacyDetectionResult } from '../types';
import { Eye, Target, TrendingUp, ZoomIn, ZoomOut, RotateCcw, Download, ChevronDown, ChevronUp } from 'lucide-react';
import NutritionCard from './NutritionCard';

interface DetectionResultsProps {
  result: LegacyDetectionResult;
  onBack: () => void;
}

// Format number to maximum 2 decimal places
const formatNumber = (value: string | number): string => {
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    return (Math.round(num * 100) / 100).toString();
  }
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return (Math.round(value * 100) / 100).toString();
};

interface DetectionResultsProps {
  result: LegacyDetectionResult;
  onBack: () => void;
}

export default function DetectionResults({ result, onBack }: DetectionResultsProps) {
  const [imageZoom, setImageZoom] = useState(1);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `deteccion-ingredientes-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleIngredientDetails = (ingredientId: string) => {
    setSelectedIngredient(selectedIngredient === ingredientId ? null : ingredientId);
  };
  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Resultados de Detección</h2>
          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">{result.objectsDetected}</span>
            </div>
            <p className="text-sm opacity-90">Objetos detectados</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">{result.resolution}</span>
            </div>
            <p className="text-sm opacity-90">Resolución</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">{result.confidence}%</span>
            </div>
            <p className="text-sm opacity-90">Confianza promedio</p>
          </div>
        </div>
      </div>

      {/* Image and Ingredients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processed Image */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Imagen Procesada</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-700 rounded px-2 py-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={imageZoom <= 0.5}
                    className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-xs px-2">{Math.round(imageZoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    disabled={imageZoom >= 3}
                    className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="relative overflow-auto max-h-96 border rounded-lg">
              <img
                src={result.imageUrl}
                alt="Imagen procesada"
                className="w-full h-auto rounded-lg transition-transform duration-200"
                style={{ 
                  transform: `scale(${imageZoom})`,
                  transformOrigin: 'top left',
                  minHeight: '200px',
                  objectFit: 'contain'
                }}
              />
              {/* Detection boxes */}
              <div className="absolute inset-0 pointer-events-none">
                {result.ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="absolute border-2 border-green-400 bg-green-400/20 rounded"
                    style={{
                      left: `${ingredient.position.x * imageZoom}%`,
                      top: `${ingredient.position.y * imageZoom}%`,
                      width: `${ingredient.position.width * imageZoom}%`,
                      height: `${ingredient.position.height * imageZoom}%`,
                      transform: `scale(${1/imageZoom})`,
                      transformOrigin: 'top left'
                    }}
                  >
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-br whitespace-nowrap">
                      {ingredient.name} ({ingredient.confidence}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
            <h3 className="font-semibold">Ingredientes Detectados ({result.ingredients.length})</h3>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {result.ingredients.map((ingredient) => (
              <div key={ingredient.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleIngredientDetails(ingredient.id)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatNumber(ingredient.nutrition.calories)} kcal • Confianza: {ingredient.confidence}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      ingredient.confidence >= 80 ? 'bg-green-400' :
                      ingredient.confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    {selectedIngredient === ingredient.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {selectedIngredient === ingredient.id && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          🥗 Información Nutricional (por 100g)
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">Calorías:</span>
                            <span className="font-medium text-red-600">{formatNumber(ingredient.nutrition.calories)} kcal</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">Proteínas:</span>
                            <span className="font-medium text-blue-600">{formatNumber(ingredient.nutrition.protein)}g</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">Carbohidratos:</span>
                            <span className="font-medium text-green-600">{formatNumber(ingredient.nutrition.carbs)}g</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">Grasas:</span>
                            <span className="font-medium text-orange-600">{formatNumber(ingredient.nutrition.fat)}g</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">Fibra:</span>
                            <span className="font-medium text-purple-600">{formatNumber(ingredient.nutrition.fiber)}g</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">Azúcares:</span>
                            <span className="font-medium text-pink-600">{formatNumber(ingredient.nutrition.sugar)}g</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h6 className="font-medium text-blue-900 mb-1">✨ Información adicional:</h6>
                        <p className="text-sm text-blue-800">
                          ID: {ingredient.id} • Área detectada: {formatNumber(ingredient.position.width)}% × {formatNumber(ingredient.position.height)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nutrition Information */}
      <NutritionCard 
        nutrition={{
          calories: result.totalNutrition.calories,
          protein: result.totalNutrition.protein,
          carbs: result.totalNutrition.carbs,
          fat: result.totalNutrition.fat,
          fiber: result.totalNutrition.fiber,
          sugar: result.totalNutrition.sugar,
          sodium: result.totalNutrition.sodium,
          vitamin_c: 0,
          benefits: "Información nutricional calculada basada en los ingredientes detectados"
        }}
        title="Resumen Nutricional Total"
      />
    </div>
  );
}