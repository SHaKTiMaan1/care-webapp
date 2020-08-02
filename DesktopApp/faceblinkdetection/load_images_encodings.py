from tqdm import tqdm
import os
import cv2
import face_recognition
dataset = 'build-face-dataset/faces'
images = []
for direc, _, files in tqdm(os.walk(dataset)):
    for file in files:
        if file.endswith("png"):
            images.append(os.path.join(direc, file))


def process_and_encode(images):
    # initialize the list of known encodings and known names
    known_encodings = []
    known_names = []
    print("[LOG] Encoding faces...")

    for image_path in tqdm(images):
        # Load image
        image = cv2.imread(image_path)

        # Convert it from BGR to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # detect face in the image and get its location (square boxes coordinates)
        boxes = face_recognition.face_locations(image, model='hog')

        # Encode the face into a 128-d embeddings vector
        encoding = face_recognition.face_encodings(image, boxes)

        # the person's name is the name of the folder where the image comes from
        name = image_path.split(os.path.sep)[-2]

        if len(encoding) > 0:
            known_encodings.append(encoding[0])
            known_names.append(name)

    return {"encodings": known_encodings, "names": known_names}

    

data = process_and_encode(images)
f = open("encoding.txt", "w+")
f.write(str(data["encodings"]))
f = open("encoding_name.txt", "w+")
f.write(str(data["names"]))
f.close()
