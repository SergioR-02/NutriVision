import { NutritionInfo } from '../types';

interface NutritionCardProps {
  nutrition: NutritionInfo;
  title: string;
}

export default function NutritionCard({ nutrition, title }: NutritionCardProps) {
  const nutritionItems = [
    { label: 'Calorías', value: nutrition.calories, unit: 'kcal', color: 'text-red-600' },
    { label: 'Proteínas', value: nutrition.protein, unit: 'g', color: 'text-blue-600' },
    { label: 'Carbohidratos', value: nutrition.carbs, unit: 'g', color: 'text-green-600' },
    { label: 'Grasas', value: nutrition.fat, unit: 'g', color: 'text-orange-600' },
    { label: 'Fibra', value: nutrition.fiber, unit: 'g', color: 'text-purple-600' },
    ...(nutrition.sugar !== undefined ? [{ label: 'Azúcares', value: nutrition.sugar, unit: 'g', color: 'text-pink-600' }] : []),
    ...(nutrition.sodium !== undefined ? [{ label: 'Sodio', value: nutrition.sodium, unit: 'mg', color: 'text-indigo-600' }] : [])
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {nutritionItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className={`text-sm font-bold ${item.color}`}>
              {item.value} {item.unit}
            </span>
          </div>
        ))}
      </div>
      
      {nutrition.benefits && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">✨ Beneficios:</h4>
          <p className="text-sm text-blue-800">{nutrition.benefits}</p>
        </div>
      )}
    </div>
  );
}