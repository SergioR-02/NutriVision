"""
Main detection service that orchestrates the ingredient detection process
"""
import os
from typing import Dict, Any, List
from fastapi import HTTPException

from ai_service import GeminiAIService
from image_processor import ImageProcessor
from detection_parser import DetectionParser
from nutrition import get_nutritional_info, calculate_nutritional_summary
from config import MIN_INGREDIENTS_THRESHOLD

class IngredientDetectionService:
    """Main service for ingredient detection"""
    
    def __init__(self):
        """Initialize detection service"""
        self.ai_service = GeminiAIService()
        self.image_processor = ImageProcessor()
        self.parser = DetectionParser()
    
    def process_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Process image and return ingredient detection results
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            Detection results dictionary
        """
        image_path = None
        
        try:
            # Decode and resize image
            img = self.image_processor.decode_image(image_bytes)
            img_resized, image_width, image_height, orig_width, orig_height = self.image_processor.resize_image(img)
            
            # Save temporary image
            image_path = self.image_processor.save_temp_image(img_resized)
            
            # Get AI detections
            primary_response, alternative_response = self.ai_service.detect_ingredients(
                image_path, image_width, image_height
            )
            
            # Process primary detections
            results = self._process_detections(
                primary_response, img_resized, image_width, image_height, is_primary=True
            )
            
            # If not enough ingredients found, try alternative detections
            if len(results) < MIN_INGREDIENTS_THRESHOLD:
                print(f"Only {len(results)} ingredients detected, processing alternative detections...")
                alt_results = self._process_detections(
                    alternative_response, img_resized, image_width, image_height, 
                    is_primary=False, existing_results=results
                )
                results.extend(alt_results)
            
            # Clean up results
            results = self.parser.remove_duplicates(results)
            results = self.parser.sort_by_area(results)
            
            # Calculate nutritional summary
            nutritional_summary = calculate_nutritional_summary(results)
            
            # Convert processed image to base64
            processed_image_base64 = self.image_processor.convert_to_base64(img_resized)
            
            # Log final results
            self._log_results(results)
            
            return {
                "success": True,
                "detections": results,
                "processed_image": processed_image_base64,
                "original_size": {"width": image_width, "height": image_height},
                "total_objects": len(results),
                "nutritional_summary": nutritional_summary,
                "message": f"Detectados {len(results)} ingredientes alimentarios con información nutricional" if len(results) > 0 else "No se detectaron ingredientes específicos"
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
        
        finally:
            # Clean up temporary file
            if image_path and os.path.exists(image_path):
                try:
                    os.unlink(image_path)
                except:
                    pass
    
    def _process_detections(self, response_text: str, img: Any, image_width: int, 
                          image_height: int, is_primary: bool = True, 
                          existing_results: List[dict] = None) -> List[dict]:
        """
        Process AI detection response and draw bounding boxes
        
        Args:
            response_text: AI response text
            img: OpenCV image to draw on
            image_width, image_height: Image dimensions
            is_primary: Whether this is primary or alternative detection
            existing_results: Existing detection results to check for overlaps
            
        Returns:
            List of detection results
        """
        if existing_results is None:
            existing_results = []
        
        # Parse detections
        bounding_boxes = self.parser.parse_detection_response(response_text)
        results = []
        
        # Color for drawing (green for primary, red for alternative)
        color = (0, 255, 0) if is_primary else (255, 0, 0)
        
        for i, box in enumerate(bounding_boxes):
            try:
                # Extract coordinates and label
                if len(box) < 5:
                    continue
                
                ymin, xmin, ymax, xmax, label = box[:5]
                ymin, xmin, ymax, xmax = float(ymin), float(xmin), float(ymax), float(xmax)
                
                # Skip invalid coordinates
                if ymin >= ymax or xmin >= xmax:
                    continue
                
                # Convert to pixel coordinates
                x1, y1, x2, y2 = self.image_processor.normalize_coordinates(
                    ymin, xmin, ymax, xmax, image_width, image_height
                )
                
                # Skip invalid boxes
                if not self.image_processor.is_valid_box(x1, y1, x2, y2):
                    continue
                
                # Filter non-food items
                label_clean = label.strip().lower()
                if not self.parser.is_food_item(label_clean):
                    print(f"Filtering out non-food item: {label_clean}")
                    continue
                
                # Check for overlaps with existing detections
                if self._has_overlap([x1, y1, x2, y2], existing_results):
                    continue
                
                # Draw bounding box
                self.image_processor.draw_bounding_box(img, x1, y1, x2, y2, label_clean, color)
                
                # Get nutritional information
                nutrition_info = get_nutritional_info(label_clean)
                
                # Create detection result
                result = self.parser.create_detection_result(
                    len(results) + len(existing_results) + 1,
                    label_clean,
                    [x1, y1, x2, y2],
                    [int(ymin), int(xmin), int(ymax), int(xmax)],
                    nutrition_info,
                    is_primary
                )
                
                results.append(result)
                
            except (ValueError, IndexError) as e:
                print(f"Error processing box {i}: {e}")
                continue
        
        return results
    
    def _has_overlap(self, bbox: List[int], existing_results: List[dict], threshold: float = 0.3) -> bool:
        """
        Check if bounding box overlaps with existing detections
        
        Args:
            bbox: Bounding box to check
            existing_results: List of existing detection results
            threshold: IoU threshold for overlap
            
        Returns:
            True if overlap exists
        """
        for existing in existing_results:
            existing_bbox = existing['bbox']
            iou = self.image_processor.calculate_overlap(bbox, existing_bbox)
            if iou > threshold:
                return True
        return False
    
    def _log_results(self, results: List[dict]) -> None:
        """
        Log detection results for debugging
        
        Args:
            results: List of detection results
        """
        print(f"Final detection count: {len(results)}")
        for i, result in enumerate(results):
            print(f"  {i+1}. {result['label']} - confidence: {result['confidence']} - calories: {result['nutrition']['calories']}")
