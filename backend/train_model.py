import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
import os
import numpy as np
from pathlib import Path

class CityFixDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        """
        root_dir должен содержать папки с названиями категорий:
        root_dir/
            roads/
                img1.jpg
                img2.jpg
            light/
                img1.jpg
            water/
                ...
        """
        self.root_dir = root_dir
        self.transform = transform
        self.images = []
        self.labels = []
        self.categories = ['roads', 'light', 'water', 'trash', 'graffiti', 'buildings', 'trees', 'other']
        
        # Загружаем все изображения
        for idx, category in enumerate(self.categories):
            category_dir = os.path.join(root_dir, category)
            if os.path.exists(category_dir):
                for img_file in os.listdir(category_dir):
                    if img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                        self.images.append(os.path.join(category_dir, img_file))
                        self.labels.append(idx)
        
        print(f"Loaded {len(self.images)} images")
        for i, cat in enumerate(self.categories):
            count = sum(1 for label in self.labels if label == i)
            print(f"  {cat}: {count} images")
    
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        img_path = self.images[idx]
        image = Image.open(img_path).convert('RGB')
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
        
        return image, label

def train_model():
    # Настройки
    batch_size = 32
    num_epochs = 50
    learning_rate = 0.001
    num_classes = 8
    
    # Трансформации для аугментации данных
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Загружаем данные
    print("Loading dataset...")
    dataset = CityFixDataset('/Users/assettileubekuly/Downloads/b_6DNyYZyyRdL-1772617397895 2/training_data', transform=train_transform)
    
    # Разделяем на train/val
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(
        dataset, [train_size, val_size]
    )
    
    # Применяем разные трансформации для val
    val_dataset.dataset.transform = val_transform
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    # Создаем модель
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model = model.to(device)
    
    # Функция потерь и оптимизатор
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=3)
    
    # Обучение
    print("Starting training...")
    best_val_loss = float('inf')
    
    for epoch in range(num_epochs):
        # Train
        model.train()
        train_loss = 0
        train_correct = 0
        train_total = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            _, predicted = outputs.max(1)
            train_total += labels.size(0)
            train_correct += predicted.eq(labels).sum().item()
        
        train_acc = 100. * train_correct / train_total
        
        # Validate
        model.eval()
        val_loss = 0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()
        
        val_acc = 100. * val_correct / val_total
        avg_val_loss = val_loss / len(val_loader)
        
        scheduler.step(avg_val_loss)
        
        print(f'Epoch [{epoch+1}/{num_epochs}]')
        print(f'  Train Loss: {train_loss/len(train_loader):.4f}, Acc: {train_acc:.2f}%')
        print(f'  Val Loss: {avg_val_loss:.4f}, Acc: {val_acc:.2f}%')
        
        # Сохраняем лучшую модель
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            # Создаем папку models если её нет
            os.makedirs('models', exist_ok=True)
            torch.save(model.state_dict(), 'models/cityfix_model.pth')
            print(f'  ✓ Model saved!')
    
    print("Training completed!")

if __name__ == "__main__":
    train_model()