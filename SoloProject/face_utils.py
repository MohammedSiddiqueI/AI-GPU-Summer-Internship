import os
import json
import uuid

import cv2
import numpy as np

from deepface import DeepFace


MODEL_NAME = "Facenet512"

# Display similarity threshold.
# You can tune this later.
SIMILARITY_THRESHOLD = 70.0


def cosine_similarity(embedding1, embedding2):
    embedding1 = np.array(embedding1, dtype=np.float32)
    embedding2 = np.array(embedding2, dtype=np.float32)

    denominator = (
        np.linalg.norm(embedding1)
        * np.linalg.norm(embedding2)
    )

    if denominator == 0:
        return 0.0

    similarity = np.dot(
        embedding1,
        embedding2
    ) / denominator

    return float(similarity)


def similarity_to_percentage(similarity):
    percentage = similarity * 100
    percentage = max(0, min(100, percentage))

    return round(percentage, 2)


def load_persons(data_folder):
    persons_file = os.path.join(
        data_folder,
        "persons.json"
    )

    if not os.path.exists(persons_file):
        return []

    try:
        with open(
            persons_file,
            "r",
            encoding="utf-8"
        ) as file:
            return json.load(file)

    except (json.JSONDecodeError, OSError):
        return []


def save_persons(data_folder, persons):
    persons_file = os.path.join(
        data_folder,
        "persons.json"
    )

    with open(
        persons_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            persons,
            file,
            indent=4
        )


def register_face(image_path, name, data_folder):
    try:
        representations = DeepFace.represent(
            img_path=image_path,
            model_name=MODEL_NAME,
            detector_backend="opencv",
            enforce_detection=True
        )

    except Exception as e:
        return {
            "success": False,
            "message": f"Could not detect face: {str(e)}"
        }

    if not representations:
        return {
            "success": False,
            "message": "No face detected."
        }

    if len(representations) > 1:
        return {
            "success": False,
            "message": (
                "More than one face was detected. "
                "Please register using an image containing only one person."
            )
        }

    embedding = representations[0]["embedding"]

    persons = load_persons(data_folder)

    # Prevent duplicate names
    for person in persons:
        if person["name"].lower() == name.lower():
            return {
                "success": False,
                "message": (
                    f"A person named '{name}' is already registered."
                )
            }

    faces_folder = os.path.join(
        data_folder,
        "faces"
    )

    os.makedirs(
        faces_folder,
        exist_ok=True
    )

    image = cv2.imread(image_path)

    if image is None:
        return {
            "success": False,
            "message": "Could not read uploaded image."
        }

    person_id = uuid.uuid4().hex

    image_filename = f"{person_id}.jpg"

    saved_image_path = os.path.join(
        faces_folder,
        image_filename
    )

    cv2.imwrite(
        saved_image_path,
        image
    )

    person = {
        "id": person_id,
        "name": name,
        "image": image_filename,
        "embedding": embedding
    }

    persons.append(person)

    save_persons(
        data_folder,
        persons
    )

    return {
        "success": True,
        "message": f"{name} registered successfully."
    }


def recognize_face(
    image_path,
    data_folder,
    output_path
):
    persons = load_persons(data_folder)

    if not persons:
        return {
            "success": False,
            "message": "No registered people found."
        }

    image = cv2.imread(image_path)

    if image is None:
        return {
            "success": False,
            "message": "Could not read uploaded image."
        }

    try:
        faces = DeepFace.extract_faces(
            img_path=image_path,
            detector_backend="opencv",
            enforce_detection=True,
            align=True
        )

    except Exception:
        cv2.imwrite(
            output_path,
            image
        )

        return {
            "success": True,
            "matches": [],
            "faces_detected": 0
        }

    matches = []

    image_height, image_width = image.shape[:2]

    for face_data in faces:
        area = face_data.get(
            "facial_area",
            {}
        )

        x = int(area.get("x", 0))
        y = int(area.get("y", 0))
        w = int(area.get("w", 0))
        h = int(area.get("h", 0))

        if w <= 0 or h <= 0:
            continue

        x = max(0, x)
        y = max(0, y)

        x2 = min(
            image_width,
            x + w
        )

        y2 = min(
            image_height,
            y + h
        )

        face_crop = image[
            y:y2,
            x:x2
        ]

        if face_crop.size == 0:
            continue

        try:
            representation = DeepFace.represent(
                img_path=face_crop,
                model_name=MODEL_NAME,
                detector_backend="skip",
                enforce_detection=False
            )

            if not representation:
                continue

            detected_embedding = np.array(
                representation[0]["embedding"],
                dtype=np.float32
            )

        except Exception:
            continue

        best_person = None
        best_score = 0

        # Compare detected face against
        # EVERY registered person.
        for person in persons:
            registered_embedding = np.array(
                person["embedding"],
                dtype=np.float32
            )

            similarity = cosine_similarity(
                registered_embedding,
                detected_embedding
            )

            score = similarity_to_percentage(
                similarity
            )

            if score > best_score:
                best_score = score
                best_person = person

        if (
            best_person is not None
            and best_score >= SIMILARITY_THRESHOLD
        ):
            name = best_person["name"]

            color = (0, 255, 0)

            label = (
                f"{name} - {best_score:.1f}%"
            )

            matches.append({
                "name": name,
                "score": best_score
            })

        else:
            color = (0, 0, 255)

            label = (
                f"Unknown - {best_score:.1f}%"
            )

        cv2.rectangle(
            image,
            (x, y),
            (x2, y2),
            color,
            3
        )

        text_y = y - 10

        if text_y < 20:
            text_y = y + 25

        cv2.putText(
            image,
            label,
            (x, text_y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            color,
            2,
            cv2.LINE_AA
        )

    cv2.imwrite(
        output_path,
        image
    )

    return {
        "success": True,
        "matches": matches,
        "faces_detected": len(faces)
    }