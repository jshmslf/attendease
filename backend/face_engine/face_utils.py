import face_recognition
import os
import numpy as np
from io import BytesIO
from PIL import Image

DATASET_PATH = "face_engine/dataset"

def add_face_from_image(name, image_bytes):
    person_folder = os.path.join(DATASET_PATH, name)
    os.makedirs(person_folder, exist_ok=True)

    image = Image.open(BytesIO(image_bytes))
    image_path = os.path.join(person_folder, f"{len(os.listdir(person_folder)) + 1}.jpg")
    image.save(image_path)

    print(f"📸 Saved image for {name}")


def load_encodings():
    import pickle

    with open("face_engine/encodings.pkl", "rb") as f:
        return pickle.load(f)