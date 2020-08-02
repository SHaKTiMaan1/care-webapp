import os, platform, sys, time
from datetime import date
import cv2
import numpy as np
import tensorflow as tf
from tqdm import tqdm
from collections import defaultdict
from faceblinkdetection.asm_eye_status import *
import face_recognition
import imutils
from imutils.video import VideoStream
import sqlite3
import winsound
import pickle

known_encodings = []
known_c_ids = []

conn = sqlite3.connect("child.db")
c = conn.cursor()
d = date.today().strftime('%d-%m-%Y')



def init():
    face_cascPath = 'faceblinkdetection/haarcascade_frontalface_alt.xml'
    open_eye_cascPath = 'faceblinkdetection/haarcascade_eye_tree_eyeglasses.xml'
    left_eye_cascPath = 'faceblinkdetection/haarcascade_lefteye_2splits.xml'
    right_eye_cascPath = 'faceblinkdetection/haarcascade_righteye_2splits.xml'
    dataset = 'build-face-dataset/faces'

    face_detector = cv2.CascadeClassifier(face_cascPath)
    open_eyes_detector = cv2.CascadeClassifier(open_eye_cascPath)
    left_eye_detector = cv2.CascadeClassifier(left_eye_cascPath)
    right_eye_detector = cv2.CascadeClassifier(right_eye_cascPath)

    # asama: modified to include input stream from a video file
    # run one of the following... input from video file or from integrated camera
    # 1. Either this - Integrated Camera
    source_resolution = (0, 0)
    
    print("[LOG] Opening webcam...")
    print("[LOG] Getting Camera Resolution...")
    # use this cv2.VideoCapture() just to get resolution of camera
    cam = cv2.VideoCapture(0)
    cam_width = int(cam.get(3))
    cam_height = int(cam.get(4))
    source_resolution = (cam_width, cam_height)
    print('Camera resolution (width, height) in pixels:', source_resolution)
    cam.release()  # immediately release camera after getting the resolution

    # switch to imutils VideoStream() for better bufferred frames' reading from camera
    # imutils VideoStream(), much faster
    video_capture = VideoStream(src=0).start()    
        
    model = load_model()

    
    return (model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, video_capture, source_resolution) 


# def process_and_encode(images):
#     # initialize the list of known encodings and known c_ids
#     known_encodings = []
#     known_C_ids = []
#     print("[LOG] Encoding faces...")

#     for image_path in tqdm(images):
#         # Load image
#         image = cv2.imread(image_path)

#         # Convert it from BGR to RGB
#         image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
     
#         # detect face in the image and get its location (square boxes coordinates)
#         boxes = face_recognition.face_locations(image, model='hog')

#         # Encode the face into a 128-d embeddings vector
#         encoding = face_recognition.face_encodings(image, boxes)

#         # the person's c_id is the name of the folder where the image comes from
#         name = image_path.split(os.path.sep)[-2]

#         if len(encoding) > 0 : 
#             known_encodings.append(encoding[0])
#             known_names.append(name)

        
        

#     return {"encodings": known_encodings, "names": known_names}



def isBlinking(history, maxFrames):
    """ @history: A string containing the history of eyes status 
         where a '1' means that the eyes were closed and '0' open.
        @maxFrames: The maximal number of successive frames where an eye is closed """
    for i in range(maxFrames):
        pattern = '1' + '0'*(i+1) + '1'
        if pattern in history:
            return True
    return False


def detect_and_display_at(model, video_capture, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, data, eyes_detected, source_resolution):
        #  ret, frame = video_capture.read() # OpenCV version, very slow
        frame = video_capture.read() # imutils VideoStream version, much faster

        # video frame resize        
