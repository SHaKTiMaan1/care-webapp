        ################################################################################
##
##
#############################################################################
import sqlite3
import sys
import threading
import os

from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtWidgets import QMainWindow,QApplication,QPushButton,QSizePolicy,QGraphicsDropShadowEffect,QSizeGrip
from PyQt5.QtCore import QCoreApplication, QPropertyAnimation, QDate, QDateTime, QMetaObject, QObject, QPoint, QRect, QSize, QTime, QUrl, Qt, QEvent
from PyQt5.QtGui import QBrush, QColor, QConicalGradient, QCursor, QFont, QFontDatabase, QIcon, QKeySequence, QLinearGradient, QPalette, QPainter, QPixmap, QRadialGradient
from PyQt5 import *

# GUI FILE
from version2new import Ui_MainWindow2

# IMPORT QSS CUSTOM
from ui_styles import Style

# IMPORT FUNCTIONS
from ui_functions2 import *

from message_ui import *
from main_sync import *

class MainWindow(QMainWindow):
    def __init__(self):
        QMainWindow.__init__(self)
        self.ui = Ui_MainWindow2()
        self.ui.setupUi(self)
        self.startTheThread()
        ## PRINT ==> SYSTEM
        #print('System: ' + platform.system())
        #print('Version: ' +platform.release())

        ########################################################################
        ## START - WINDOW ATTRIBUTES
        ########################################################################

        ## REMOVE ==> STANDARD TITLE BAR
        UIFunctions.removeTitleBar(True)
        ## ==> END ##

        ## SET ==> WINDOW TITLE
        self.setWindowTitle('CARE Desktop')
        UIFunctions.labelTitle(self, 'CARE')
        UIFunctions.labelDescription(self, 'CARE')
        ## ==> END ##

        ## REMOVE ==> STANDARD TITLE BAR
        startSize = QSize(1000, 720)
        self.resize(startSize)
        self.setMinimumSize(startSize)
        #UIFunctions.enableMaximumSize(self, 500, 720)
        ## ==> END ##


        ## ==> ADD CUSTOM MENUS
        UIFunctions.addNewMenu(self, "Home", "home_button", "url(:/20x20/icons/20x20/cil-home.png)", True)
        UIFunctions.addNewMenu(self, "Add Dataset", "add_dataset_button", "url(:/20x20/icons/20x20/cil-user-follow.png)", True)
        UIFunctions.addNewMenu(self, "Attendance", "attendance_button", "url(:/20x20/icons/cli-attend.png)", True)
        UIFunctions.addNewMenu(self, "In and Out Movement", "in_out_button", "url(:/16x16/icons/16x16/cil-transfer.png)", True)
        UIFunctions.addNewMenu(self, "Detail", "detail_button", "url(:/20x20/icons/20x20/cil-description.png)", True)
        
        ## ==> END ##

        # START MENU => SELECTION
        UIFunctions.selectStandardMenu(self, "home_button")
        ## ==> END ##

        ## ==> START PAGE
        self.ui.stackedWidget.setCurrentWidget(self.ui.home)
        ## ==> END ##


        ## ==> MOVE WINDOW / MAXIMIZE / RESTORE
        ########################################################################
        def moveWindow(event):
            # IF MAXIMIZED CHANGE TO NORMAL
            if UIFunctions.returStatus() == 1:
                UIFunctions.maximize_restore(self)

            # MOVE WINDOW
            if event.buttons() == Qt.LeftButton:
                self.move(self.pos() + event.globalPos() - self.dragPos)
                self.dragPos = event.globalPos()
                event.accept()

        # WIDGET TO MOVE
        self.ui.frame_label_top_btns.mouseMoveEvent = moveWindow
        ## ==> END ##
        self.ui.pushButton.clicked.connect(lambda:Functions.showmessages(self))

        ## ==> LOAD DEFINITIONS
        ########################################################################
        UIFunctions.uiDefinitions(self)
        ## ==> END ##

        ########################################################################
        ## END - WINDOW ATTRIBUTES
        ############################## ---/--/--- ##############################
      
      
        ## SHOW ==> MAIN WINDOW
        ########################################################################
        self.show()
        ## ==> END ##


    def startTheThread(self):
        # Create the new thread. The target function is 'myThread'. The
        # function we created in the beginning.
        t = threading.Thread(name='myThread', target=sync)
        t.start()

    ########################################################################
    ## MENUS ==> DYNAMIC MENUS FUNCTIONS
    ########################################################################
    def Button(self):
        # GET BT CLICKED
        btnWidget = self.sender()

        # PAGE HOME
        if btnWidget.objectName() == "home_button":
            self.ui.stackedWidget.setCurrentWidget(self.ui.home)
            UIFunctions.resetStyle(self, "home_button")
            UIFunctions.labelPage(self, "Home")
            btnWidget.setStyleSheet(UIFunctions.selectMenu(btnWidget.styleSheet()))

        # PAGE NEW USER
        if btnWidget.objectName() == "add_dataset_button":
            self.ui.stackedWidget.setCurrentWidget(self.ui.add_dataset)
            UIFunctions.resetStyle(self, "add_dataset_button")
            UIFunctions.labelPage(self, "Add Dataset")
            btnWidget.setStyleSheet(UIFunctions.selectMenu(btnWidget.styleSheet()))
            known_encodings = []
            known_c_ids = []
            conn = sqlite3.connect("child.db")
            c = conn.cursor()
            result = c.execute(''' SELECT C_ID FROM details WHERE SET_EXIST IS NULL ''')
            self.ui.tableWidget_2.setRowCount(0)

            for row_number , row_data in enumerate(result):
                self.ui.tableWidget_2.insertRow(row_number)
                ls = row_data[0]
                for column_number , data in enumerate(row_data): 
                    self.ui.tableWidget_2.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))
                    self.btn_cell = QPushButton("+")
                    self.btn_cell.setObjectName(ls)
                    self.btn_cell.clicked.connect(lambda:Functions.dataset(self))
                    self.ui.tableWidget_2.setCellWidget(row_number,column_number+1,self.btn_cell)

        # PAGE WIDGETS
        if btnWidget.objectName() == "attendance_button":
            self.ui.stackedWidget.setCurrentWidget(self.ui.attendance)
            UIFunctions.resetStyle(self, "attendance_button")
            UIFunctions.labelPage(self, "Attendance")
            btnWidget.setStyleSheet(UIFunctions.selectMenu(btnWidget.styleSheet()))

        if btnWidget.objectName() == "in_out_button":
            self.ui.stackedWidget.setCurrentWidget(self.ui.in_out)
            UIFunctions.resetStyle(self, "in_out_button")
            UIFunctions.labelPage(self, "In and Out")
            btnWidget.setStyleSheet(UIFunctions.selectMenu(btnWidget.styleSheet()))

        if btnWidget.objectName() == "detail_button":
            self.ui.stackedWidget.setCurrentWidget(self.ui.detail)
            UIFunctions.resetStyle(self, "detail_button")
            UIFunctions.labelPage(self, "Child Details")
            btnWidget.setStyleSheet(UIFunctions.selectMenu(btnWidget.styleSheet()))
            
            # child detail table

            self.connection = sqlite3.connect('child.db')
            c = self.connection.cursor()
            query = c.execute('''SELECT FNAME, LNAME, C_ID, AGE, DOR, GENDER FROM details''')
            self.ui.tableWidget.setRowCount(0)

            for row_number , row_data in enumerate(query):
                self.ui.tableWidget.insertRow(row_number)
                for column_number , data in enumerate(row_data):
                    self.ui.tableWidget.setItem(row_number, column_number, QtWidgets.QTableWidgetItem(str(data)))
            
            self.connection.commit()
            self.connection.close()

        #if QtWidgets.QPushButton.objectName() == "showinandout_2":
            #self.showinandout_2.clicked.connect(self.ui_functions.showattendancedetail)

    ## ==> END ##

    ########################################################################
    ## START ==> APP EVENTS
    ########################################################################

    ## EVENT ==> MOUSE DOUBLE CLICK
    ########################################################################
    def eventFilter(self, watched, event):
        if watched == self.le and event.type() == QtCore.QEvent.MouseButtonDblClick:
            print("pos: ", event.pos())
    ## ==> END ##

    ## EVENT ==> MOUSE CLICK
    ########################################################################
    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
        if event.buttons() == Qt.LeftButton:
            print('Mouse click: LEFT CLICK')
        if event.buttons() == Qt.RightButton:
            print('Mouse click: RIGHT CLICK')
        if event.buttons() == Qt.MidButton:
            print('Mouse click: MIDDLE BUTTON')
    ## ==> END ##

    ## EVENT ==> KEY PRESSED
    ########################################################################
    def keyPressEvent(self, event):
        print('Key: ' + str(event.key()) + ' | Text Press: ' + str(event.text()))
    ## ==> END ##

    ## EVENT ==> RESIZE EVENT
    ########################################################################
    def resizeEvent(self, event):
        self.resizeFunction()
        return super(MainWindow, self).resizeEvent(event)

    def resizeFunction(self):
        print('Height: ' + str(self.height()) + ' | Width: ' + str(self.width()))
    ## ==> END ##

    ########################################################################
    ## END ==> APP EVENTS
    ############################## ---/--/--- ##############################

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    sys.exit(app.exec_())
