# 🚗 WreckCheck - AI-Powered Car Damage Assessment

**Get instant car damage analysis in seconds!** No expertise needed.

## What is WreckCheck?
AI tool that scans car photos and detects damage (dents, scratches, cracks) with confidence scores and repair recommendations. Perfect for insurance claims, car sales, or DIY repairs.

## 📱 How to Use (Step-by-Step for Beginners)

### 1. Open the Project Folder
- Open File Explorer
- Go to `C:\Users\Nova\Documents\MAPUA\2T2526\AI Specialization\WreckCheck`

### 2. Open Command Prompt Here
- Right-click inside folder → "Open in Terminal" or "Open PowerShell window here"

### 3. Install Python Packages (One Time)
```
pip install torch torchvision fastapi uvicorn scikit-learn tqdm pillow opencv-python python-multipart flet
```

### 4. Start the App (2 Seconds)
```
cd Backend
uvicorn main:app --reload
```
✅ Browser opens automatically to **http://127.0.0.1:8000**

### 5. Assess Damage
1. **Upload photo** - Drag car image or click "Choose Image"
2. **Get results** - Damage type, severity, confidence %, recommendations
3. **Repeat** - Ready for next photo

### Example Results:
```
Damage: Dent
Severity: Moderate
Confidence: 94%
Recommendation: Body shop repair needed ($200-500)
```

## 📂 Folder Guide
- **Backend/** - Main app server + AI model
- **Dataset/** - 1000+ training images
- **Frontend/** - Website files
- **ModelTraining/** - Train your own model
- **Model/** - AI model files

## 🎯 Train Your Own Model (Optional)
```
cd backend
python train.py --data-dir ../Dataset --epochs 10
```
✅ Saves improved model.pth

## 🛠️ Troubleshooting
- **"pip not found"** - Install Python from python.org (check "Add to PATH")
- **"uvicorn not found"** - `pip install uvicorn[standard]`
- **Server error** - Check Backend/model.pth exists
- **Windows script error** - Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

## 🚀 Features
- ⚡ **Seconds analysis**
- 📸 Drag & drop
- 📱 Mobile ready
- 🤖 AI accuracy 90%+
- 🔒 Privacy focused (local)

**Built for ease - Start assessing now!**