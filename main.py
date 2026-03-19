"""
FastAPI backend for WreckCheck car damage detection system.
Serves the HTML frontend and provides prediction API endpoints.
"""
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import torch
from torchvision import transforms
from PIL import Image
import cv2
import numpy as np
import os

from model import SimpleCNN

# Global variables
model = None
idx2label = {}
transform = None

def preprocess_image(image_bytes):
    """Apply Gaussian blur and contrast enhancement to reduce noise."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not load image")

    blurred = cv2.GaussianBlur(img, (5, 5), 0)
    lab = cv2.cvtColor(blurred, cv2.COLOR_BGR2LAB)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    return Image.fromarray(enhanced)

def create_dummy_model(path="model.pth"):
    """Create a dummy model with random weights and fake labels."""
    dummy_model = SimpleCNN(num_classes=2)
    label2idx = {"dent": 0, "scratch": 1}
    torch.save({
        "model_state_dict": dummy_model.state_dict(),
        "label2idx": label2idx
    }, path)
    print(f"Dummy model created at {path} for testing purposes.")

async def load_model():
    """Load the trained model on startup, or create a dummy model if missing."""
    global model, idx2label, transform

    model_path = "model.pth"
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}, creating dummy model...")
        create_dummy_model(model_path)

    try:
        ckpt = torch.load(model_path, map_location="cpu")

        # Detect if ckpt is a state_dict or full checkpoint
        if "model_state_dict" in ckpt:
            state_dict = ckpt["model_state_dict"]
            label2idx = ckpt.get("label2idx", {})
        else:
            state_dict = ckpt
            label2idx = {0: "No Damage", 1: "Damage"}

        idx2label = {v: k for k, v in label2idx.items()} if label2idx else {0: "No Damage", 1: "Damage"}
        num_classes = max(idx2label.keys()) + 1

        model = SimpleCNN(num_classes=num_classes)
        model.load_state_dict(state_dict)
        model.eval()

        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
        ])
        print("Model loaded successfully!")

    except Exception as e:
        print(f"Error loading model: {e}")
        print("Server will start but predictions will not be available.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await load_model()
    yield

app = FastAPI(lifespan=lifespan, title="WreckCheck API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def root():
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return HTMLResponse("<h1>Frontend not found</h1>", status_code=404)

def categorize_severity(damage_type: str, confidence: float) -> str:
    damage_lower = damage_type.lower()
    if any(word in damage_lower for word in ['missing', 'shattered', 'broken']):
        return "Severe"
    elif any(word in damage_lower for word in ['crack', 'dent', 'paint']):
        return "Moderate"
    else:
        return "Minor"

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        return JSONResponse({
            "prediction": "N/A",
            "confidence": 0,
            "damage_type": "N/A",
            "status": "Indeterminate",
            "severity": "Unknown",
            "area": "Model initialization required",
            "recommendation": "Please ensure model.pth is in the project directory and restart the server."
        })

    contents = await file.read()
    img = preprocess_image(contents)
    img_tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        max_confidence, pred_idx = torch.max(probs, 1)

    pred_idx = int(pred_idx.item())
    pred_label = idx2label.get(pred_idx, f"Class {pred_idx}")
    confidence = float(max_confidence.item()) * 100

    return JSONResponse({
        "prediction": pred_label,
        "confidence": round(confidence, 2),
        "damage_type": pred_label,
        "status": "Confirmed" if confidence > 80 else "Indeterminate",
        "severity": categorize_severity(pred_label, confidence),
        "area": "See detailed report",
        "recommendation": f"This damage appears to be {pred_label.lower()}. Professional inspection recommended."
    })

# Serve static files (JS/CSS/images)
app.mount("/static", StaticFiles(directory=".", html=False), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")