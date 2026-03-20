# 🚗 WreckCheck – Car Damage Detection System

## 📌 Overview

*WreckCheck* is an AI-powered web application that analyzes car images and detects possible damage.
It uses a Convolutional Neural Network (CNN) to classify whether a vehicle has damage and provides:

* Damage type
* Severity level
* Confidence score
* Basic repair recommendation

This project is designed for *educational purposes*, showcasing how AI can be integrated into a full-stack application using *FastAPI + HTML/CSS/JS + PyTorch*.

---

## 🎯 Purpose of the Project

The goal of WreckCheck is to:

* Demonstrate *computer vision in real-world scenarios*
* Help users quickly assess *vehicle damage from images*
* Provide a foundation for *insurance, inspection, or repair tools*
* Serve as a *learning project* for AI + web integration

---

## 🛠️ Requirements (What You Need to Install)

Before running the project, install the following:

### 1. Install Python

* Download Python (3.9 or higher) from: https://www.python.org/downloads/
* During installation, ✔️ check *"Add Python to PATH"*

---

### 2. Install Required Libraries

Open *Command Prompt / PowerShell* in your project folder and run:

pip install fastapi uvicorn torch torchvision pillow opencv-python numpy

---

## 📁 Project Structure

Make sure your folder looks like this:

WreckCheck/
│── main.py
│── model.py
│── index.html
│── style.css
│── script.js
│── model.pth   ❗ (IMPORTANT)

---

## ⚠️ IMPORTANT: model.pth

Your app *will NOT work without this file*.

### What is it?

* model.pth = trained AI model weights

### If you DON’T have it:

* The app will show:

Model initialization required

### Options:

✔ Option 1 (Recommended): Use a trained model
✔ Option 2: Generate a dummy model (for testing UI only)

---

## ▶️ How to Run the Program (Step-by-Step)

### Step 1: Open Terminal

Go to your project folder:

cd path/to/WreckCheck

---

### Step 2: Run the Server

uvicorn main:app --reload

---

### Step 3: Open in Browser

Go to:

http://127.0.0.1:8000

---

### Step 4: Use the App

1. Click *"Choose Image"*
2. Upload a car image
3. Wait for AI analysis
4. View results:

   * Damage
   * Severity
   * Confidence
   * Recommendation

---

## 🧠 How It Works

1. User uploads an image
2. Image is preprocessed (blur + contrast enhancement)
3. Image is passed into the CNN model
4. Model outputs prediction
5. Backend sends results to frontend

---

## ❌ Common Errors & Fixes

### ❗ "Model initialization required"

👉 Fix:

* Make sure model.pth exists in the folder
* Restart server

---

### ❗ "Module not found"

👉 Fix:

pip install <missing-module>

---

### ❗ CSS/JS not loading

👉 Fix:

* Ensure files are in the same folder
* Check this path in HTML:

/static/style.css
/static/script.js

---

### ❗ Port already in use

👉 Fix:

uvicorn main:app --reload --port 8001

---

## 💡 Beginner Tips

* Always run commands *inside the project folder*
* If something breaks → restart the server
* If unsure → check terminal errors carefully

---

## 🚀 Future Improvements

* Better trained dataset
* Damage localization (bounding boxes)
* Multiple damage classification
* Mobile app version
* Real insurance integration

---

## 👨‍💻 Developers

Created as part of an AI specialization project.
- Ronald Cabral
- Jersey Estrella
- Evan Landong