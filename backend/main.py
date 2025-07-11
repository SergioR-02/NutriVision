"""
DetectiVision AI - Main FastAPI Application
API para detección de ingredientes en imágenes usando Google Gemini AI
"""
import base64
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import (
    APP_TITLE, APP_DESCRIPTION, APP_VERSION, 
    ALLOWED_ORIGINS, HOST, PORT
)
from detection_service import IngredientDetectionService

# Initialize FastAPI app
app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detection service
detection_service = IngredientDetectionService()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "DetectiVision AI - Detección de Ingredientes",
        "author": "Sergio Alejandro Ruiz Hurtado",
        "email": "seruizh@unal.edu.co",
        "version": APP_VERSION
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "service": "ingredient-detection-api",
        "ai_service_available": detection_service.ai_service.is_available()
    }

@app.post("/detect-objects")
async def detect_objects(file: UploadFile = File(...)):
    """
    Endpoint to detect ingredients in uploaded image
    
    Args:
        file: Uploaded image file
        
    Returns:
        Detection results with bounding boxes and nutritional information
    """
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image file
        image_bytes = await file.read()
        
        # Process image
        result = detection_service.process_image(image_bytes)
        
        return JSONResponse(content=result)
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/detect-objects-base64")
async def detect_objects_base64(image_data: dict):
    """
    Endpoint to detect ingredients from base64 encoded image
    
    Args:
        image_data: Dictionary containing base64 encoded image
        
    Returns:
        Detection results with bounding boxes and nutritional information
    """
    try:
        # Extract base64 data
        if "image" not in image_data:
            raise HTTPException(status_code=400, detail="Missing 'image' field")
        
        base64_string = image_data["image"]
        
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(base64_string)
        
        # Process image
        result = detection_service.process_image(image_bytes)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing base64 image: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
