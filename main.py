"""
FastAPI backend for WreckCheck car damage detection system.
Serves the HTML frontend and provides prediction API endpoints.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import torch
from torchvision import transforms
from PIL import Image
import cv2
import numpy as np
import io
import os
from pathlib import Path

from model import SimpleCNN

# Global variables for model loading
model = None
idx2label = None
transform = None

def preprocess_image(image_bytes):
    """Apply Gaussian blur and contrast enhancement to reduce noise."""
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not load image")

    # Apply Gaussian blur to reduce grain
    blurred = cv2.GaussianBlur(img, (5, 5), 0)

    # Enhance contrast using CLAHE
    lab = cv2.cvtColor(blurred, cv2.COLOR_BGR2LAB)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    # Convert back to PIL Image
    enhanced_pil = Image.fromarray(cv2.cvtColor(enhanced, cv2.COLOR_BGR2RGB))
    return enhanced_pil

async def load_model():
    """Load the trained model on startup."""
    global model, idx2label, transform

    try:
        model_path = 'model.pth'
        if not os.path.exists(model_path):
            print(f"Warning: Model file not found at {model_path}")
            print("Server will start but predictions will not be available until model is loaded")
            return

        ckpt = torch.load(model_path, map_location='cpu')
        label2idx = ckpt.get('label2idx', {})
        idx2label = {v: k for k, v in label2idx.items()} if label2idx else {}

        num_classes = max(1, len(idx2label))
        model = SimpleCNN(num_classes=num_classes)
        model.load_state_dict(ckpt['model_state_dict'])
        model.eval()

        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
        ])

        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print("Server will start but predictions will not be available")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load resources on startup
    await load_model()
    yield
    # Clean up on shutdown (if needed)

# Initialize FastAPI app
app = FastAPI(
    title="WreckCheck API",
    description="Car Damage Detection AI System Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main HTML frontend."""
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return HTMLResponse(content="<h1>WreckCheck Frontend Not Found</h1><p>Please ensure index.html is in the project directory.</p>", status_code=404)

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict car damage classification from an uploaded image.

    Args:
        file: Image file to analyze

    Returns:
        JSON with prediction, confidence, and damage type
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            return JSONResponse(
                status_code=400,
                content={"error": "File must be an image"}
            )

        # Read file content
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:  # 5MB limit
            return JSONResponse(
                status_code=400,
                content={"error": "File size must be less than 5MB"}
            )

        # If model is not loaded, return demo response
        if not model:
            return JSONResponse({
                "prediction": "Unable to classify - Model not loaded",
                "confidence": 0,
                "damage_type": "N/A",
                "status": "Indeterminate",
                "severity": "Unknown",
                "area": "Model initialization required",
                "recommendation": "Please ensure model.pth is in the project directory and restart the server."
            })

        # Preprocess image
        img = preprocess_image(contents)
        img_tensor = transform(img).unsqueeze(0)

        # Make prediction
        with torch.no_grad():
            outputs = model(img_tensor)
            confidence_scores = torch.softmax(outputs, dim=1)
            max_confidence, pred = torch.max(confidence_scores, 1)

        # Get prediction label and confidence
        pred_idx = int(pred.item())
        pred_label = idx2label.get(pred_idx, f"Class {pred_idx}")
        confidence = float(max_confidence.item()) * 100

        return JSONResponse({
            "prediction": pred_label,
            "confidence": round(confidence, 2),
            "damage_type": pred_label,
            "status": "Confirmed" if confidence > 80 else "Indeterminate",
            "severity": categorize_severity(pred_label, confidence),
            "area": "See detailed report",
            "recommendation": f"This damage appears to be {pred_label.lower()}. Professional inspection recommended for repair assessment."
        })

    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing image: {str(e)}"}
        )

def categorize_severity(damage_type: str, confidence: float) -> str:
    """Categorize damage severity based on type and confidence."""
    damage_lower = damage_type.lower()

    if any(word in damage_lower for word in ['missing', 'shattered', 'broken']):
        return "Severe"
    elif any(word in damage_lower for word in ['crack', 'dent', 'paint']):
        return "Moderate"
    else:
        return "Minor"

# Serve static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory=".", html=False), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8080,
        log_level="info"
    )
