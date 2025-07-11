"""
Nutritional database and utility functions
"""
from typing import Dict, Any

def round_nutritional_values(nutrition_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Round nutritional values to maximum 2 decimal places
    
    Args:
        nutrition_info: Dictionary with nutritional information
        
    Returns:
        Dictionary with rounded values
    """
    rounded_info = {}
    for key, value in nutrition_info.items():
        if isinstance(value, (int, float)):
            # Round to 2 decimal places maximum
            rounded_info[key] = round(value, 2)
        else:
            rounded_info[key] = value
    return rounded_info

# Nutritional database for common ingredients (per 100g)
NUTRITIONAL_DATABASE = {
    # Vegetables
    "tomate": {
        "calories": 18,
        "protein": 0.9,
        "carbs": 3.9,
        "fat": 0.2,
        "fiber": 1.2,
        "vitamin_c": 14,
        "benefits": "Rico en licopeno, vitamina C y antioxidantes"
    },
    "lechuga": {
        "calories": 15,
        "protein": 1.4,
        "carbs": 2.9,
        "fat": 0.2,
        "fiber": 1.3,
        "vitamin_c": 9,
        "benefits": "Alta en folato, vitamina A y baja en calorías"
    },
    "cebolla": {
        "calories": 40,
        "protein": 1.1,
        "carbs": 9.3,
        "fat": 0.1,
        "fiber": 1.7,
        "vitamin_c": 7,
        "benefits": "Propiedades antiinflamatorias y antioxidantes"
    },
    "zanahoria": {
        "calories": 41,
        "protein": 0.9,
        "carbs": 9.6,
        "fat": 0.2,
        "fiber": 2.8,
        "vitamin_c": 6,
        "benefits": "Rica en beta-caroteno y vitamina A"
    },
    "pimiento": {
        "calories": 31,
        "protein": 1.0,
        "carbs": 7.3,
        "fat": 0.3,
        "fiber": 2.5,
        "vitamin_c": 128,
        "benefits": "Excelente fuente de vitamina C y antioxidantes"
    },
    "aguacate": {
        "calories": 160,
        "protein": 2.0,
        "carbs": 8.5,
        "fat": 14.7,
        "fiber": 6.7,
        "vitamin_c": 10,
        "benefits": "Rico en grasas saludables y potasio"
    },
    
    # Meats
    "pollo": {
        "calories": 165,
        "protein": 31.0,
        "carbs": 0.0,
        "fat": 3.6,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Excelente fuente de proteína magra y vitaminas B"
    },
    "res": {
        "calories": 250,
        "protein": 26.0,
        "carbs": 0.0,
        "fat": 15.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Rica en proteína, hierro y vitamina B12"
    },
    "cerdo": {
        "calories": 242,
        "protein": 27.0,
        "carbs": 0.0,
        "fat": 14.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Buena fuente de proteína y tiamina"
    },
    "pescado": {
        "calories": 206,
        "protein": 22.0,
        "carbs": 0.0,
        "fat": 12.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Rico en omega-3 y proteína de alta calidad"
    },
    "jamón": {
        "calories": 145,
        "protein": 21.0,
        "carbs": 1.5,
        "fat": 5.5,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Fuente de proteína, pero alto en sodio"
    },
    "salchicha": {
        "calories": 301,
        "protein": 13.0,
        "carbs": 2.0,
        "fat": 27.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Procesado, consumir con moderación"
    },
    
    # Grains and legumes
    "arroz": {
        "calories": 130,
        "protein": 2.7,
        "carbs": 28.0,
        "fat": 0.3,
        "fiber": 0.4,
        "vitamin_c": 0,
        "benefits": "Carbohidrato de fácil digestión, energía rápida"
    },
    "frijoles": {
        "calories": 127,
        "protein": 9.0,
        "carbs": 23.0,
        "fat": 0.5,
        "fiber": 6.4,
        "vitamin_c": 2,
        "benefits": "Alto en proteína vegetal y fibra"
    },
    "lentejas": {
        "calories": 116,
        "protein": 9.0,
        "carbs": 20.0,
        "fat": 0.4,
        "fiber": 7.9,
        "vitamin_c": 1,
        "benefits": "Excelente fuente de proteína vegetal y hierro"
    },
    
    # Dairy
    "queso": {
        "calories": 402,
        "protein": 25.0,
        "carbs": 1.3,
        "fat": 33.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Rico en calcio y proteína"
    },
    "huevo": {
        "calories": 155,
        "protein": 13.0,
        "carbs": 1.1,
        "fat": 11.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Proteína completa con todos los aminoácidos esenciales"
    },
    
    # Others
    "limón": {
        "calories": 29,
        "protein": 1.1,
        "carbs": 9.3,
        "fat": 0.3,
        "fiber": 2.8,
        "vitamin_c": 53,
        "benefits": "Alto en vitamina C y antioxidantes"
    },
    "aceite": {
        "calories": 884,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 100.0,
        "fiber": 0.0,
        "vitamin_c": 0,
        "benefits": "Fuente de grasas, usar con moderación"
    }
}

def get_nutritional_info(ingredient_name: str) -> Dict[str, Any]:
    """
    Get nutritional information for an ingredient
    
    Args:
        ingredient_name: Name of the ingredient
        
    Returns:
        Dictionary with nutritional information
    """
    ingredient_key = ingredient_name.lower().strip()
    
    # Try exact match first
    if ingredient_key in NUTRITIONAL_DATABASE:
        return round_nutritional_values(NUTRITIONAL_DATABASE[ingredient_key])
    
    # Try partial matches for common variations
    for key, value in NUTRITIONAL_DATABASE.items():
        if key in ingredient_key or ingredient_key in key:
            return round_nutritional_values(value)
    
    # Default nutritional info if not found
    return {
        "calories": "N/A",
        "protein": "N/A",
        "carbs": "N/A",
        "fat": "N/A",
        "fiber": "N/A",
        "vitamin_c": "N/A",
        "benefits": "Información nutricional no disponible"
    }

def calculate_nutritional_summary(results: list) -> Dict[str, float]:
    """
    Calculate total nutritional summary from detection results
    
    Args:
        results: List of detection results with nutrition data
        
    Returns:
        Dictionary with total nutritional values
    """
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    
    for result in results:
        nutrition = result['nutrition']
        if isinstance(nutrition['calories'], (int, float)):
            total_calories += nutrition['calories']
        if isinstance(nutrition['protein'], (int, float)):
            total_protein += nutrition['protein']
        if isinstance(nutrition['carbs'], (int, float)):
            total_carbs += nutrition['carbs']
        if isinstance(nutrition['fat'], (int, float)):
            total_fat += nutrition['fat']
    
    return {
        "total_calories": round(total_calories, 2),
        "total_protein": round(total_protein, 2),
        "total_carbs": round(total_carbs, 2),
        "total_fat": round(total_fat, 2),
        "ingredients_count": len(results)
    }
