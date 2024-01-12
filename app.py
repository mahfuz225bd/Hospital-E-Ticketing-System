from flask import Flask, render_template, request, jsonify
from twilio.rest import Client
from controllers.db_config import db_cursor, mydb, Error
from controllers.translator import EnBnTranslator

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/problems')
def get_problems_category_wise():
    problems = {}
    db_cursor.execute("SELECT id, value_bn, (SELECT value_bn FROM problem_categories WHERE problem_categories.id = problem_category_id) AS category FROM problems;")
    result = db_cursor.fetchall()

    for each in result:
        category = each[2]
        if category in problems:
            problems[category].append({'id': each[0], 'value': each[1], 'category': each[2]})
        else:
            problems[category] = [{'id': each[0], 'value': each[1], 'category': each[2]}]

    return jsonify(problems)

@app.route('/api/divisions')
def get_divisions():
    divisions = []
    db_cursor.execute("SELECT id, value_bn FROM `divisions`")
    result = db_cursor.fetchall()

    for each in result:
        divisions.append({'id': each[0], 'value': each[1]})

    return jsonify(divisions)

@app.route('/api/districts', methods=['GET'])
def get_districts():
    districts = []
    if request.method == 'GET':
        db_cursor.execute("SELECT id, value_bn FROM `districts` WHERE division_id=%s", (request.args['divisionId'],))

        result = db_cursor.fetchall()

        for each in result:
            districts.append({'id': each[0], 'value': each[1]})

        return jsonify(districts)
    
# @app.route('/api/subdistrictAndThanas', methods=['GET'])
# def get_subdistrict_and_thanas():
#     subdistrictAndThana = []
#     if request.method == 'GET':
#         db_cursor.execute("SELECT id, value_bn FROM `subdistrict_and_thanas` WHERE district_id=%s", (request.args['districtId'],))

#         result = db_cursor.fetchall()

#         for each in result:
#             subdistrictAndThana.append({'id': each[0], 'value': each[1]})

#         return jsonify(subdistrictAndThana)
    
@app.route('/api/subdistrictAndThanas', methods=['GET'])
def get_subdistrict_and_thanas():
    subdistrictAndThana = []
    if request.method == 'GET':
        db_cursor.execute("SELECT subdistrict_and_thanas.id, subdistrict_and_thanas.value_bn, COUNT(hospitals.hospital_name_en) AS count FROM subdistrict_and_thanas LEFT JOIN hospitals ON subdistrict_and_thanas.id = hospitals.subdistrict_thana_id WHERE subdistrict_and_thanas.district_id = %s GROUP BY subdistrict_and_thanas.id", (request.args['districtId'],))

        result = db_cursor.fetchall()

        for each in result:
            subdistrictAndThana.append({'id': each[0], 'value': each[1], 'count': each[2]})

        return jsonify(subdistrictAndThana)
    
@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    hospitals = []
    if request.method == 'GET':
        district_id = request.args['districtId'] if 'districtId' in request.args else ''
        subdistrict_or_thana_id = request.args['subdistrictOrThanaId'] if 'subdistrictOrThanaId' in request.args else ''

        db_cursor.execute("SELECT hospitals.id AS id, hospitals.hospital_name_en AS hospital_name_en, subdistrict_and_thanas.district_id AS district_id, hospitals.subdistrict_thana_id AS subdistrict_thana_id FROM hospitals JOIN subdistrict_and_thanas ON subdistrict_and_thanas.id = hospitals.subdistrict_thana_id WHERE district_id = %s OR subdistrict_thana_id = %s ORDER BY hospitals.hospital_name_en ASC", (district_id, subdistrict_or_thana_id,))

        result = db_cursor.fetchall()

        for each in result:
            hospitals.append({'id': each[0], 'value': each[1]})

        return jsonify(hospitals)

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    hospitals = []
    if request.method == 'GET':
        db_cursor.execute("SELECT `id`, `name_en`, `name_bn`, `degree`, `speciality`, `designation`, `dob`, `phone_no_1`, `phone_no_2`, `outdoor_doctor`, `per_visit_time`, `room_location`, `doctor_available_now`, `note` FROM `doctors_by_hospital` WHERE hospital_id=%s", (request.args['hospitalId'],))

        result = db_cursor.fetchall()

        for each in result:
            hospitals.append({'id': each[0], 'name': each[2], 'speciality': each[4]})

        return jsonify(hospitals)
    
@app.route('/api/add_problem', methods=['POST'])
def add_problem():
    """API route for adding a problem (disease) as draft to `problems_draft`"""
    if request.method == 'POST':
        # Get data from POST request
        
        customProblem = request.form['customProblem']

        value_en = customProblem if EnBnTranslator.is_en(customProblem) else EnBnTranslator.bn_to_en(customProblem)
        value_bn = customProblem if EnBnTranslator.is_bn(customProblem) else EnBnTranslator.en_to_bn(customProblem)

        # Insert into problems_draft table
        query = "INSERT INTO problems_draft(value_en, value_bn) VALUES (%s, %s)"
        try:
            db_cursor.execute(query, (value_en, value_bn))
            mydb.commit()
            response = {'status':'success'}
        except Exception as e:
            print('Error: ',e)
            response = {'status': 'failure', 'message': str(e)}
        return jsonify(**response)

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