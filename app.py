from flask import Flask, render_template, request
from twilio.rest import Client
from db_config import db_cursor, mydb, Error

import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/divisions')
def divisions():
    divisions = []
    db_cursor.execute("SELECT id, value_bn FROM `divisions`")
    result = db_cursor.fetchall()

    for each in result:
        divisions.append({'index': each[0], 'value': each[1]})

    return json.dumps(divisions)

@app.route('/api/districts', methods=['GET'])
def districts():
    districts = []
    if request.method == 'GET':
        db_cursor.execute("SELECT id, value_bn FROM `districts` WHERE division_id=%s", (request.args['divisionIndex'],))

        result = db_cursor.fetchall()

        for each in result:
            districts.append({'index': each[0], 'value': each[1]})

        return json.dumps(districts)
    
@app.route('/api/subdistrictAndThanas', methods=['GET'])
def subdistricts():
    subdistrictAndThana = []
    if request.method == 'GET':
        db_cursor.execute("SELECT id, value_bn FROM `subdistrict_and_thanas` WHERE district_id=%s", (request.args['districtIndex'],))

        result = db_cursor.fetchall()

        for each in result:
            subdistrictAndThana.append({'index': each[0], 'value': each[1]})

        return json.dumps(subdistrictAndThana)

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