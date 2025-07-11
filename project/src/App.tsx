import { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import DetectionResults from './components/DetectionResults';
import AboutPage from './components/AboutPage';
import ConnectionStatus from './components/ConnectionStatus';
import ToastContainer from './components/ToastContainer';
import { LegacyDetectionResult } from './types';
import { detectIngredients } from './services/api';
import { convertBackendToLegacyFormat } from './utils/dataConverter';
import { useToast } from './hooks/useToast';

type PageType = 'home' | 'results' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<LegacyDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, showSuccess, showError, showNetwork } = useToast();

  const handleConnectionChange = (connected: boolean) => {
    if (!connected && !error) {
      showNetwork('No se puede conectar al servidor. Asegúrate de que el backend esté ejecutándose en http://localhost:8000');
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await detectIngredients(file);
      const legacyResult = convertBackendToLegacyFormat(result);
      setDetectionResult(legacyResult);
      setCurrentPage('results');
      showSuccess(`¡Detección completada! Se encontraron ${result.total_objects} ingredientes.`);
    } catch (error: any) {
      console.error('Error processing image:', error);
      
      let errorMessage = 'Error al procesar la imagen. ';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage += 'No se puede conectar al servidor. Asegúrate de que el backend esté ejecutándose en http://localhost:8000';
        showNetwork(errorMessage, 7000);
      } else if (error.response) {
        errorMessage += `Error del servidor: ${error.response.status} - ${error.response.data?.detail || 'Error desconocido'}`;
        showError(errorMessage, 6000);
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += 'La solicitud tardó demasiado tiempo. Intenta con una imagen más pequeña.';
        showError(errorMessage, 6000);
      } else {
        errorMessage += error.message || 'Error desconocido';
        showError(errorMessage, 6000);
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setDetectionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Analiza la nutrición de tus
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> alimentos con IA</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                NutriVision AI utiliza inteligencia artificial avanzada para detectar ingredientes y proporcionar análisis nutricional completo
              </p>
              
              <ConnectionStatus onConnectionChange={handleConnectionChange} />
            </div>

            {error && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <button
                        onClick={() => setError(null)}
                        className="inline-flex text-red-400 hover:text-red-600"
                      >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ImageUploader 
              onImageUpload={handleImageUpload} 
              isProcessing={isProcessing}
              onError={showError}
            />
          </div>
        )}

        {currentPage === 'results' && detectionResult && (
          <DetectionResults result={detectionResult} onBack={handleBackToHome} />
        )}

        {currentPage === 'about' && <AboutPage />}
      </main>
      
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default App;