import json

from flask import Flask, render_template, request
from twilio.rest import Client
from db_config import db_cursor, mydb, Error

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/divisions')
def get_divisions():
    divisions = []
    db_cursor.execute("SELECT id, value_bn FROM `divisions`")
    result = db_cursor.fetchall()

    for each in result:
        divisions.append({'id': each[0], 'value': each[1]})

    return json.dumps(divisions)

@app.route('/api/districts', methods=['GET'])
def get_districts():
    districts = []
    if request.method == 'GET':
        db_cursor.execute("SELECT id, value_bn FROM `districts` WHERE division_id=%s", (request.args['divisionId'],))

        result = db_cursor.fetchall()

        for each in result:
            districts.append({'id': each[0], 'value': each[1]})

        return json.dumps(districts)
    
@app.route('/api/subdistrictAndThanas', methods=['GET'])
def get_subdistrict_and_thanas():
    subdistrictAndThana = []
    if request.method == 'GET':
        db_cursor.execute("SELECT id, value_bn FROM `subdistrict_and_thanas` WHERE district_id=%s", (request.args['districtId'],))

        result = db_cursor.fetchall()

        for each in result:
            subdistrictAndThana.append({'id': each[0], 'value': each[1]})

        return json.dumps(subdistrictAndThana)
    
@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    hospitals = []
    if request.method == 'GET':
        db_cursor.execute("SELECT id, hospital_name_en FROM `hospitals` WHERE subdistrict_thana_id=%s", (request.args['subdistrictOrThanaId'],))

        result = db_cursor.fetchall()

        for each in result:
            hospitals.append({'id': each[0], 'value': each[1]})

        return json.dumps(hospitals)

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    hospitals = []
    if request.method == 'GET':
        db_cursor.execute("SELECT `id`, `name_en`, `name_bn`, `degree`, `speciality`, `designation`, `dob`, `phone_no_1`, `phone_no_2`, `outdoor_doctor`, `per_visit_time`, `room_location`, `doctor_available_now`, `note` FROM `doctors_by_hospital` WHERE hospital_id=%s", (request.args['hospitalId'],))

        result = db_cursor.fetchall()

        for each in result:
            hospitals.append({'id': each[0], 'name': each[2], 'speciality': each[4]})

        return json.dumps(hospitals) 

@app.route('/test_route')
def test_route():
    return render_template('successful.html')

@app.route('/send_sms', methods=['GET'])
def send_sms():
    account_sid = 'AC0c3b046145c1886babbeb1e8d59f8dc8'
    auth_token = '499fec0970a9ef14662792d1d59b647f'
    client = Client(account_sid, auth_token)

    if request.method == 'GET':
        message = client.messages.create(
            from_='+12052363581',
            body=request.args['message'],
            to=request.args['to']
        )

    return message.sid

if __name__ == '__main__':
    app.run(debug=True)