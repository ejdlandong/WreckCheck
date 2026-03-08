"""
PyQt5 GUI for WreckCheck Car Damage Detection
"""
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton, QFileDialog, QVBoxLayout, QWidget, QHBoxLayout, QPixmap, QMessageBox
from PyQt5.QtGui import QImage
from PyQt5.QtCore import Qt
import torch
from torchvision import transforms
from PIL import Image
import os
from model_training.model import SimpleCNN

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('WreckCheck - Car Damage Detection')
        self.setGeometry(100, 100, 600, 400)
        self.model = self.load_model()
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        self.label = QLabel('Upload a car image to detect damage')
        self.label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.label)
        self.img_label = QLabel()
        self.img_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.img_label)
        btn_layout = QHBoxLayout()
        self.upload_btn = QPushButton('Upload Image')
        self.upload_btn.clicked.connect(self.upload_image)
        btn_layout.addWidget(self.upload_btn)
        layout.addLayout(btn_layout)
        self.result_label = QLabel('')
        self.result_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.result_label)
        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def load_model(self):
        model_path = os.path.join('..', 'model_training', 'model.pth')
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
            self.img_label.setPixmap(pixmap.scaled(256, 256, Qt.KeepAspectRatio))
            self.predict_image(fname)

    def predict_image(self, img_path):
        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
        ])
        img = Image.open(img_path).convert('RGB')
        img_tensor = transform(img).unsqueeze(0)
        with torch.no_grad():
            out = self.model(img_tensor)
            _, pred = torch.max(out, 1)
            label = self.idx2label.get(int(pred.item()), str(int(pred.item())))
            self.result_label.setText(f'Prediction: {label}')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
