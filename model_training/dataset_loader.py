"""
Dataset loader for car damage dataset.
"""
import os
from PIL import Image
import pandas as pd
import torch
from torch.utils.data import Dataset

class ImageCSVLoader(Dataset):
    """Loads images and labels from a CSV file."""
    def __init__(self, csv_path, images_dir, transform=None, require_labels=True):
        self.csv_path = csv_path
        self.images_dir = images_dir
        self.df = pd.read_csv(csv_path, header=0 if 'filename' in pd.read_csv(csv_path, nrows=0).columns else None)
        if 'filename' in self.df.columns and 'label' in self.df.columns:
            self.filenames = self.df['filename'].astype(str).tolist()
            self.labels = self.df['label'].tolist()
        else:
            self.filenames = self.df.iloc[:, 0].astype(str).tolist()
            if self.df.shape[1] > 1:
                self.labels = self.df.iloc[:, 1].tolist()
            else:
                self.labels = [None] * len(self.filenames)
        self.require_labels = require_labels
        if require_labels:
            unique = sorted([l for l in self.labels if l is not None])
            self.label2idx = {l: i for i, l in enumerate(sorted(set(unique)))}
        else:
            self.label2idx = {}
        self.transform = transform
    def __len__(self):
        return len(self.filenames)
    def __getitem__(self, idx):
        fname = self.filenames[idx]
        path = os.path.join(self.images_dir, fname)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Image not found: {path}")
        img = Image.open(path).convert('RGB')
        img = self.transform(img) if self.transform else img
        if self.require_labels:
            label = self.labels[idx]
            if label not in self.label2idx:
                self.label2idx[label] = len(self.label2idx)
            return img, self.label2idx[label]
        else:
            return img, fname
    def get_num_classes(self):
        return max(1, len(self.label2idx))
