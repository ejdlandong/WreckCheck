# WreckCheck FastAPI Backend

This is the FastAPI backend for the WreckCheck car damage detection system. It serves the HTML frontend and provides AI-powered damage analysis through REST API endpoints.

## Architecture

- **Frontend**: HTML/CSS/JavaScript (index.html)
- **Backend**: FastAPI server (main.py)
- **AI Model**: PyTorch CNN for damage classification

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the FastAPI server:
```bash
python main.py
```

The server will start on `http://127.0.0.1:8080`

## API Endpoints

### GET /
- Serves the HTML frontend (index.html)

### POST /api/predict
- Accepts image file upload for damage analysis
- Returns JSON with prediction results

**Request**: Multipart form data with `file` field containing image
**Response**: JSON with damage analysis results

Example API call:
```bash
curl -X POST "http://127.0.0.1:8080/api/predict" \
  -F "file=@path/to/image.jpg"
```

## File Structure

```
WreckCheck-Estrella/
├── main.py              # FastAPI backend server
├── index.html           # HTML frontend
├── script.js            # Frontend JavaScript (calls API)
├── style.css            # Frontend styling
├── model.py             # PyTorch CNN model
├── model.pth            # Trained model weights (if available)
├── requirements.txt      # Python dependencies
└── dataset/             # Training data
```

## Features

- **Web Frontend**: Modern HTML interface with drag-and-drop image upload
- **AI Analysis**: PyTorch-based CNN for damage classification
- **REST API**: Clean API endpoints for integration
- **Image Processing**: Advanced preprocessing with Gaussian blur and CLAHE
- **Real-time Results**: Instant damage analysis with confidence scores

## Model Requirements

The system expects a trained PyTorch model file (`model.pth`) in the project root. If the model is not available, the API will return appropriate messages indicating the model needs to be loaded.