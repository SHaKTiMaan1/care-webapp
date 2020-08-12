import sqlite3
from datetime import date
import pymongo
import socket
import time
import sys
import os
import requests
from PyQt5.QtCore import QCoreApplication,QRunnable,QObject,QThread,QThreadPool,pyqtSignal,pyqtSlot
from PyQt5.QtCore import pyqtSlot as pyQtSlot
from main import *

from ui_functions2 import *
from login_final import *
 
class syncall(QObject):
    finished = pyqtSignal() 
    ready = pyqtSignal(int)

@pyQtSlot()

def sync():                   # Thread
    co = syncall()
    #co.ready.connect(UIFunctions.startsync)
    # Getting CCI ID through file
    f = open("DesktopApp/CCI.txt", "r")
    lines = list(f)
    cci_id = lines[0].rstrip("\n")
    f.close()

    # Getting system date
    d = date.today().strftime('%d-%m-%Y')

    # Connecting to sqlite database
    conn = sqlite3.connect('child.db')
    c = conn.cursor()

    # List which stores data to be synced
    l = []

    # COLLECTING DATA FOR ATTENDACE SYNCING
    # selecting dates whose attendance has not been synced putting  all the info in a list containing objects
    c.execute('''SELECT DISTINCT DATE FROM attendance WHERE SYNCED = 'False' AND DATE != '%s'  ''' % d)
    temp_ls = c.fetchall()
    for row in temp_ls:
        working_date = row[0]
        ls = []
        c.execute(''' SELECT DATE, C_ID, FNAME, LNAME, ATTEND
                            FROM attendance 
                            NATURAL JOIN details 
                            WHERE SYNCED = 'False' AND DATE != '%s'  ''' % d)
        for row in c.fetchall():
            if row[0] == working_date:
                if row[4] == "True":
                    present = True
                else:
                    present = False
                child_obj = {
                    "child_id": row[1],
                    "firstName": row[2],
                    "lastName": row[3],
                    "present": present,
                    #"reasonofAbsence": row[5]
                }
                ls.append(child_obj)
        # The list ls is completed till here
        attendance_obj = {
            "date": working_date,
            "data": ls
        }
        l.append(attendance_obj)
        # Here l stores all the objects to be pushed into the mongodb atlas

    # COLLECTING DATA FOR IN_AND_OUT SYNC
    c.execute(
        '''SELECT C_ID, DATE_OUT, TIME_OUT, DATE_IN, TIME_IN FROM in_and_out WHERE  TIME_IN IS NOT NULL''')
    l_in_out = []
    for row in c.fetchall():
        obj = {
            "child_id": row[0],
            "date_out": row[1],
            "time_out": row[2],
            "date_in": row[3],
            "time_in": row[4]
        }
        l_in_out.append(obj)
    conn = sqlite3.connect("child.db")
    c = conn.cursor()

    while True:
        IPaddress = socket.gethostbyname(socket.gethostname())
        if IPaddress != "127.0.0.1":
            #ATTENDANCE AND INOUT SYNC PART
            if(len(l) > 0 or len(l_in_out) > 0):
                dataobj = {
                    "attendance" : l,
                    "inOutMovement" : l_in_out
                }
                c.execute('''SELECT EMAIL, TOKEN FROM users''')
                row = c.fetchone()
                email = row[0]
                token = row[1]
                
                
                url = "https://care-shaktimaan.herokuapp.com/postAttendance/{}".format(email)

                response = requests.post(url, json=dataobj, headers={"Content-Type": "application/json",
                                                    "Authorization": "Bearer {}".format(token)}, timeout=20)
                    
                if response.status_code == 200:
                        c.execute(" UPDATE attendance SET SYNCED = 'True' WHERE DATE != ? ", (d, ))
                        c.execute(
                            " UPDATE in_and_out SET SYNCED = 'True' WHERE TIME_IN IS NOT NULL AND DATE_IN != ?", (d, ))
                elif response.status_code == 403 or response.status_code == 401:
                    form = Form()
                    form.show()
                    window.hide()
                
                l.clear()
                l_in_out.clear()
                conn.commit()

            
            # #IN_OUT SYNC
            # if(len(l_in_out) > 0):
            #     for obj in l_in_out:
            #         x = requests.post(url, data=obj,  header={
            #                           "content-type": "application/x-www-form-urlencoded"})
            #         if x.status_code == 200:
            #             c.execute(" UPDATE in_and_out SET SYNCED = 'True' WHERE TIME_IN = ?", (obj["time_in"]))
            #     l_in_out.clear()
            #     conn.commit()



            # #MESSAGE SYNC PART

            # #Getting last time when we cci received message from cwc
            # f = open("last_time.txt", "r")
            # lines = list(f)
            # t = lines[0].rstrip("\n")
            # t = float(t)  # in milliseconds
            # f.close()
            # col = db["messages"]
            # query = {"cci_id": f"{cci_id}"}
            
            
            # #UP to DOWN messages i.e CWC to CCI
            # doc = col.find_one(query, {"_id": 0, "__v": 0})
            # messages = doc["Messages"]
            # for message in reversed(messages):
            #     if(message["sender"] == "cwc" and t < message["time"]):
            #         c.execute('''INSERT INTO messages VALUES(
            #                     ?, ?, ?)''', (message["message"], message["sender"], message["time"]))
            #         t = message["time"]
            
            # #Saving changes to dbs
            # conn.commit()
            # #Update new time in milliseconds
            # f = open("last_time.txt", "w+")
            # f.write(str(t))
            # f.close()


            # #DOWN to UP messages i.e CCI to CWC

            # #Getting last time when message was received by CWC from CCI
            # for message in reversed(messages):
            #     if(message["sender"] == "cci"):
            #         local_latest_time = message["time"]
            #         break

            # c.execute('''SELECT * FROM messages WHERE SENDER = "cci" ''')
            # for row in c.fetchall():
            #     if(row[2] > local_latest_time):
            #         obj = {
            #             "time": row[2],
            #             "sender": row[1],
            #             "message": row[0]}
            #         result = col.find_one_and_update(query, {'$push': {"Messages": obj}})


        else:
            time.sleep(20)
        time.sleep(20)
        print("Running")
        co.finished.emit()

    
    
    

        
            
