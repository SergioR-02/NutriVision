"""
Image processing utilities for ingredient detection
"""
import cv2
import numpy as np
import tempfile
import base64
from typing import Tuple, List, Dict, Any
from config import TARGET_IMAGE_SIZE, BBOX_OFFSET_X, BBOX_OFFSET_Y, MIN_BOX_SIZE

class ImageProcessor:
    """Handles image processing operations"""
    
    @staticmethod
    def decode_image(image_bytes: bytes) -> np.ndarray:
        """
        Decode image bytes to OpenCV format
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            OpenCV image array
        """
        img_array = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image")
        
        return img
    
    @staticmethod
    def resize_image(img: np.ndarray) -> Tuple[np.ndarray, int, int, int, int]:
        """
        Resize image while maintaining aspect ratio
        
        Args:
            img: Original OpenCV image
            
        Returns:
            Tuple of (resized_image, new_width, new_height, original_width, original_height)
        """
        original_height, original_width = img.shape[:2]
        
        # Resize image while maintaining aspect ratio
        if original_width > original_height:
            new_width = TARGET_IMAGE_SIZE
            new_height = int((TARGET_IMAGE_SIZE * original_height) / original_width)
        else:
            new_height = TARGET_IMAGE_SIZE
            new_width = int((TARGET_IMAGE_SIZE * original_width) / original_height)
        
        img_resized = cv2.resize(img, (new_width, new_height))
        
        print(f"Original size: {original_width}x{original_height}")
        print(f"Resized to: {new_width}x{new_height}")
        
        return img_resized, new_width, new_height, original_width, original_height
    
    @staticmethod
    def save_temp_image(img: np.ndarray) -> str:
        """
        Save image to temporary file
        
        Args:
            img: OpenCV image
            
        Returns:
            Path to temporary file
        """
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            cv2.imwrite(tmp.name, img)
            return tmp.name
    
    @staticmethod
    def draw_bounding_box(img: np.ndarray, x1: int, y1: int, x2: int, y2: int, 
                         label: str, color: Tuple[int, int, int] = (0, 255, 0)) -> None:
        """
        Draw bounding box and label on image
        
        Args:
            img: OpenCV image
            x1, y1, x2, y2: Bounding box coordinates
            label: Label text
            color: BGR color tuple
        """
        thickness = 3
        
        # Draw rectangle
        cv2.rectangle(img, (x1, y1), (x2, y2), color, thickness)
        
        # Draw label background
        label_text = label.title()
        font_scale = 0.7
        font_thickness = 2
        (text_width, text_height), baseline = cv2.getTextSize(
            label_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness
        )
        
        # Background rectangle for text
        padding = 5
        cv2.rectangle(
            img, 
            (x1, y1 - text_height - 2*padding), 
            (x1 + text_width + 2*padding, y1), 
            color, -1
        )
        
        # Draw label text
        cv2.putText(
            img, label_text, 
            (x1 + padding, y1 - padding), 
            cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), font_thickness
        )
    
    @staticmethod
    def convert_to_base64(img: np.ndarray) -> str:
        """
        Convert OpenCV image to base64 string
        
        Args:
            img: OpenCV image
            
        Returns:
            Base64 encoded image string
        """
        _, buffer = cv2.imencode('.jpg', img)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/jpeg;base64,{image_base64}"
    
    @staticmethod
    def normalize_coordinates(ymin: float, xmin: float, ymax: float, xmax: float, 
                            image_width: int, image_height: int) -> Tuple[int, int, int, int]:
        """
        Convert normalized coordinates to pixel coordinates
        
        Args:
            ymin, xmin, ymax, xmax: Normalized coordinates (0-1000)
            image_width, image_height: Image dimensions
            
        Returns:
            Tuple of pixel coordinates (x1, y1, x2, y2)
        """
        # Ensure coordinates are in valid range
        ymin = max(0, min(1000, ymin))
        xmin = max(0, min(1000, xmin))
        ymax = max(0, min(1000, ymax))
        xmax = max(0, min(1000, xmax))
        
        # Convert coordinates to pixel coordinates with offset adjustment
        x1 = int(xmin / 1000 * image_width) + BBOX_OFFSET_X
        y1 = int(ymin / 1000 * image_height) + BBOX_OFFSET_Y
        x2 = int(xmax / 1000 * image_width) + BBOX_OFFSET_X
        y2 = int(ymax / 1000 * image_height) + BBOX_OFFSET_Y
        
        # Ensure pixel coordinates are within image bounds
        x1 = max(0, min(image_width - 1, x1))
        y1 = max(0, min(image_height - 1, y1))
        x2 = max(0, min(image_width, x2))
        y2 = max(0, min(image_height, y2))
        
        return x1, y1, x2, y2
    
    @staticmethod
    def is_valid_box(x1: int, y1: int, x2: int, y2: int) -> bool:
        """
        Check if bounding box is valid
        
        Args:
            x1, y1, x2, y2: Bounding box coordinates
            
        Returns:
            True if box is valid
        """
        return (x2 - x1) >= MIN_BOX_SIZE and (y2 - y1) >= MIN_BOX_SIZE
    
    @staticmethod
    def calculate_overlap(box1: List[int], box2: List[int]) -> float:
        """
        Calculate intersection over union (IoU) for two boxes
        
        Args:
            box1, box2: Bounding boxes as [x1, y1, x2, y2]
            
        Returns:
            IoU value
        """
        x1_1, y1_1, x2_1, y2_1 = box1
        x1_2, y1_2, x2_2, y2_2 = box2
        
        # Calculate intersection area
        intersect_area = max(0, min(x2_1, x2_2) - max(x1_1, x1_2)) * max(0, min(y2_1, y2_2) - max(y1_1, y1_2))
        
        # Calculate union area
        union_area = (x2_1 - x1_1) * (y2_1 - y1_1) + (x2_2 - x1_2) * (y2_2 - y1_2) - intersect_area
        
        if union_area > 0:
            return intersect_area / union_area
        return 0
