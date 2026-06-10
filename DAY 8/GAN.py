import tensorflow as tf

import numpy as np

import matplotlib.pyplot as plt

 

from tensorflow.keras.models import Sequential

from tensorflow.keras.layers import (

   Dense,

   Flatten,

   Reshape,

   LeakyReLU,

   Input

)

from tensorflow.keras.optimizers import Adam

 

# ==========================

# Load and Prepare MNIST

# ==========================

 

(X_train, _), (_, _) = tf.keras.datasets.mnist.load_data()

 

# Normalize images to [-1, 1]

X_train = X_train.astype("float32")

X_train = (X_train - 127.5) / 127.5

 

# Add channel dimension

X_train = np.expand_dims(X_train, axis=-1)

 

img_shape = (28, 28, 1)

latent_dim = 100

 

print("Training Images Shape:", X_train.shape)

 

# ==========================

# Generator

# ==========================

 

def build_generator():

 

   model = Sequential([

       Input(shape=(latent_dim,)),

 

       Dense(256),

       LeakyReLU(negative_slope=0.2),

 

       Dense(512),

       LeakyReLU(negative_slope=0.2),

 

       Dense(1024),

       LeakyReLU(negative_slope=0.2),

 

       Dense(784, activation="tanh"),

 

       Reshape(img_shape)

   ])

 

   return model

 

# ==========================

# Discriminator

# ==========================

 

def build_discriminator():

 

   model = Sequential([

       Input(shape=img_shape),

 

       Flatten(),

 

       Dense(512),

       LeakyReLU(negative_slope=0.2),

 

       Dense(256),

       LeakyReLU(negative_slope=0.2),

 

       Dense(1, activation="sigmoid")

   ])

 

   return model

 

# ==========================

# Build Models

# ==========================

 

generator = build_generator()

discriminator = build_discriminator()

 

discriminator.compile(

   loss="binary_crossentropy",

   optimizer=Adam(learning_rate=0.0002, beta_1=0.5),

   metrics=["accuracy"]

)

 

# ==========================

# GAN Model

# ==========================

 

discriminator.trainable = False

 

gan = Sequential([

   generator,

   discriminator

])

 

gan.compile(

   loss="binary_crossentropy",

   optimizer=Adam(learning_rate=0.0002, beta_1=0.5)

)

 

# ==========================

# Save Generated Images

# ==========================

 

def save_images(epoch):

 

   rows, cols = 5, 5

 

   noise = np.random.normal(

       0, 1, (rows * cols, latent_dim)

   )

 

   generated_images = generator.predict(

       noise,

       verbose=0

   )

 

   # Rescale to [0,1]

   generated_images = 0.5 * generated_images + 0.5

 

   fig, axes = plt.subplots(

       rows,

       cols,

       figsize=(8, 8)

   )

 

   count = 0

 

   for i in range(rows):

       for j in range(cols):

 

           axes[i, j].imshow(

               generated_images[count, :, :, 0],

               cmap="gray"

           )

 

           axes[i, j].axis("off")

 

           count += 1

 

   plt.tight_layout()

 

   plt.savefig(

       f"generated_epoch_{epoch}.png"

   )

 

   plt.close()

 

# ==========================

# Training Function

# ==========================

 

def train(

   epochs=10000,

   batch_size=128,

   save_interval=1000

):

 

   half_batch = batch_size // 2

 

   for epoch in range(epochs):

 

       # ------------------

       # Train Discriminator

       # ------------------

 

       idx = np.random.randint(

           0,

           X_train.shape[0],

           half_batch

       )

 

       real_images = X_train[idx]

 

       noise = np.random.normal(

           0,

           1,

           (half_batch, latent_dim)

       )

 

       fake_images = generator.predict(

           noise,

           verbose=0

       )

 

       d_loss_real = discriminator.train_on_batch(

           real_images,

           np.ones((half_batch, 1))

       )

 

       d_loss_fake = discriminator.train_on_batch(

           fake_images,

           np.zeros((half_batch, 1))

       )

 

       d_loss = 0.5 * np.add(

           d_loss_real,

           d_loss_fake

       )

 

       # ------------------

       # Train Generator

       # ------------------

 

       noise = np.random.normal(

           0,

           1,

           (batch_size, latent_dim)

       )

 

       valid_labels = np.ones(

           (batch_size, 1)

       )

 

       g_loss = gan.train_on_batch(

           noise,

           valid_labels

       )

 

       if epoch % 100 == 0:

 

           dloss = float(d_loss[0])

           dacc = float(d_loss[1])

 

           gloss = (

               float(g_loss[0])

               if isinstance(g_loss, (list, tuple))

               else float(g_loss)

           )

 

           print(

               f"Epoch {epoch} "

               f"[D loss: {dloss:.4f}, "

               f"Acc: {100*dacc:.2f}%] "

               f"[G loss: {gloss:.4f}]"

           )

 

       if epoch % save_interval == 0:

           save_images(epoch)

 

# ==========================

# Start Training

# ==========================

 

train(

   epochs=10000,

   batch_size=128,

   save_interval=1000

)

 

# ==========================

# Generate New Digits

# ==========================

 

noise = np.random.normal(

   0,

   1,

   (10, latent_dim)

)

 

generated_images = generator.predict(

   noise,

   verbose=0

)

 

generated_images = (

   generated_images + 1

) / 2.0

 

for i in range(10):

 

   plt.imshow(

       generated_images[i, :, :, 0],

       cmap="gray"

   )

 

   plt.axis("off")

   plt.show()

