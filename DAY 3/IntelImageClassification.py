# ==========================================
# Intel Image Classification using CNN
# VS Code / Local Environment Complete Code
# ==========================================

import os
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
# ==========================================
# Dataset Paths
# ==========================================

dataset_path = "./intel_dataset"

train_dir = os.path.join(dataset_path, "seg_train")
test_dir = os.path.join(dataset_path, "seg_test")
pred_dir = os.path.join(dataset_path, "seg_pred")

print("Train Path Exists:", os.path.exists(train_dir))
print("Test Path Exists:", os.path.exists(test_dir))
print("Pred Path Exists:", os.path.exists(pred_dir))

if not os.path.exists(train_dir):
    raise FileNotFoundError(f"Training folder not found: {train_dir}")

if not os.path.exists(test_dir):
    raise FileNotFoundError(f"Test folder not found: {test_dir}")

print("Dataset folders loaded successfully.\n")
# ==========================================
# Parameters
# ==========================================

IMG_HEIGHT = 150
IMG_WIDTH = 150
BATCH_SIZE = 32

# ==========================================
# Load Dataset
# ==========================================

train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    label_mode='int'
)

test_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    test_dir,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    shuffle=False,
    label_mode='int'
)

# Class Names
class_names = train_dataset.class_names
print("\nDetected Classes:", class_names)

# ==========================================
# Normalize Images & Performance Optimization
# ==========================================

normalization_layer = tf.keras.layers.Rescaling(1./255)

train_dataset = train_dataset.map(lambda x, y: (normalization_layer(x), y))
test_dataset = test_dataset.map(lambda x, y: (normalization_layer(x), y))

AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
test_dataset = test_dataset.prefetch(buffer_size=AUTOTUNE)

# ==========================================
# Build CNN Model
# ==========================================

model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(150,150,3)),
    tf.keras.layers.MaxPooling2D(2,2),

    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),

    tf.keras.layers.Conv2D(128, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),

    tf.keras.layers.Conv2D(256, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),

    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(class_names), activation='softmax')
])

# ==========================================
# Compile Model
# ==========================================

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ==========================================
# Train Model
# ==========================================

history = model.fit(
    train_dataset,
    epochs=10,
    validation_data=test_dataset
)

# ==========================================
# Evaluate Model
# ==========================================

test_loss, test_accuracy = model.evaluate(test_dataset)
print("\n========================")
print("Test Accuracy:", test_accuracy)
print("========================")

# ==========================================
# Plot & Save Accuracy & Loss
# ==========================================

plt.figure(figsize=(12,5))

plt.subplot(1,2,1)
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1,2,2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.savefig('learning_curves.png')
print("Saved learning curves plot as 'learning_curves.png'")
plt.show()

# ==========================================
# Predictions
# ==========================================

y_true = []
y_pred = []

print("\nGenerating predictions for evaluation metrics...")
for images, labels in test_dataset:
    predictions = model.predict(images, verbose=0)
    predicted_classes = np.argmax(predictions, axis=1)
    
    y_true.extend(labels.numpy())
    y_pred.extend(predicted_classes)

y_true = np.array(y_true)
y_pred = np.array(y_pred)

# ==========================================
# Confusion Matrix
# ==========================================

cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8,6))
sns.heatmap(
    cm, 
    annot=True, 
    fmt='d', 
    cmap='Blues', 
    xticklabels=class_names, 
    yticklabels=class_names
)
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")

plt.tight_layout()
plt.savefig('confusion_matrix.png')
print("Saved confusion matrix plot as 'confusion_matrix.png'")
plt.show()

# ==========================================
# Classification Report
# ==========================================

print("\nClassification Report\n")
print(classification_report(y_true, y_pred, target_names=class_names))

# ==========================================
# Display Sample Predictions
# ==========================================

plt.figure(figsize=(15,8))
for images, labels in test_dataset.take(1):
    predictions = model.predict(images, verbose=0)
    pred_classes = np.argmax(predictions, axis=1)

    for i in range(min(10, len(images))):
        plt.subplot(2,5,i+1)
        plt.imshow(images[i].numpy())
        
        actual = class_names[labels[i]]
        predicted = class_names[pred_classes[i]]
        
        plt.title(f"A:{actual}\nP:{predicted}", fontsize=9)
        plt.axis("off")

plt.tight_layout()
plt.savefig('sample_predictions.png')
print("Saved sample predictions plot as 'sample_predictions.png'")
plt.show()

# ==========================================
# Save Model
# ==========================================

# Using the native Keras format '.keras' instead of old '.h5' format (recommended for modern TF versions)
model.save("intel_image_classifier.keras")
print("\nModel saved successfully as 'intel_image_classifier.keras'!")