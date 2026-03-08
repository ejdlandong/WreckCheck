"""
Preprocessing pipeline for car damage dataset.
"""
from torchvision import transforms

def get_preprocessing():
    return transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

# Example usage
if __name__ == "__main__":
    from PIL import Image
    img = Image.open("../dataset/images/example.jpg")
    preprocess = get_preprocessing()
    img_tensor = preprocess(img)
