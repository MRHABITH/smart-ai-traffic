import os
import cv2
import numpy as np
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import urllib.request
from typing import List, Optional
from ultralytics import YOLO

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_weights(model_path):
    """Download YOLOv10 weights if they don't exist"""
    if not os.path.exists(model_path):
        logger.info(f"Downloading {model_path}...")
        # Official YOLOv10 weights from THU-MIG GitHub
        url = f"https://github.com/THU-MIG/yolov10/releases/download/v1.1/{model_path}"
        try:
            urllib.request.urlretrieve(url, model_path)
            logger.info(f"✓ {model_path} downloaded successfully")
        except Exception as e:
            logger.error(f"Failed to download weights from Github: {e}")
            # Ultralytics native download will be the last resort
            pass

app = FastAPI(
    title="Traffic Detection API - YOLOv10",
    description="Real-time vehicle detection using YOLOv10",
    version="2.0.0"
)

# Add CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Initializing YOLOv10 model...")

# Load YOLOv10 model
try:
    model_size = os.getenv("YOLO_MODEL_SIZE", "x")
    model_file = f'yolov10{model_size}.pt'
    
    # Pre-emptively download
    download_weights(model_file)
    
    model = YOLO(model_file)
    logger.info(f"✓ YOLOv10-{model_size} model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load YOLOv10 model: {e}")
    try:
        logger.info("Attempting fallback to yolov10n.pt...")
        download_weights("yolov10n.pt")
        model = YOLO("yolov10n.pt")
    except Exception as fe:
        logger.error(f"CRITICAL: All model loading failed: {fe}")
        raise

# Vehicle types to detect (COCO classes)
VEHICLE_TYPES = ["car", "bus", "motorbike", "truck", "bicycle", "person"]

def process_image(image_data):
    """Process single image and detect vehicles using YOLOv10"""
    try:
        img_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Failed to decode image")
        
        # Run YOLOv10 inference
        results = model(image, conf=0.25, verbose=False)
        
        vehicle_detections = []
        confidences = []
        detected_count = 0
        
        for result in results:
            for detection in result.boxes:
                class_id = int(detection.cls[0])
                confidence = float(detection.conf[0])
                class_name = result.names[class_id]
                
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
    files: Optional[List[UploadFile]] = File(None),
    image_1: Optional[UploadFile] = File(None),
    image_2: Optional[UploadFile] = File(None),
    image_3: Optional[UploadFile] = File(None),
    image_4: Optional[UploadFile] = File(None),
    roads: Optional[List[str]] = Form(None)
):
    try:
        # Consolidate all images
        input_images = []
        if files:
            input_images.extend(files)
        if image_1: input_images.append(image_1)
        if image_2: input_images.append(image_2)
        if image_3: input_images.append(image_3)
        if image_4: input_images.append(image_4)

        if not input_images:
            logger.warning("No images received in request")
            raise HTTPException(status_code=400, detail="No valid images provided")

        detections = []
        for idx, image_file in enumerate(input_images):
            try:
                image_data = await image_file.read()
                result = process_image(image_data)
                
                # Assign road label if provided
                if roads and idx < len(roads):
                    result["road_name"] = roads[idx]
                else:
                    result["road"] = idx + 1
                    
                detections.append(result)
                logger.info(f"Processed image {idx+1}: {result['count']} vehicles")
            except Exception as ve:
                logger.warning(f"Skipping image {idx+1} due to error: {ve}")
        
        if not detections:
            raise HTTPException(status_code=400, detail="Failed to process any images")
            
        return {
            "status": "success",
            "detections": detections,
            "total_vehicles": sum(d["count"] for d in detections),
            "model": "YOLOv10"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": "YOLOv10"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
