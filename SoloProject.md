# SOLO PROJECT

## SHORT Summary

### The application detects faces using OpenCV through DeepFace, converts each face into a 512-dimensional FaceNet512 embedding, stores embeddings during registration, and during recognition compares detected-face embeddings against all registered embeddings using cosine similarity. The best match above the chosen threshold is labeled, and OpenCV draws the result on the uploaded image.

## TO RUN THE APPLICATION

### Go to SoloProject Folder and activate the virtual environment by "venv\Scripts\activate" then run the app by "python app.py" ip address will be mentioned in the output ,go that address where the application is currently hosted .