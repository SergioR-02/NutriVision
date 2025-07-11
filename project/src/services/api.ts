import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for image processing
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DetectionResponse {
  success: boolean;
  detections: Array<{
    id: number;
    label: string;
    confidence: number;
    bbox: [number, number, number, number];
    normalized_bbox: [number, number, number, number];
    area: number;
    nutrition: {
      calories: number | string;
      protein: number | string;
      carbs: number | string;
      fat: number | string;
      fiber: number | string;
      vitamin_c: number | string;
      benefits: string;
    };
  }>;
  processed_image: string;
  original_size: {
    width: number;
    height: number;
  };
  total_objects: number;
  nutritional_summary: {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    ingredients_count: number;
  };
  message: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export const detectIngredients = async (file: File): Promise<DetectionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<DetectionResponse>('/detect-objects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
};

export const detectIngredientsBase64 = async (base64Image: string): Promise<DetectionResponse> => {
  const response = await apiClient.post<DetectionResponse>('/detect-objects-base64', {
    image: base64Image,
  });

  return response.data;
};

// Connection status checker
export const checkConnection = async (): Promise<boolean> => {
  try {
    await checkHealth();
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};
