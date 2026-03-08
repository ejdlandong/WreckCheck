"""
Flask web app for WreckCheck Car Damage Detection
"""
from flask import Flask, render_template, request, redirect, url_for
import os
from PIL import Image
import torch
from torchvision import transforms

# Ensure project root is in sys.path for imports
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from model_training.model import SimpleCNN

app = Flask(__name__)
UPLOAD_FOLDER = 'web/static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load model

model_path = 'model_training/model.pth'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at '{model_path}'. Please train the model first using the training script.")
checkpoint = torch.load(model_path, map_location='cpu')
num_classes = len(checkpoint.get('label2idx', {1:0}))
model = SimpleCNN(num_classes=num_classes)
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()
label2idx = checkpoint.get('label2idx', {})
idx2label = {v: k for k, v in label2idx.items()}

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    filename = None
    if request.method == 'POST':
        file = request.files['image']
        if file:
            filename = file.filename
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            img = Image.open(filepath).convert('RGB')
            transform = transforms.Compose([
                transforms.Resize((128, 128)),
                transforms.ToTensor(),
            ])
            img_tensor = transform(img).unsqueeze(0)
            with torch.no_grad():
                out = model(img_tensor)
                _, pred = torch.max(out, 1)
                prediction = idx2label.get(int(pred.item()), str(int(pred.item())))
    return render_template('index.html', prediction=prediction, filename=filename)

if __name__ == '__main__':
    app.run(debug=True)
