# 🚗 Wreck Check
### Car Damage Detection Using Image Processing

Wreck Check is a beginner-friendly desktop application that detects **vehicle damage such as dents and scratches** from an uploaded image using a Convolutional Neural Network (CNN).

The system allows users to upload a photo of a vehicle, and the model will analyze the image and predict the type of damage detected.

This project demonstrates how computer vision and deep learning can be used for **automated vehicle damage detection**.

---

Example workflow:

1. Launch the application
2. Upload a vehicle image
3. The model analyzes the image
4. The predicted damage type is displayed

---

# ✨ Features

- Upload vehicle images
- Detect car damage using a trained CNN
- Simple desktop interface
- Instant prediction results
- Beginner-friendly system

---

# ⚙️ Installation Guide

## 1. Install Python

Download Python (version 3.8 or higher):
https://www.python.org/downloads/

During installation, make sure **Add Python to PATH** is checked.

---

## 2. Clone the Repository

Open terminal or command prompt and run:
git clone https://github.com/ejdlandong/WreckCheck.git

cd WreckCheck

---

## 3. Install Dependencies

Install the required libraries:
pip install torch torchvision PyQt5 pillow

Or if a requirements file exists:
pip install -r requirements.txt

---

# ▶️ Running the Application

Run the GUI application:

python gui/main.py

A window titled **"WreckCheck - Car Damage Detection"** will open.

---

# 🖼️ How to Use

1. Launch the application
2. Click **Upload Image**
3. Select a car image (.jpg, .png)
4. The system will analyze the image
5. The predicted damage type will be displayed


---

# 🧠 How the System Works

1. The user uploads a car image
2. The image is resized to **128 × 128 pixels**
3. The image is converted into a tensor
4. The trained CNN model processes the image
5. The model predicts the **damage category**
6. The result is displayed in the GUI

---

# 📊 Model Information

- Model type: Convolutional Neural Network (CNN)
- Framework: PyTorch
- Input size: 128 × 128
- Output: Damage classification label

Model weights are stored in:
model_training/model.pth

---

# 👨‍💻 Contributors

- Ronald Cabral
- Jersey Estrella
- Evan Landong