import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="hospital-e-ticketing"
)

Error = mysql.connector.Error

db_cursor = mydb.cursor()