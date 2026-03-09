"""
Data augmentation utilities for car damage dataset.
"""
from torchvision import transforms
from PIL import Image
import random

def get_augmentation():
    return transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        transforms.RandomResizedCrop((128, 128), scale=(0.8, 1.0)),
        transforms.ToTensor(),
    ])

# Example usage
if __name__ == "__main__":
    img = Image.open("../dataset/images/example.jpg")
    aug = get_augmentation()
    img_aug = aug(img)
