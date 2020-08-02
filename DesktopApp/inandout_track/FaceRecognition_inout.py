import os, platform, sys, time
import winsound
from datetime import datetime
import cv2
from PyQt5 import QtCore, QtGui, QtWidgets
import numpy as np
import tensorflow as tf
from PyQt5.QtWidgets import QMessageBox
from tqdm import tqdm
from collections import defaultdict
from inandout_track.asm_eye_status import *
import face_recognition
import pickle
from imutils.video import VideoStream
import sqlite3

''' Creating Table for In and out Tracking if not exist '''
conn = sqlite3.connect('child.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS in_and_out 
                   (     C_Id  VARCHAR(50) NOT NULL,
                         DATE_out VARCHAR(20) ,
                         TIME_out VARCHAR(20) ,
                         DATE_in VARCHAR(20) ,
                         TIME_in VARCHAR(20) 
                )''')

known_encodings = []
known_c_ids = []


def messagebox(title, message):
    mess = QtWidgets.QMessageBox()
    mess.setWindowTitle(title)
    mess.setText(message)
    mess.setStandardButtons(QtWidgets.QMessageBox.Ok)
    mess.exec()


#def addindataset():
    #msg = QMessageBox()
    #msg.setIcon(QMessageBox.Information)

    #msg.setText("Person is identified by the camera.")
    #msg.setInformativeText("Want to add in database or not ?")
    #msg.setWindowTitle("Permission to Add")
    #msg.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
    #msg.buttonClicked.connect(msgbtn)
    #retval = msg.exec_()


#def msgbtn(i):
    #global option
    #option = i.text()


def init():
    face_cascPath = 'haarcascade_frontalface_alt.xml'
    open_eye_cascPath = 'haarcascade_eye_tree_eyeglasses.xml'
    left_eye_cascPath = 'haarcascade_lefteye_2splits.xml'
    right_eye_cascPath = 'haarcascade_righteye_2splits.xml'
    dataset = 'build-face-dataset/faces'  # 'build-face-dataset/faces'

    face_detector = cv2.CascadeClassifier(face_cascPath)
    open_eyes_detector = cv2.CascadeClassifier(open_eye_cascPath)
    left_eye_detector = cv2.CascadeClassifier(left_eye_cascPath)
    right_eye_detector = cv2.CascadeClassifier(right_eye_cascPath)

    # asama: modified to include input stream from a video file
    # run one of the following... input from video file or from integrated camera
    # 1. Either this - Integrated Camera
    source_resolution = (0, 0)
    
    print("Opening webcam...")
    print("Getting Camera Resolution...")
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

    


    return (model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, video_capture,
            source_resolution)



#def process_and_encode(images):
    # initialize the list of known encodings and known names
    #known_encodings = []
    #known_c_ids = []
    #print("[LOG] Encoding faces...")

   # for image_path in tqdm(images):
        # Load image
    #    image = cv2.imread(image_path)

        # Convert it from BGR to RGB
    #    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
     
        # detect face in the image and get its location (square boxes coordinates)
    #    boxes = face_recognition.face_locations(image, model='hog')

        # Encode the face into a 128-d embeddings vector
    #    encoding = face_recognition.face_encodings(image, boxes)

        # the person's name is the name of the folder where the image comes from
     #   c_id = image_path.split(os.path.sep)[-2]

     #   if len(encoding) > 0:
     #       known_encodings.append(encoding[0])
     #       known_c_ids.append(c_id)
    #print("Encoding done")
    #print(known_encodings)
    #print(known_c_ids)
    #return {"encodings": known_encodings, "c_ids": known_c_ids}


def isBlinking(history, maxFrames):
    """ @history: A string containing the history of eyes status 
         where a '1' means that the eyes were closed and '0' open.
        @maxFrames: The maximal number of successive frames where an eye is closed """
    for i in range(maxFrames):
        pattern = '1' + '0'*(i+1) + '1'
        if pattern in history:
            return True
    return False


def markinandout(c_id):
    now = datetime.now()
    date_now = now.strftime('%d-%m-%Y')
    time_now = now.strftime('%H:%M:%S')
    flag = 0
    c.execute('''SELECT C_Id, Time_in FROM in_and_out WHERE Time_in IS NULL''')
    for row in c.fetchall():
        if row[0] == c_id:
            flag = 1
    if flag == 1:
        c.execute('''UPDATE in_and_out SET DATE_in = ?, TIME_in = ?WHERE C_Id = ? and Time_in IS NULL ''',
                                    (date_now, time_now, c_id))

    if flag == 0:
        c.execute('''INSERT INTO in_and_out (C_Id, DATE_out, TIME_out) VALUES(?,?,?) ''', (c_id, date_now, time_now))

    winsound.Beep(1000, 500)
    conn.commit()
    cv2.waitKey(10000)



def detect_and_display_io(model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector,
                                video_capture, data, eyes_detected, source_resolution):

        frame = video_capture.read()

        if frame is None:
            print('Empty frame detected! - camera closed or end of file?, exiting...')
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
        for (x, y, w, h) in faces:
            # Encode the face into a 128-d embeddings vector
            encoding = face_recognition.face_encodings(rgb, [(y, x+w, y+h, x)])[0]

            # Compare the vector with all known faces encodings
            matches = face_recognition.compare_faces(data["encodings"], encoding)

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



            face = frame[y:y+h, x:x+w]
            gray_face = gray[y:y+h, x:x+w]

            eyes = []

            # Eyes detection
            # check first if eyes are open (with glasses taking into account)
            open_eyes_glasses = open_eyes_detector.detectMultiScale(
                gray_face,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            # if open_eyes_glasses detect eyes then they are open 
            if len(open_eyes_glasses) == 2:
                eyes_detected[c_id] += '1'
                for (ex, ey, ew, eh) in open_eyes_glasses:
                    cv2.rectangle(face,(ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)
            
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
                    flags=cv2.CASCADE_SCALE_IMAGE
                )

                # Detect the right eye
                right_eye = right_eye_detector.detectMultiScale(
                    right_face_gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(30, 30),
                    flags=cv2.CASCADE_SCALE_IMAGE
                )

                eye_status = '1' # we suppose the eyes are open

                # For each eye check wether the eye is closed.
                # If one is closed we conclude the eyes are closed
                for (ex, ey, ew, eh) in right_eye:
                    color = (0, 255, 0)
                    pred = predict(right_face[ey:ey+eh, ex:ex+ew], model)
                    if pred == 'closed':
                        eye_status='0'
                        color = (0, 0, 255)
                    cv2.rectangle(right_face, (ex, ey), (ex+ew, ey+eh),color,2)
                for (ex, ey, ew, eh) in left_eye:
                    color = (0, 255, 0)
                    pred = predict(left_face[ey:ey+eh, ex:ex+ew], model)
                    if pred == 'closed':
                        eye_status='0'
                        color = (0, 0, 255)
                    cv2.rectangle(left_face, (ex, ey), (ex+ew, ey+eh), color, 2)
                eyes_detected[c_id] += eye_status

            # current date & time 
            d = datetime.today().strftime('%d-%m-%Y')
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
            # If yes, we display its name
            if isBlinking(eyes_detected[c_id], 3):
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                # Display c_id
                y = y - 15 if y - 15 > 15 else y + 15
                cv2.putText(frame, c_id, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
                if c_id != "Unknown":
                    #addindataset()
                    #if option == 'Ok':
                        markinandout(c_id)
                    #else:
                        #print("In and out not marked")

                else:
                    print("Unknown person seen")
                    messagebox("Unknown Person Scanned", "Unknown person scanned by the camera.")

        return frame


if __name__ == "__main__":
    print("Initialization...")

    (model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, video_capture, images,
     source_resolution) = init()

    with open('dataset_faces.dat', 'rb') as f:
        known_encodings = pickle.load(f)
    with open('dataset_c_ids.dat', 'rb') as f:
        known_c_ids = pickle.load(f)
    data = {"encodings": known_encodings, "c_ids": known_c_ids}

   # data = process_and_encode(images)
    img_overlay = cv2.imread('data/icon_eye_100x40.png')
    eyes_detected = defaultdict(str)

    while True:
        frame = detect_and_display(model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector,
                                   video_capture, images, source_resolution)
        if frame is None:
            break

        cv2.imshow("In And Out Tracking", frame)
        cv2.waitKey(1)
