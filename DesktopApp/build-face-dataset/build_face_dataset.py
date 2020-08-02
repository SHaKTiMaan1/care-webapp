# import the necessary packages
from imutils.video import VideoStream
import imutils
import time
import cv2
import os
import sqlite3
import pickle
import face_recognition
ch = "Y"
known_encodings = []
known_c_ids = []
while (ch == "Y") or (ch == "y"):
	conn = sqlite3.connect("child.db")
	c = conn.cursor()
	c.execute(''' SELECT rowid ,C_ID FROM details WHERE SET_EXIST = "False" ''')
	for row in c.fetchall():
		print(row)
	val = int(input().strip())
	c.execute(''' SELECT rowid ,C_ID FROM details WHERE SET_EXIST = "False" ''')
	for row in c.fetchall():
		if val == row[0]:
			c_id = row[1]
			break
	path = os.path.join("build-face-dataset/faces", c_id)
	os.mkdir(path)

	# load OpenCV's Haar cascade for face detection from disk
	face_cascade = cv2.CascadeClassifier(
		"build-face-dataset/haarcascade_frontalface_default.xml")

	eye_cascade = cv2.CascadeClassifier("build-face-dataset/haarcascade_eye.xml"	)

	# initialize the video stream, allow the camera sensor to warm up,
	# and initialize the total number of example faces written to disk
	# thus far
	print("[INFO] starting video stream...")
	vs = VideoStream(src=0).start()
	total = 0

	# loop over the frames from the video stream
	while True:
		# grab the frame from the threaded video stream, clone it, (just
		# in case we want to write it to disk), and then resize the frame
		# so we can apply face detection faster
		frame = vs.read()
		orig = frame.copy()
		frame = imutils.resize(frame, width=400)

		# detect faces in the grayscale frame
		gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
		faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1,minNeighbors=15, minSize=(30, 30))

		# loop over the face detections and draw them on the frame
		for (x, y, w, h) in faces:
			cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
			roi_gray = gray[y:y+h, x:x+w]
			roi_color = frame[y:y+h, x:x+w]

			# Detects eyes of different sizes in the input image
			eyes = eye_cascade.detectMultiScale(roi_gray)

			#To draw a rectangle in eyes
			for (ex, ey, ew, eh) in eyes:
				cv2.rectangle(roi_color, (ex, ey),
							(ex+ew, ey+eh), (0, 127, 255), 2)

		# show the output frame
		frame = cv2.flip(frame,1)
		cv2.imshow("Frame", frame)
		key = cv2.waitKey(1) & 0xFF

		# if the `k` key was pressed, write the *original* frame to disk
		# so we can later process it and use it for face recognition
		if key == ord("k"):
			p = os.path.sep.join([path, "{}.png".format(str(total).zfill(5))])
			cv2.imwrite(p, orig)
			total += 1

		elif total == 10:
			break
	c.execute("UPDATE details SET SET_EXIST = 'True' WHERE C_ID = '%s'" % c_id)
	# do a bit of cleanup
	print("[INFO] {} face images stored".format(total))
	print("[INFO] cleaning up...")

	print("[LOG] Encoding images")
	for image_path in os.listdir(path):
		image = cv2.imread(os.path.join(path,image_path))
		image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
		boxes = face_recognition.face_locations(image, model='hog')
		encoding = face_recognition.face_encodings(image, boxes)
		if len(encoding) > 0:
			with open('dataset_faces.dat', 'rb') as f:
				known_encodings = pickle.load(f)
				known_encodings.append(encoding[0])

			with open('dataset_faces.dat', 'wb') as f:
				pickle.dump(known_encodings, f)

			with open('dataset_c_ids.dat', 'rb') as f:
				known_c_ids = pickle.load(f)
				known_c_ids.append(c_id)

			with open('dataset_c_ids.dat', 'wb') as f:
				pickle.dump(known_c_ids, f)

	cv2.destroyAllWindows()
	vs.stop()
	conn.commit()
	print("Wanna add more? Press Y/y. Press any other key to stop")
	ch = input().strip()       

conn.close()
