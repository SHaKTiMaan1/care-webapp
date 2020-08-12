from imutils.video import VideoStream
import imutils
import time
import cv2
import os
import sqlite3
import face_recognition
import pickle
from datetime import datetime
from inandout_track.FaceRecognition_inout import *
from faceblinkdetection.FaceRecognition_attendance import *

## ==> GUI FILE
from main import *
from message_ui import *

class Functions():
    global running

    def showmessages(self):
        self.dai = QtWidgets.QWidget()
        self.ui2 = Ui_Form()
        self.ui2.setupUi(self.dai)
        conn = sqlite3.connect('child.db')
        c = conn.cursor()

        self.ui2.pushButton.clicked.connect(lambda:Functions.message(self))
        
        result = c.execute('''SELECT * FROM messages ORDER BY TIME ASC''')
        self.ui2.tableWidget.setRowCount(0)
        for row_number, row_data in enumerate(result):
            self.ui2.tableWidget.insertRow(row_number)
            for column_number, data in enumerate(row_data):
                self.ui2.tableWidget.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))

        conn.commit()

        self.dai.show()
        conn.close()
    
    def message(self):
        conn = sqlite3.connect('child.db')
        c = conn.cursor()
        msg = self.ui2.textEdit.toPlainText()
        self.ui2.textEdit.clear()
        c.execute('''INSERT INTO messages VALUES (?, ?, ?)''', (msg, "cci", time.time()*1000))
        result = c.execute('''SELECT * FROM messages ORDER BY TIME ASC''')
        self.ui2.tableWidget.setRowCount(0)
        for row_number, row_data in enumerate(result):
            self.ui2.tableWidget.insertRow(row_number)
            for column_number, data in enumerate(row_data):
                self.ui2.tableWidget.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))

        conn.commit()
        conn.close()

    
    def dataset(self):
        
        widget = self.sender()         
        conn = sqlite3.connect("child.db")
        c = conn.cursor()
        c.execute(''' SELECT C_ID FROM details WHERE SET_EXIST IS NULL ''')
        val = c.fetchall()
        for row in val:
            if widget.objectName() == row[0]:
                c_id = row[0]
                break
        path = os.path.join("DesktopApp/build-face-dataset/faces", c_id)
        os.mkdir(path)

        # load OpenCV's Haar cascade for face detection from disk
        face_cascade = cv2.CascadeClassifier(
            "DesktopApp/build-face-dataset/haarcascade_frontalface_default.xml")

        eye_cascade = cv2.CascadeClassifier(
            "DesktopApp/build-face-dataset/haarcascade_eye.xml")

	    # initialize the video stream, allow the camera sensor to warm up,
	    # and initialize the total number of example faces written to disk
	    # thus far
        print("[INFO] starting video stream...")
        vs = VideoStream(src=0).start()
        total = 0

	    # loop over the frames from the video stream
        while True:
		    # grab the frame from the threaded video stream, clone it, (just
		    #in case we want to write it to disk), and then resize the frame
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
        conn.close()




    ''' To check in and out detail datewise'''
    def inandout(self):
        vr_date = self.ui.dateEdit_4.date()
        vr1_date = vr_date.toPyDate()
        picked_date = vr1_date.strftime('%d-%m-%Y')
        conn = sqlite3.connect('child.db')
        c = conn.cursor()
        query = '''SELECT C_Id, DATE_out, TIME_out, DATE_in, TIME_in  FROM in_and_out WHERE DATE_out =?'''
        result = c.execute(query, (picked_date, ))
        self.ui.tableWidget_4.setRowCount(0)
        for row_number, row_data in enumerate(result):
            self.ui.tableWidget_4.insertRow(row_number)
            for column_number, data in enumerate(row_data):
                self.ui.tableWidget_4.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))

        conn.close()

    ''' To display the in and out detail of current day'''
    ###################################################################################################
    def inandouttoday(self):
        conn = sqlite3.connect('child.db')  # Replace it to child.db
        c = conn.cursor()
        now = datetime.now()
        today_date = now.strftime('%d-%m-%Y')
            # give the loop a stoppable condition
        (model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, video_capture,
            source_resolution) = init()

        with open('dataset_faces.dat', 'rb') as f:
            known_encodings = pickle.load(f)
        with open('dataset_c_ids.dat', 'rb') as f:
            known_c_ids = pickle.load(f)
        data = {"encodings": known_encodings, "c_ids": known_c_ids}

        # data = process_and_encode(images)
        eyes_detected = defaultdict(str)

        while True:
            frame = detect_and_display_io(model, face_detector, open_eyes_detector, left_eye_detector,right_eye_detector,video_capture, data, eyes_detected, source_resolution)
            if frame is None:
                break

            cv2.imshow("In And Out Tracking", frame)
            key_pressed = cv2.waitKey(1)
            if key_pressed & 0xFF == ord('q'):
                break
        cv2.destroyAllWindows()
        query = (
            '''SELECT C_Id, DATE_out, TIME_out, DATE_in, TIME_in  FROM in_and_out WHERE DATE_out =?''')
        result = c.execute(query, (today_date,))
        self.ui.tableWidget_3.setRowCount(0)
        for row_number, row_data in enumerate(result):
            self.ui.tableWidget_3.insertRow(row_number)
            for column_number, data in enumerate(row_data):
                self.ui.tableWidget_3.setItem(row_number, column_number,
                                            QtWidgets.QTableWidgetItem(str(data)))

     ########################################################################################################################

    ''' Message box to save attendance and stopping the process of taking attendance'''

    def attendancestopped(self):
        running = False
        mess = QtWidgets.QMessageBox()
        mess.setWindowTitle("Attendance Saved")
        mess.setText("Today Attendance is saved.")
        mess.setStandardButtons(QtWidgets.QMessageBox.Ok)
        mess.exec()

    ''' Message box to save in/out and stopping the process of taking in/out'''

    def inandoutstopped(self):
        mess = QtWidgets.QMessageBox()
        mess.setWindowTitle("IN/OUT Saved")
        mess.setText("Today IN/OUT is saved.")
        mess.setStandardButtons(QtWidgets.QMessageBox.Ok)
        mess.exec()

    ''' To display the attendance of picked date'''

    def showattendancedetail(self):
        vr_date = self.ui.dateEdit_5.date()
        vr1_date = vr_date.toPyDate()
        picked_date = vr1_date.strftime('%d-%m-%Y')
        conn = sqlite3.connect('child.db')
        c = conn.cursor()
        query = '''Select  C_ID, FNAME, LNAME, Attend FROM attendance NATURAL JOIN  details WHERE DATE =?'''
        result = c.execute(query, (picked_date,))
        self.ui.tableWidget_6.setRowCount(0)
        for row_number, row_data in enumerate(result):
            self.ui.tableWidget_6.insertRow(row_number)
            for column_number, data in enumerate(row_data):
                self.ui.tableWidget_6.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))
        conn.close()

    #####################################################################################################
    def takeattendance(self):
        conn = sqlite3.connect('child.db')  # Replace it to child.db
        c = conn.cursor()
        now = datetime.now()
        today_date = now.strftime('%d-%m-%Y')
        running = True
        while running:
            (model, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, video_capture,
             source_resolution) = init()

            with open('dataset_faces.dat', 'rb') as f:
                known_encodings = pickle.load(f)
            with open('dataset_c_ids.dat', 'rb') as f:
                known_c_ids = pickle.load(f)
            data = {"encodings": known_encodings, "c_ids": known_c_ids}

            # f = open("faceblinkdetection/encoding.txt", "w+")
            # f.write(str(data["encodings"]))
            # f.close()

            eyes_detected = defaultdict(str)
            imshow_label = "Face Liveness Detector - Blinking Eyes (q-quit, p-pause)"
            print("[LOG] Detecting & Showing Images...")

            while True:
                frame = detect_and_display_at(model, video_capture, face_detector, open_eyes_detector, left_eye_detector,
                                           right_eye_detector, data, eyes_detected, source_resolution)
                if frame is None:
                    break
                cv2.imshow(imshow_label, frame)

                # asama: modified to include p=pause
                key_pressed = cv2.waitKey(1)
                if key_pressed & 0xFF == ord('q'):
                    break
                elif key_pressed & 0xFF == ord('p'):  # p=pause
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
                    c.execute("INSERT INTO attendance (DATE,C_ID,ATTEND) VALUES (?, ?, ?)", (d, x, "False"))
            conn.commit()
            running = False
            video_capture.stop()
            cv2.destroyAllWindows()
            print("[LOG] All done.")
     
        result = c.execute('''Select  C_ID, FNAME, LNAME, Attend FROM attendance NATURAL JOIN  details WHERE DATE ="%s"'''%today_date)
        self.ui.tableWidget_6.setRowCount(0)
        for row_number, row_data in enumerate(result):
            self.ui.tableWidget_6.insertRow(row_number)
            for column_number, data in enumerate(row_data):
                self.ui.tableWidget_6.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))
        conn.close()
    ###################################################################################################################



