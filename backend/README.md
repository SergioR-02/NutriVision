# NutriVision AI - Backend

Backend API desarrollado con FastAPI para la detección de ingredientes y análisis nutricional usando Google Gemini AI.

## 🚀 Configuración Rápida

### 1. Instalar Dependencias

```bash
# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` y agrega tu Google API Key:

```env
GOOGLE_API_KEY=tu_google_api_key_real_aqui
```

**¿Cómo obtener la API Key de Google Gemini?**
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un nuevo proyecto o selecciona uno existente
3. Genera una nueva API Key
4. Copia la clave y pégala en tu archivo `.env`

### 3. Ejecutar el Servidor

```bash
python main.py
```

El servidor estará disponible en: `http://localhost:8000`

## 📚 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔒 Seguridad

⚠️ **Importante**: Nunca subas tu archivo `.env` al repositorio. Este archivo contiene información sensible como tu API Key.

### Archivos protegidos:
- `.env` - Variables de entorno (incluye API keys)
- `__pycache__/` - Archivos compilados de Python
- Logs y archivos temporales

## 🛠️ Estructura del Proyecto

```
backend/
├── main.py              # Servidor principal FastAPI
├── config.py            # Configuración y variables de entorno
├── ai_service.py        # Servicio de Google Gemini AI
├── detection_service.py # Lógica de detección de objetos
├── detection_parser.py  # Parser de resultados de detección
├── image_processor.py   # Procesamiento de imágenes
├── nutrition.py         # Base de datos nutricional
├── requirements.txt     # Dependencias Python
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore          # Archivos a ignorar en git
└── README.md           # Este archivo
```

## 🌐 Endpoints de la API

### Health Check
- `GET /` - Información básica de la API
- `GET /health` - Estado de salud del servidor

### Detección de Objetos
- `POST /detect-objects` - Detectar ingredientes (multipart/form-data)
  - Parámetro: `file` (imagen)
- `POST /detect-objects-base64` - Detectar ingredientes (base64)
  - Body: `{"image": "data:image/jpeg;base64,..."}`

### Respuesta de ejemplo:
```json
{
  "success": true,
  "message": "Objetos detectados exitosamente",
  "detected_objects": [
    {
      "name": "Tomate",
      "confidence": 0.95,
      "bbox": [100, 50, 200, 150],
      "nutrition": {
        "calories": 18,
        "proteins": 0.9,
        "carbs": 3.9,
        "fat": 0.2
      }
    }
  ],
  "total_nutrition": {
    "calories": 18,
    "proteins": 0.9,
    "carbs": 3.9,
    "fat": 0.2
  }
}
```

## 🔧 Configuración Avanzada

### Variables de entorno adicionales (opcional):

```env
# Configuración del servidor
HOST=0.0.0.0
PORT=8000

# Modo debug
DEBUG=True
```

### Configuración CORS

El backend está configurado para aceptar requests desde:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternate)

## 🐛 Solución de Problemas

### Error: "GOOGLE_API_KEY no encontrada"
- Verifica que el archivo `.env` existe en el directorio `backend/`
- Asegúrate de que la variable `GOOGLE_API_KEY` está configurada en `.env`
- Reinicia el servidor después de configurar las variables

### Error: "Could not initialize Gemini AI"
- Verifica que tu API Key es válida
- Comprueba tu conexión a internet
- Asegúrate de que tu proyecto de Google tiene habilitada la API de Gemini

### Error de CORS
- Verifica que el frontend esté corriendo en un puerto permitido
- Revisa la configuración `ALLOWED_ORIGINS` en `config.py`

## 📝 Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Nunca subas archivos `.env` o API keys
4. Asegúrate de que los tests pasen
5. Crea un Pull Request

## 📞 Soporte

Si tienes problemas con la configuración, verifica:
- [Documentación de Google Gemini AI](https://ai.google.dev/docs)
- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
