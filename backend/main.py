import os
import cv2
import numpy as np
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from ultralytics import YOLO

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Traffic Detection API - YOLOv10",
    description="Real-time vehicle detection using YOLOv10",
    version="2.0.0"
)

# Add CORS middleware - Allow requests from Vercel and local development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Initializing YOLOv10 model...")

# Load YOLOv10 model (auto-downloads from Ultralytics Hub if not present)
try:
    # YOLOv10 models: yolov10n (nano), yolov10s (small), yolov10m (medium), yolov10b (base), yolov10l (large), yolov10x (xlarge)
    model_size = os.getenv("YOLO_MODEL_SIZE", "x")  # Default to xlarge for max accuracy
    model = YOLO(f'yolov10{model_size}.pt')
    logger.info(f"✓ YOLOv10-{model_size} model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load YOLOv10 model: {e}")
    raise

# Vehicle types to detect (COCO classes)
VEHICLE_TYPES = ["car", "bus", "motorbike", "truck", "bicycle", "person"]


def process_image(image_data):
    """Process single image and detect vehicles using YOLOv10"""
    try:
        # Convert bytes to numpy array
        img_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Failed to decode image")
        
        # Run YOLOv10 inference with lower conf to catch more small/obscured vehicles
        results = model(image, conf=0.25, verbose=False)
        
        # Extract detections
        vehicle_detections = []
        confidences = []
        detected_count = 0
        
        for result in results:
            for detection in result.boxes:
                class_id = int(detection.cls[0])
                confidence = float(detection.conf[0])
                class_name = result.names[class_id]
                
                # Check if detected class is a vehicle type
                if class_name in VEHICLE_TYPES:
                    vehicle_detections.append(class_name)
                    confidences.append(confidence)
                    detected_count += 1
        
        return {
            "count": detected_count,
            "vehicles": vehicle_detections,
            "confidence": float(np.mean(confidences)) if confidences else 0,
            "model": "YOLOv10"
        }
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        raise ValueError(f"Failed to process image: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "Traffic Detection API is running",
        "model": "YOLOv10",
        "version": "2.0.0"
    }


@app.post("/api/detect")
async def detect_vehicles(
    image_1: UploadFile = File(None),
    image_2: UploadFile = File(None),
    image_3: UploadFile = File(None),
    image_4: UploadFile = File(None),
):
    """
    Detect vehicles in uploaded images using YOLOv10.
    
    Accepts up to 4 images and returns vehicle detections for each.
    """
    try:
        images = [image_1, image_2, image_3, image_4]
        detections = []
        
        for idx, image_file in enumerate(images, 1):
            if image_file is not None:
                try:
                    # Read and process image
                    image_data = await image_file.read()
                    result = process_image(image_data)
                    result["road"] = idx
                    detections.append(result)
                    logger.info(f"Processed image {idx}: detected {result['count']} vehicles")
                except ValueError as ve:
                    logger.warning(f"Failed to process image {idx}: {ve}")
        
        if not detections:
            logger.warning("No images provided or all failed to process")
            raise HTTPException(status_code=400, detail="No valid images provided")
        
        response = {
            "status": "success",
            "detections": detections,
            "total_vehicles": sum(d["count"] for d in detections),
            "model": "YOLOv10"
        }
        
        logger.info(f"Detection complete: {response['total_vehicles']} vehicles detected")
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detection error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": "YOLOv10",
        "version": "2.0.0"
    }


@app.get("/info")
async def model_info():
    """Get model information"""
    return {
        "model": "YOLOv10",
        "version": "2.0.0",
        "framework": "Ultralytics",
        "supported_classes": VEHICLE_TYPES,
        "confidence_threshold": 0.5,
        "max_images_per_request": 4
    }


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host=host, port=port, reload=False)
