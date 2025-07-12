
import { Eye } from 'lucide-react';
import FeaturesSection from './FeaturesSection';

export default function AboutPage() {
  const techStack = [
    { category: 'Frontend', items: 'React 18, Vite, Tailwind', color: 'bg-blue-100 text-blue-800' },
    { category: 'Backend', items: 'FastAPI, Python 3.10', color: 'bg-green-100 text-green-800' },
    { category: 'Inteligencia Artificial', items: 'Google Gemini AI, OpenCV', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-white/20 p-3 rounded-full">
            <Eye className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Sobre NutriVision AI</h1>
        </div>
        <p className="text-lg text-white/90 max-w-9xl">
          NutriVision AI es una aplicación de detección de ingredientes y análisis nutricional de nueva generación 
          impulsada por el modelo Gemini de Google. Nuestra aplicación puede identificar ingredientes en platos de comida 
          y proporcionar información nutricional detallada con alta precisión y velocidad.
        </p>
      </div>

      {/* Features with 3D Model */}
      <FeaturesSection />

      {/* Tech Stack */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Stack Tecnológico</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className={`${tech.color} px-3 py-1 rounded-full text-sm font-medium w-fit mb-3`}>
                {tech.category}
              </div>
              <p className="text-gray-700 font-medium">{tech.items}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Sube tu imagen', description: 'Selecciona o arrastra una imagen desde tu dispositivo' },
            { step: '2', title: 'Procesamiento IA', description: 'Nuestro modelo analiza la imagen usando tecnología avanzada' },
            { step: '3', title: 'Detección', description: 'Identificamos y localizamos objetos con alta precisión' },
            { step: '4', title: 'Resultados', description: 'Obtienes información detallada sobre los objetos detectados' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white rounded-xl p-6 text-center">
        <p className="text-gray-300">
          Desarrollado por <span className="text-white font-semibold">Sergio Alejandro Ruiz Hurtado</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Powered by Google Gemini AI & Modern Web Technologies
        </p>
      </div>
    </div>
  );
}