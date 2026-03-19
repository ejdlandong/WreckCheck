from torchvision import transforms

def get_preprocessing():
    return transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
    ])

