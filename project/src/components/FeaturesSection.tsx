import { Brain, Zap, Target, Shield, Download, MousePointer2 } from 'lucide-react';
import Scene3D from './Scene3D';
import Scene3DErrorBoundary from './Scene3DErrorBoundary';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Detección de objetos inteligente',
      description: 'Identifica objetos instantáneamente en imágenes con tecnología de IA avanzada.',
      color: 'bg-blue-500'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Interfaz moderna y amigable',
      description: 'Diseño elegante y responsivo optimizado para una experiencia de usuario excepcional.',
      color: 'bg-purple-500'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Análisis detallado',
      description: 'Proporciona información específica y características de los objetos detectados con niveles de confianza.',
      color: 'bg-green-500'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Tecnología de vanguardia',
      description: 'Utiliza Google Gemini AI para obtener resultados precisos y confiables en tiempo real.',
      color: 'bg-indigo-500'
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: 'Descarga optimizada',
      description: 'Permite descargar las imágenes procesadas con detecciones marcadas de manera sencilla.',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Características Principales</h2>
      
      {/* Layout de dos columnas: Modelo 3D a la izquierda, información a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Modelo 3D - Mitad izquierda */}
        <div>
          <Scene3DErrorBoundary>
            <Scene3D />
          </Scene3DErrorBoundary>
        </div>
        
        {/* Información del modelo - Mitad derecha */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <MousePointer2 className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Modelo 3D Interactivo
            </h3>
            <div className="text-gray-600 space-y-2">
              <p className="flex items-center justify-center text-sm">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 text-xs">SCROLL</span>
                Hacer zoom
              </p>
              <p className="flex items-center justify-center text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2 text-xs">ARRASTRAR</span>
                Rotar modelo
              </p>
              <p className="flex items-center justify-center text-sm">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2 text-xs">BTN DERECHO</span>
                Mover posición
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de características originales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className={`${feature.color} text-white p-3 rounded-lg w-fit mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
