# ==========================================
# Intel Image Classification - Prediction Script
# Save this file as 'predict.py' in the same folder
# ==========================================

import os
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

# 1. Define configurations (Must match training settings)
IMG_HEIGHT = 150
IMG_WIDTH = 150
MODEL_PATH = "intel_image_classifier.keras"
PRED_DIR = "./intel_dataset/seg_pred/seg_pred" # Path to unlabelled images

# Hardcoded class names in the exact order they were trained
# (Make sure this matches the alphabetical order of your original training folders)
class_names = ['buildings', 'forest', 'glacier', 'mountain', 'sea', 'street']

# 2. Load the trained model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Could not find '{MODEL_PATH}'. Did you run the training script first?")

print("Loading trained model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!\n")

# 3. Load unlabelled prediction images using tf.data
# Note: Since seg_pred doesn't have subfolders, we set label_mode=None
print(f"Loading prediction images from: {PRED_DIR}")
try:
    pred_dataset = tf.keras.preprocessing.image_dataset_from_directory(
        # Pointing to the parent directory because image_dataset_from_directory 
        # expects a folder containing subfolders, or just the folder itself if labels=None
        os.path.dirname(PRED_DIR), 
        labels=None,
        image_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=10, # Just grab 10 images to visualize
        shuffle=True
    )
except Exception as e:
    print(f"Error loading images. Double check your path: {PRED_DIR}")
    raise e

# 4. Normalize and Predict
normalization_layer = tf.keras.layers.Rescaling(1./255)

print("\nGenerating predictions for a sample batch...")
for images in pred_dataset.take(1):
    # Normalize the images exactly like we did during training
    normalized_images = normalization_layer(images)
    
    # Run predictions
    predictions = model.predict(normalized_images, verbose=0)
    pred_classes = np.argmax(predictions, axis=1)
    confidence_scores = np.max(predictions, axis=1)

    # 5. Plot the results
    plt.figure(figsize=(15, 7))
    for i in range(min(10, len(images))):
        plt.subplot(2, 5, i + 1)
        plt.imshow(images[i].numpy().astype("uint8"))
        
        predicted_label = class_names[pred_classes[i]]
        confidence = confidence_scores[i] * 100
        
        plt.title(f"Predicted: {predicted_label}\nConf: {confidence:.1f}%", fontsize=10)
        plt.axis("off")
        
    plt.tight_layout()
    plt.savefig('unseen_predictions.png')
    print("Saved prediction plot as 'unseen_predictions.png'")
    plt.show()