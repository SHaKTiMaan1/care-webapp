import pymongo
import sqlite3

client_web = pymongo.MongoClient(
    "mongodb+srv://CCI:root@cluster0.4gzmr.mongodb.net/Jhansi?retryWrites=true&w=majority")
db = client_web["Jhansi"]
col = db["children"]

conn = sqlite3.connect("child.db")
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS details 
            (FNAME TEXT NOT NULL,
            MNAME TEXT NOT NULL,
            LNAME TEXT NOT NULL,
            C_ID TEXT PRIMARY KEY NOT NULL,
            AGE INT NOT NULL, 
            DOR TEXT NOT NULL,
            GENDER CHAR(1) NOT NULL,
            WITNESS CHAR(25) NOT NULL,
            SET_EXIST BOOLEAN);''')  
c.execute('''CREATE TABLE IF NOT EXISTS attendance
            (DATE TEXT NOT NULL,
            C_ID TEXT NOT NULL,
            ATTEND BOOLEAN DEFAULT "False" NOT NULL ,
            ROA TEXT DEFAULT NULL,
            SYNCED BOOLEAN DEFAULT "False");''')

c = conn.execute('''SELECT C_ID FROM details;''')
rows = c.fetchall()
l = []
for row in rows:
    l.append(row[0])

f = open("CCI.txt", "r")
lines = list(f)
cci_id = lines[0].rstrip("\n")
f.close()

doc = col.find({"cci_id": f"{cci_id}"}, {"_id": 0, "__v":0})
for x in doc:
    if(x["C_Id"] not in l):
        c.execute('''INSERT INTO details(FNAME, LNAME, C_ID, AGE, DOR, GENDER, WITNESS, SET_EXIST)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?)''', 
                    (x["fname"], x["lname"], x["C_Id"], x["age"], x["reg_date"], x["gender"], x["witness"],"False"))
    else:
        pass
"""For getting CCI Details"""
col = db["ccis"]
doc = col.find({"cci_id": f"{cci_id}"}, {"_id": 0, "__v": 0})
for x in doc:
    fl = open("CCI.txt", "a")
    cci_name = x["cci_name"]+"\n"
    fl.write(cci_name)
    cci_HeadName = x["cci_HeadName"]["fname"]+" "+x["cci_HeadName"]["lname"]+"\n"
    fl.write(cci_HeadName)
    fl.close()


conn.commit()
conn.close()
