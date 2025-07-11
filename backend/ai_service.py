"""
AI service for ingredient detection using Google Gemini
"""
import tempfile
import os
from typing import List, Tuple, Optional
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.llms import ChatMessage, ImageBlock, MessageRole, TextBlock
from fastapi import HTTPException
import cv2
import numpy as np
from config import GOOGLE_API_KEY

class GeminiAIService:
    """Service for interacting with Google Gemini AI"""
    
    def __init__(self):
        """Initialize Gemini AI service"""
        self.gemini_pro = None
        self._initialize_gemini()
    
    def _initialize_gemini(self):
        """Initialize Gemini AI model"""
        try:
            if not GOOGLE_API_KEY:
                raise ValueError("GOOGLE_API_KEY no configurada")
            
            os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
            self.gemini_pro = GoogleGenAI(model_name="gemini-1.5-flash")
            print("✅ Gemini AI initialized successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not initialize Gemini AI: {e}")
            print("The server will start but API calls may fail until connection is restored")
            print("💡 Tip: Asegúrate de configurar tu archivo .env con GOOGLE_API_KEY")
            self.gemini_pro = None
    
    def is_available(self) -> bool:
        """Check if Gemini AI is available"""
        return self.gemini_pro is not None
    
    def _create_primary_prompt(self, image_width: int, image_height: int) -> str:
        """Create the primary prompt for ingredient detection"""
        return f"""Eres un experto en análisis de imágenes de comida. Analiza esta imagen de {image_width}x{image_height} píxeles y detecta CADA ingrediente alimentario visible con MÁXIMA PRECISIÓN.

INSTRUCCIONES CRÍTICAS:
1. Identifica ingredientes individuales específicos: vegetales, carnes, granos, lácteos, condimentos, frutas, hierbas
2. Dibuja bounding boxes MUY PRECISOS alrededor de CADA ingrediente visible
3. USA COORDENADAS NORMALIZADAS de 0 a 1000 donde:
   - 0,0 = esquina superior izquierda
   - 1000,1000 = esquina inferior derecha
4. NO detectes objetos como platos, mesas, cubiertos, vasos
5. SÉ MUY PRECISO con las coordenadas para que coincidan exactamente con cada ingrediente

FORMATO EXACTO REQUERIDO:
[ymin, xmin, ymax, xmax, nombre_ingrediente]

EJEMPLOS DE DETECCIÓN PRECISA:
[120, 200, 280, 350, tomate]
[300, 150, 450, 320, lechuga]
[180, 400, 320, 580, pollo]
[50, 100, 180, 250, cebolla]
[400, 200, 500, 400, arroz]

REGLAS IMPORTANTES:
- Detecta ingredientes aunque sean pequeños
- Sé específico con los nombres (no "verdura", sino "tomate", "lechuga", etc.)
- Las coordenadas deben ser EXACTAS para la segmentación precisa
- Busca ingredientes en toda la imagen
- Responde SOLO con las detecciones en el formato especificado
- Detecta MÍNIMO 4-6 ingredientes si hay comida visible
- Ajusta las coordenadas para que cubran completamente cada ingrediente

Analiza la imagen ahora con MÁXIMA PRECISIÓN:"""
    
    def _create_alternative_prompt(self) -> str:
        """Create alternative prompt for better detection"""
        return """TAREA: Detectar ingredientes de comida con bounding boxes

BUSCA ESTOS TIPOS DE INGREDIENTES:
🥗 Vegetales: tomate, lechuga, cebolla, zanahoria, apio, pepino, pimiento
🍖 Carnes: pollo, res, cerdo, pescado, camarón, jamón
🌾 Granos: arroz, frijoles, lentejas, quinoa, pasta
🧀 Lácteos: queso, crema, yogurt
🌿 Hierbas: cilantro, perejil, albahaca
🥑 Frutas: aguacate, limón, tomate
🌶️ Condimentos: salsa, aceite, vinagre

FORMATO OBLIGATORIO:
[ymin, xmin, ymax, xmax, nombre_exacto]

EJEMPLO:
[100, 150, 200, 300, tomate]
[250, 200, 350, 400, lechuga]
[300, 100, 450, 250, pollo]

REGLAS:
- Coordenadas 0-1000
- NO detectes platos/utensilios
- SÉ ESPECÍFICO con nombres
- Detecta MÍNIMO 4 ingredientes
- Solo texto de respuesta"""
    
    def detect_ingredients(self, image_path: str, image_width: int, image_height: int) -> Tuple[str, str]:
        """
        Detect ingredients in image using Gemini AI
        
        Args:
            image_path: Path to the temporary image file
            image_width: Width of the processed image
            image_height: Height of the processed image
            
        Returns:
            Tuple of (primary_response, alternative_response)
        """
        if not self.is_available():
            raise HTTPException(status_code=503, detail="Gemini AI service is not available. Please check internet connection.")
        
        # Primary detection
        primary_msg = ChatMessage(
            role=MessageRole.USER,
            blocks=[
                TextBlock(text=self._create_primary_prompt(image_width, image_height)),
                ImageBlock(path=image_path, image_mimetype="image/jpeg"),
            ],
        )
        
        primary_response = self.gemini_pro.chat(messages=[primary_msg])
        primary_text = primary_response.message.content
        
        # Alternative detection (if needed)
        alternative_msg = ChatMessage(
            role=MessageRole.USER,
            blocks=[
                TextBlock(text=self._create_alternative_prompt()),
                ImageBlock(path=image_path, image_mimetype="image/jpeg"),
            ],
        )
        
        alternative_response = self.gemini_pro.chat(messages=[alternative_msg])
        alternative_text = alternative_response.message.content
        
        return primary_text, alternative_text
