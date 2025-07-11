"""
Configuration settings for the NutriVision AI backend
"""
import os

# API Configuration
GOOGLE_API_KEY = "AIzaSyDkKkfyNQ9msc72Aio4h4VhzIcpxusAHuM"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Image Processing Configuration
TARGET_IMAGE_SIZE = 800
BBOX_OFFSET_X = 70  # Píxeles hacia la derecha
BBOX_OFFSET_Y = 20  # Píxeles hacia abajo

# Server Configuration
APP_TITLE = "NutriVision AI API"
APP_DESCRIPTION = "API para detección de ingredientes y análisis nutricional usando Google Gemini AI"
APP_VERSION = "2.0.0"
HOST = "0.0.0.0"
PORT = 8000

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174"
]

# Detection Configuration
MIN_BOX_SIZE = 10
MIN_INGREDIENTS_THRESHOLD = 3
CONFIDENCE_BASE = 0.75
CONFIDENCE_VARIATION = 0.20
ALTERNATIVE_CONFIDENCE_BASE = 0.70

# Non-food items to filter out
NON_FOOD_ITEMS = {
    'plato', 'plate', 'dish', 'mesa', 'table', 'cubierto', 'fork', 'knife', 'spoon',
    'tenedor', 'cuchillo', 'cuchara', 'vaso', 'glass', 'cup', 'taza', 'bowl', 'bol',
    'servilleta', 'napkin', 'mantel', 'tablecloth', 'mano', 'hand', 'dedo', 'finger'
}
