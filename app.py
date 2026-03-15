"""
PyQt5 GUI for WreckCheck Car Damage Detection
"""
import sys
import os
# Add the parent directory to sys.path to allow imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton, QFileDialog, QVBoxLayout, QWidget, QHBoxLayout, QMessageBox, QFrame, QSpacerItem, QSizePolicy
from PyQt5.QtGui import QImage, QPixmap, QFont, QIcon
from PyQt5.QtCore import Qt
from src.model import SimpleCNN

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('WreckCheck - Car Damage Detection')
        self.setGeometry(100, 100, 800, 600)
        self.setMinimumSize(600, 500)
        self.model = self.load_model()
        self.init_ui()
        self.apply_styles()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)
        
        # Title
        title_label = QLabel('WreckCheck')
        title_label.setAlignment(Qt.AlignCenter)
        title_font = QFont('Arial', 24, QFont.Bold)
        title_label.setFont(title_font)
        title_label.setStyleSheet("color: #2E3440; margin-bottom: 10px;")
        main_layout.addWidget(title_label)
        
        subtitle_label = QLabel('AI-Powered Car Damage Detection')
        subtitle_label.setAlignment(Qt.AlignCenter)
        subtitle_font = QFont('Arial', 12)
        subtitle_label.setFont(subtitle_font)
        subtitle_label.setStyleSheet("color: #4C566A; margin-bottom: 20px;")
        main_layout.addWidget(subtitle_label)
        
        # Instruction
        self.label = QLabel('Select a car image to analyze for damage')
        self.label.setAlignment(Qt.AlignCenter)
        self.label.setStyleSheet("color: #434C5E; font-size: 14px; margin-bottom: 10px;")
        main_layout.addWidget(self.label)
        
        # Image display area
        image_frame = QFrame()
        image_frame.setFrameStyle(QFrame.Box)
        image_frame.setStyleSheet("border: 2px solid #D8DEE9; border-radius: 5px; background-color: #F8F9FA;")
        image_layout = QVBoxLayout(image_frame)
        image_layout.setContentsMargins(10, 10, 10, 10)
        
        self.img_label = QLabel('No image selected')
        self.img_label.setAlignment(Qt.AlignCenter)
        self.img_label.setMinimumSize(400, 300)
        self.img_label.setStyleSheet("border: 1px solid #E5E9F0; background-color: white;")
        image_layout.addWidget(self.img_label)
        main_layout.addWidget(image_frame)
        
        # Spacer
        main_layout.addItem(QSpacerItem(20, 20, QSizePolicy.Minimum, QSizePolicy.Fixed))
        
        # Button
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        self.upload_btn = QPushButton('Upload & Analyze Image')
        self.upload_btn.setMinimumSize(200, 40)
        self.upload_btn.setStyleSheet("""
            QPushButton {
                background-color: #5E81AC;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #81A1C1;
            }
            QPushButton:pressed {
                background-color: #4C566A;
            }
        """)
        self.upload_btn.clicked.connect(self.upload_image)
        button_layout.addWidget(self.upload_btn)
        
        self.clear_btn = QPushButton('Clear')
        self.clear_btn.setMinimumSize(100, 40)
        self.clear_btn.setStyleSheet("""
            QPushButton {
                background-color: #D08770;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #EBCB8B;
            }
            QPushButton:pressed {
                background-color: #BF616A;
            }
        """)
        self.clear_btn.clicked.connect(self.clear_image)
        button_layout.addWidget(self.clear_btn)
        button_layout.addStretch()
        main_layout.addLayout(button_layout)
        
        # Result
        self.result_label = QLabel('')
        self.result_label.setAlignment(Qt.AlignCenter)
        self.result_label.setStyleSheet("color: #2E3440; font-size: 16px; font-weight: bold; margin-top: 10px;")
        self.result_label.setWordWrap(True)
        main_layout.addWidget(self.result_label)
        
        # Spacer at bottom
        main_layout.addStretch()

    def apply_styles(self):
        self.setStyleSheet("""
            QMainWindow {
                background-color: #ECEFF4;
            }
        """)

    def load_model(self):
        model_path = os.path.join('..', 'src', 'model.pth')
        if not os.path.exists(model_path):
            QMessageBox.critical(self, 'Error', f'Model not found at {model_path}')
            sys.exit(1)
        checkpoint = torch.load(model_path, map_location='cpu')
        num_classes = len(checkpoint.get('label2idx', {1:0}))
        model = SimpleCNN(num_classes=num_classes)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.eval()
        self.label2idx = checkpoint.get('label2idx', {})
        self.idx2label = {v: k for k, v in self.label2idx.items()}
        return model

    def upload_image(self):
        fname, _ = QFileDialog.getOpenFileName(self, 'Open Image', '', 'Image Files (*.png *.jpg *.jpeg)')
        if fname:
            pixmap = QPixmap(fname)
            scaled_pixmap = pixmap.scaled(self.img_label.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation)
            self.img_label.setPixmap(scaled_pixmap)
            self.predict_image(fname)

    def clear_image(self):
        self.img_label.setPixmap(QPixmap())
        self.img_label.setText('No image selected')
        self.result_label.setText('')

    def predict_image(self, img_path):
        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
        ])
        img = Image.open(img_path).convert('RGB')
        img_tensor = transform(img).unsqueeze(0)
        with torch.no_grad():
            out = self.model(img_tensor)
            probs = F.softmax(out, dim=1)
            _, pred = torch.max(out, 1)
            damaged_prob = probs[0][0].item() * 100
            undamaged_prob = probs[0][1].item() * 100
            pred_label = self.idx2label.get(int(pred.item()), str(int(pred.item())))
            self.result_label.setText(f'Detection Result: {pred_label.title()}\nDamaged: {damaged_prob:.1f}% | Undamaged: {undamaged_prob:.1f}%')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
