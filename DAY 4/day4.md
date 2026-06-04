# Day 4

## Compare Model Program 

### 🤖 Models Used

- Custom CNN (built from scratch using Conv2D layers)
- MobileNetV2 (transfer learning)
- ResNet50 (transfer learning)
- EfficientNetB0 (transfer learning)

### 📊 Dataset Used

- CIFAR-10 (CIFAR-10 dataset from TensorFlow/Keras)

### Output

<p align="center">
  <img src="CompareModel-OP1.png" alt="CompareModel-OP1" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="CompareModel-OP2.png" alt="CompareModel-OP2" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="CompareModel-OP3.png" alt="CompareModel-OP3" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="CompareModel-OP4.png" alt="CompareModel-OP4" style="max-width:100%; height:auto;">
</p>

## Compare Model Dataset2 Program 

### 🤖 Models Used

- Custom CNN (built from scratch using Conv2D layers)
- MobileNetV2 (transfer learning using ImageNet weights)
- ResNet50 (deep residual network, transfer learning)
- EfficientNetB0 (efficient CNN architecture with transfer learning)

### 📊 Dataset Used

- Fashion-MNIST (fashion image dataset loaded via TensorFlow/Keras)

### Output

<p align="center">
  <img src="CompareModel-dataset2-OP1.png" alt="CompareModel-dataset2-OP1" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="CompareModel-dataset2-OP2.png" alt="CompareModel-dataset2-OP2" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="CompareModel-dataset2-OP3.png" alt="CompareModel-dataset2-OP3" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="CompareModel-dataset2-OP4.png" alt="CompareModel-dataset2-OP4" style="max-width:100%; height:auto;">
</p>

# Load Dataset Program 

### 🤖 Model Used

- None (Dataset loading and exploration only)

### 📊 Dataset Used

- PlantVillage (loaded from Hugging Face datasets library)

### Output

<p align="center">
  <img src="LoadDataset-OP1.png" alt="LoadDataset-OP1" style="max-width:100%; height:auto;">
</p>

# Image Classification Using MobileNETV2 Program

### 🤖 Model Used

- MobileNetV2 (pretrained on ImageNet)
- Transfer Learning model with custom classification head
- Data augmentation applied (flip, rotation, zoom)

### 📊 Dataset Used

- Flower Photos Dataset (TensorFlow)
- 5 classes: daisy, dandelion, roses, sunflowers, tulips
- Used for image classification

### 🧪 Test Flower Used

<p align="center">
  <img src="test_flower.jpg" alt="test_flower" style="max-width:100%; height:auto;">
</p>

### Output

<p align="center">
  <img src="ImageClassificationUsingMobileNETV2-OP1.png" alt="ImageClassificationUsingMobileNETV2-OP1" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="ImageClassificationUsingMobileNETV2-OP2.png" alt="ImageClassificationUsingMobileNETV2-OP2" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="ImageClassificationUsingMobileNETV2-OP3.png" alt="ImageClassificationUsingMobileNETV2-OP3" style="max-width:100%; height:auto;">
</p>
<p align="center">
  <img src="ImageClassificationUsingMobileNETV2-OP4.png" alt="ImageClassificationUsingMobileNETV2-OP4" style="max-width:100%; height:auto;">
</p>

### Also generates <b><i>flower_classifier</i></b> which stores results after training 