#         # OpenCV version, very slow
#         if ret == True:
#             frame = cv2.resize(frame, (0, 0), fx=1.0, fy=1.0)
#             # frame = cv2.resize(frame, (0, 0), fx=0.6, fy=0.6)
#         else:
#             print('error reading - camera problem or file error?, exiting...')
#             return None

        # imutils VideoStream version for read buffering, much faster
        if frame is None:
            print('empty frame detected! - camera closed or end of file?, exiting...')
            return frame
        else:
            frame = cv2.resize(frame, (0, 0), fx=1.0, fy=1.0)
            # frame = cv2.resize(frame, (0, 0), fx=0.6, fy=0.

        frame = cv2.flip(frame, 1) # flip horizontal
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        faces = face_detector.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(50, 50),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        # for each detected face
        for (x,y,w,h) in faces:
            # Encode the face into a 128-d embeddings vector
            encoding = face_recognition.face_encodings(rgb, [(y, x+w, y+h, x)])[0]

            # Compare the vector with all known faces encodings
            matches = face_recognition.compare_faces(data["encodings"], encoding)

            # For now we don't know the person name
            c_id = "Unknown"

            # If there is at least one match:
            if True in matches:
                matchedIdxs = [i for (i, b) in enumerate(matches) if b]
                counts = {}
                for i in matchedIdxs:
                    c_id = data["c_ids"][i]
                    counts[c_id] = counts.get(c_id, 0) + 1

                # determine the recognized face with the largest number of votes
                c_id = max(counts, key=counts.get)

            face = frame[y:y+h,x:x+w]
            gray_face = gray[y:y+h,x:x+w]

            eyes = []
            
            # Eyes detection
            # check first if eyes are open (with glasses taking into account)
            open_eyes_glasses = open_eyes_detector.detectMultiScale(
                gray_face,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags = cv2.CASCADE_SCALE_IMAGE
            )
            # if open_eyes_glasses detect eyes then they are open 
            if len(open_eyes_glasses) == 2:
                eyes_detected[c_id]+='1'
                for (ex,ey,ew,eh) in open_eyes_glasses:
                    cv2.rectangle(face,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
            
            # otherwise try detecting eyes using left and right_eye_detector
            # which can detect open and closed eyes                
            else:
                # separate the face into left and right sides
                left_face = frame[y:y+h, x+int(w/2):x+w]
                left_face_gray = gray[y:y+h, x+int(w/2):x+w]

                right_face = frame[y:y+h, x:x+int(w/2)]
                right_face_gray = gray[y:y+h, x:x+int(w/2)]

                # Detect the left eye
                left_eye = left_eye_detector.detectMultiScale(
                    left_face_gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(30, 30),
                    flags = cv2.CASCADE_SCALE_IMAGE
                )

                # Detect the right eye
                right_eye = right_eye_detector.detectMultiScale(
                    right_face_gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(30, 30),
                    flags = cv2.CASCADE_SCALE_IMAGE
                )

                eye_status = '1' # we suppose the eyes are open

                # For each eye check wether the eye is closed.
                # If one is closed we conclude the eyes are closed
                for (ex,ey,ew,eh) in right_eye:
                    color = (0,255,0)
                    pred = predict(right_face[ey:ey+eh,ex:ex+ew],model)
                    if pred == 'closed':
                        eye_status='0'
                        color = (0,0,255)
                    cv2.rectangle(right_face,(ex,ey),(ex+ew,ey+eh),color,2)
                for (ex,ey,ew,eh) in left_eye:
                    color = (0,255,0)
                    pred = predict(left_face[ey:ey+eh,ex:ex+ew],model)
                    if pred == 'closed':
                        eye_status='0'
                        color = (0,0,255)
                    cv2.rectangle(left_face,(ex,ey),(ex+ew,ey+eh),color,2)
                eyes_detected[c_id] += eye_status

            # current date & time 
            
            c_datetime = str(d) + ' ' + time.strftime("%H:%M:%S")
            width = source_resolution[0]
            height = source_resolution[1]
            x_hdr = int(width * 0.01) # starting bottom_x is 1% of the width on the top left
            y_hdr = int(height * 0.1) # startgin bottom_y is 10% of the height on the top left
            cv2.putText(frame, c_datetime, (x_hdr, y_hdr), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)

            # location to put image overlay "blinking eye", maintaining 1% distance from top right x & y
            # blinking eyes image resolution to be displayed is 100x40 (width x height)
            x2_hdr = int(width - (.01 * width) - 100) # starting bottom_x     
            y2_hdr = int(height - (.99 * height)) # starting bottom_y  
            
            # Each time, we check if the person has blinked
            # If yes, we display its c_id
            if isBlinking(eyes_detected[c_id],3):
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                # Display c_id
                y = y - 15 if y - 15 > 15 else y + 15
                cv2.putText(frame, c_id, (x, y), cv2.FONT_HERSHEY_SIMPLEX,0.75, (0, 255, 0), 2)
                c.execute("SELECT C_ID FROM attendance WHERE DATE = '%s' " %d)
                flag = 0
                for row in c.fetchall():
                    if row[0] == c_id or c_id == "Unknown":
                        flag = 1
                if flag != 1 : 
                    c.execute(''' INSERT INTO attendance (DATE, C_ID, ATTEND) VALUES(?, ?, ?); ''', (d, c_id, "True"))
                    winsound.Beep(1000, 500)
                conn.commit()
        return frame




if __name__ == "__main__":
    print("[LOG] Initialization...")

    (model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, video_capture, images, source_resolution) = init()
    
    with open('dataset_faces.dat', 'rb') as f:
        known_encodings = pickle.load(f)
    with open('dataset_c_ids.dat', 'rb') as f:
	    known_c_ids = pickle.load(f)
    data = {"encodings" : known_encodings, "c_ids" : known_c_ids}
    
    
    # f = open("faceblinkdetection/encoding.txt", "w+")
    # f.write(str(data["encodings"]))
    # f.close()

    # overlay image (eye clipart) width: 100, height: 40
    img_overlay = cv2.imread('faceblinkdetection/data/icon_eye_100x40.png')
        
    eyes_detected = defaultdict(str)
    imshow_label = "Face Liveness Detector - Blinking Eyes (q-quit, p-pause)"
    print("[LOG] Detecting & Showing Images...")
    
    while True:
        frame = detect_and_display(model, video_capture, face_detector, open_eyes_detector,left_eye_detector,right_eye_detector, data, eyes_detected, source_resolution)
        if frame is None:
            break
        cv2.imshow(imshow_label, frame)
        
        # asama: modified to include p=pause
        key_pressed = cv2.waitKey(1)
        if key_pressed & 0xFF == ord('q'):
            break
        elif key_pressed & 0xFF == ord('p'): # p=pause
            cv2.waitKey(-1)

    ls1 = []
    ls2 = []

    c.execute("SELECT C_ID FROM details")
    for x in c.fetchall():
        ls1.append(x[0])

    c.execute("SELECT C_ID FROM attendance")
    for y in c.fetchall():
        ls2.append(y[0])

    for x in ls1:
        if x not in ls2:
            c.execute("INSERT INTO attendance (DATE,C_ID,ATTEND) VALUES (?, ?, ?)",(d, x, "False"))
    conn.commit()
    video_capture.stop()
    cv2.destroyAllWindows()
    print("[LOG] All done.")
    conn.close()


#  
