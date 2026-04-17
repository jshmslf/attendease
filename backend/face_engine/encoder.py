import face_recognition
import os
import pickle

DATASET_PATH = "face_engine/dataset"
ENCODINGS_FILE = "face_engine/encodings.pkl"

def encode_dataset():
    encodings = []
    names = []

    for person in os.listdir(DATASET_PATH):
        person_path = os.path.join(DATASET_PATH, person)

        if not os.path.isdir(person_path):
            continue

        for img in os.listdir(person_path):
            img_path = os.path.join(person_path, img)

            image = face_recognition.load_image_file(img_path)
            enc = face_recognition.face_encodings(image)

            if enc:
                encodings.append(enc[0])
                names.append(person)

    data = {
        "encodings": encodings,
        "names": names
    }

    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump(data, f)

    print("✅ Encodings updated")
    
    
if __name__ == "__main__":
    encode_dataset()