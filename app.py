from flask import Flask, render_template, request
from db_config import db_cursor, mydb, Error

import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/divisions')
def divisions():
    divisions = []
    db_cursor.execute("SELECT * FROM `divisions`")
    result = db_cursor.fetchall()

    for each in result:
        divisions.append({'index': each[0], 'value': each[2]})

    return json.dumps(divisions)

@app.route('/api/districts', methods=['GET'])
def districts():
    districts = []
    if request.method == 'GET':
        db_cursor.execute("SELECT * FROM `districts` WHERE division_id=%s", (request.args['divisionIndex'],))

        result = db_cursor.fetchall()

        for each in result:
            districts.append({'index': each[1], 'value': each[2]})

        return json.dumps(districts)
    
@app.route('/api/subdistrictAndThanas', methods=['GET'])
def subdistricts():
    subdistrictAndThana = []
    if request.method == 'GET':
        db_cursor.execute("SELECT * FROM `subdistrict_and_thanas` WHERE division_id=%s", (request.args['districtIndex'],))

        result = db_cursor.fetchall()

        for each in result:
            districts.append({'index': each[1], 'value': each[2]})

        return json.dumps(subdistrictAndThana)

@app.route('/test_route')
def test_route():
    return render_template('successful.html')

if __name__ == '__main__':
    app.run(debug=True)