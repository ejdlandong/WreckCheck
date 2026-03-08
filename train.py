"""
Model training script for car damage classification.
"""
import argparse
import torch
from torch.utils.data import DataLoader, Subset
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from tqdm import tqdm
from model import SimpleCNN

# Ensure project root is in sys.path for imports
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.helpers import seed_everything, ensure_dir
from preprocessing.preprocess import get_preprocessing
from data_augmentation.augment import get_augmentation
from dataset_loader import ImageCSVLoader


def train_main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data-dir', default='../dataset', help='Dataset root (contains images/ and labels.csv)')
    parser.add_argument('--csv', default='../dataset/labels.csv', help='Labels CSV path')
    parser.add_argument('--epochs', type=int, default=5)
    parser.add_argument('--batch-size', type=int, default=16)
    parser.add_argument('--lr', type=float, default=1e-3)
    parser.add_argument('--save-path', default='../model_training/model.pth')
    args = parser.parse_args()

    seed_everything()
    ensure_dir('../model_training')

    # Resolve CSV and images directory relative to project root
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    csv_path = args.csv
    if not os.path.isabs(csv_path):
        csv_path = os.path.join(project_root, csv_path.lstrip('./'))
    images_dir = os.path.join(project_root, args.data_dir.lstrip('./'), 'images')
    dataset = ImageCSVLoader(csv_path, images_dir, transform=get_augmentation(), require_labels=True)
    n = len(dataset)
    if n == 0:
        raise RuntimeError('Dataset appears empty (no rows in CSV)')
    indices = list(range(n))
    train_idx, val_idx = train_test_split(indices, test_size=0.2, random_state=42)
    train_ds = Subset(dataset, train_idx)
    val_ds = Subset(dataset, val_idx)
    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = SimpleCNN(num_classes=dataset.get_num_classes()).to(device)
    optimizer = optim.Adam(model.parameters(), lr=args.lr)
    criterion = nn.CrossEntropyLoss()

    for epoch in range(1, args.epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for imgs, labels in tqdm(train_loader, desc=f'Train Epoch {epoch}'):
            imgs = imgs.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * imgs.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
        train_loss = running_loss / total
        train_acc = correct / total
        # validation
        model.eval()
        vloss = 0.0
        vcorrect = 0
        vtotal = 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs = imgs.to(device)
                labels = labels.to(device)
                outputs = model(imgs)
                loss = criterion(outputs, labels)
                vloss += loss.item() * imgs.size(0)
                _, preds = torch.max(outputs, 1)
                vcorrect += (preds == labels).sum().item()
                vtotal += labels.size(0)
        val_loss = vloss / vtotal
        val_acc = vcorrect / vtotal
        print(f'Epoch {epoch}: train_loss={train_loss:.4f} train_acc={train_acc:.4f} | val_loss={val_loss:.4f} val_acc={val_acc:.4f}')
    torch.save({'model_state_dict': model.state_dict(), 'label2idx': dataset.label2idx}, args.save_path)
    print(f'Model saved to {args.save_path}')

if __name__ == '__main__':
    train_main()
