"""
Detection parsing utilities for processing AI responses
"""
import re
import numpy as np
from typing import List, Tuple, Any
from config import NON_FOOD_ITEMS, CONFIDENCE_BASE, CONFIDENCE_VARIATION, ALTERNATIVE_CONFIDENCE_BASE

class DetectionParser:
    """Handles parsing of AI detection responses"""
    
    @staticmethod
    def get_regex_patterns() -> List[str]:
        """Get regex patterns for parsing detection responses"""
        return [
            # Standard format: [123, 456, 789, 012, ingredient]
            r'\[(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?),?\s*([^\]]+)\]',
            # With spaces: [ 123 , 456 , 789 , 012 , ingredient ]
            r'\[\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*([^\]]+)\s*\]',
            # Different separators: [123 456 789 012 ingredient]
            r'\[(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+([^\]]+)\]'
        ]
    
    @classmethod
    def parse_detection_response(cls, response_text: str) -> List[Tuple[float, float, float, float, str]]:
        """
        Parse AI response text to extract bounding boxes
        
        Args:
            response_text: Raw AI response text
            
        Returns:
            List of tuples (ymin, xmin, ymax, xmax, label)
        """
        print(f"Raw AI response: {response_text}")
        
        bounding_boxes = []
        patterns = cls.get_regex_patterns()
        
        # Primary parsing with regex patterns
        for pattern in patterns:
            matches = re.findall(pattern, response_text)
            if matches:
                bounding_boxes.extend(matches)
                break
        
        # Alternative parsing if regex fails
        if not bounding_boxes:
            print("Primary regex failed, trying line-by-line parsing...")
            bounding_boxes = cls._parse_line_by_line(response_text)
        
        print(f"Parsed bounding boxes: {bounding_boxes}")
        return bounding_boxes
    
    @staticmethod
    def _parse_line_by_line(response_text: str) -> List[Tuple[float, float, float, float, str]]:
        """
        Parse response line by line as fallback method
        
        Args:
            response_text: Raw AI response text
            
        Returns:
            List of tuples (ymin, xmin, ymax, xmax, label)
        """
        bounding_boxes = []
        lines = response_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if '[' in line and ']' in line:
                # Extract content between brackets
                bracket_content = re.search(r'\[([^\]]+)\]', line)
                if bracket_content:
                    content = bracket_content.group(1)
                    parts = [part.strip() for part in re.split(r'[,\s]+', content)]
                    if len(parts) >= 5:
                        try:
                            # Try to parse first 4 as numbers, rest as label
                            numbers = []
                            for i in range(4):
                                numbers.append(float(parts[i]))
                            label = ' '.join(parts[4:])
                            bounding_boxes.append((*numbers, label))
                        except (ValueError, IndexError):
                            continue
        
        return bounding_boxes
    
    @staticmethod
    def is_food_item(label: str) -> bool:
        """
        Check if detected item is a food ingredient
        
        Args:
            label: Detected item label
            
        Returns:
            True if item is food
        """
        label_clean = label.strip().lower()
        return label_clean and label_clean not in NON_FOOD_ITEMS
    
    @staticmethod
    def generate_confidence(is_primary: bool = True) -> float:
        """
        Generate confidence score for detection
        
        Args:
            is_primary: Whether this is from primary or alternative detection
            
        Returns:
            Confidence score between 0 and 1
        """
        base = CONFIDENCE_BASE if is_primary else ALTERNATIVE_CONFIDENCE_BASE
        variation = CONFIDENCE_VARIATION
        return round(base + (variation * np.random.random()), 2)
    
    @classmethod
    def create_detection_result(cls, detection_id: int, label: str, bbox: List[int], 
                              normalized_bbox: List[int], nutrition_info: dict, 
                              is_primary: bool = True) -> dict:
        """
        Create detection result dictionary
        
        Args:
            detection_id: Unique detection ID
            label: Ingredient label
            bbox: Pixel coordinates [x1, y1, x2, y2]
            normalized_bbox: Normalized coordinates [ymin, xmin, ymax, xmax]
            nutrition_info: Nutritional information
            is_primary: Whether from primary detection
            
        Returns:
            Detection result dictionary
        """
        x1, y1, x2, y2 = bbox
        
        return {
            "id": detection_id,
            "label": label.title(),
            "confidence": cls.generate_confidence(is_primary),
            "bbox": bbox,
            "normalized_bbox": normalized_bbox,
            "area": (x2 - x1) * (y2 - y1),
            "nutrition": nutrition_info
        }
    
    @staticmethod
    def remove_duplicates(results: List[dict]) -> List[dict]:
        """
        Remove duplicate detections based on labels
        
        Args:
            results: List of detection results
            
        Returns:
            List without duplicates
        """
        unique_results = []
        seen_labels = set()
        
        for i, result in enumerate(results):
            label_key = result['label'].lower()
            if label_key not in seen_labels:
                result['id'] = i + 1
                unique_results.append(result)
                seen_labels.add(label_key)
        
        return unique_results
    
    @staticmethod
    def sort_by_area(results: List[dict]) -> List[dict]:
        """
        Sort results by detection area (larger first)
        
        Args:
            results: List of detection results
            
        Returns:
            Sorted list
        """
        return sorted(results, key=lambda x: x.get('area', 0), reverse=True)
