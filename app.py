from flask import Flask, render_template, request, jsonify
# from twilio.rest import Client
from controllers.db_config import db_cursor, mydb, Error
from controllers.send_sms import send_sms
from controllers.time_formatter import convert_into_12hr_format
from controllers.translator import EnBnTranslator

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/problems')
def get_problems_category_wise():
    problems = {}
    db_cursor.execute("SELECT id, value_bn, value_en, (SELECT value_bn FROM problem_categories WHERE problem_categories.id = problem_category_id) AS category FROM problems ORDER BY problems.value_en ASC;")
    result = db_cursor.fetchall()

    for each in result:
        category = each[3]
        if category in problems:
            problems[category].append({'id': each[0], 'value': each[2], 'valueAlt': each[1], 'category': each[3]})
        else:
            problems[category] = [{'id': each[0], 'value': each[2], 'category': each[1]}]

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
    
@app.route('/api/subdistrictAndThanas', methods=['GET'])
def get_subdistrict_and_thanas():
    subdistrictAndThana = []
    if request.method == 'GET':
        db_cursor.execute("SELECT subdistrict_and_thanas.id, subdistrict_and_thanas.value_bn, COUNT(hospitals.hospital_name_en) AS count FROM subdistrict_and_thanas LEFT JOIN hospitals ON subdistrict_and_thanas.id = hospitals.subdistrict_thana_id WHERE subdistrict_and_thanas.district_id = %s GROUP BY subdistrict_and_thanas.id ORDER BY count DESC ", (request.args['districtId'],))

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
    doctors = []
    if request.method == 'GET':
        db_cursor.execute("SELECT `id`, `name_en`, `name_bn`, `degree`, `speciality`, `treatment_for`, `designation`,  `dob`, `phone_no_1`, `phone_no_2`, `outdoor_doctor`, `per_visit_time`, `room_location`, `doctor_available_now`, `note` FROM `doctors_by_hospital` WHERE `hospital_id`=%s AND `doctor_available_now`=1", (request.args['hospitalId'],))

        result = db_cursor.fetchall()

        for each in result:
            doctor_id = each[0]

            available_weeks = []

            db_cursor.execute("SELECT `weekday` FROM `doctor_weekly_schedules` WHERE `doctor_id` = %s", (doctor_id,))
            result_days = db_cursor.fetchall()
            for each_day in result_days:
                available_weeks.append(each_day[0])

            doctors.append({'id': doctor_id, 'name': each[2], 'nameEn': each[1], 'speciality': each[4], 'treatmentFor': each[5], 'outdoor_doctor': each[10], 'perVisitTime': each[11], 'availableWeeks': ', '.join(str(day) for day in available_weeks)})

        return jsonify(doctors)
    
@app.route('/api/add_problem', methods=['POST'])
def add_problem():
    """API route for adding a problem (disease) as draft to `problems_draft`"""
    if request.method == 'POST':
        # Get data from POST request
        
        custom_problem = request.form['customProblem']

        value_en = custom_problem if EnBnTranslator.is_en(custom_problem) else EnBnTranslator.bn_to_en(custom_problem)
        value_bn = custom_problem if EnBnTranslator.is_bn(custom_problem) else EnBnTranslator.en_to_bn(custom_problem)

        # Make query string to insert into problems_draft table
        query = "INSERT INTO problems_draft(value_en, value_bn) VALUES (%s, %s)"

        try:
            db_cursor.execute(query, (value_en, value_bn))
            mydb.commit()
            response = {'status':'success', 'lastInsertedId': db_cursor.lastrowid}
        except Exception as e:
            print('Error: ', e)

            custom_problem_id = 0

            if 'Duplicate entry' in e:
                db_cursor.execute("SELECT id FROM `problems_draft WHERE value_en=%s OR value_bn=%s`", (custom_problem, custom_problem))
                result = db_cursor.fetchone()
                custom_problem_id = result['id']

            response = {'status': 'failure', 'message': str(e), 'customProblemId': custom_problem_id}
        return jsonify(**response)
    
@app.route('/api/add_patient', methods=['POST'])
def add_patient():
    """API route for adding a patient with return the id"""
    if request.method == 'POST':
        # Getting form data
        name = request.form['name']
        age = int(request.form['age'])
        gender = request.form['gender']
        phone = request.form['phone']
        email = request.form['email']
        symptoms = request.form['symptoms']

        # take value one of `problem_id` or `custom_problem_id` and empty for other one
        problem_id = int(request.form['problemId']) if request.form['problemId'].isnumeric() else ""
        custom_problem_id = int(request.form['customProblemId']) if request.form['customProblemId'].isnumeric() else ""
        
        query = "INSERT INTO `patients`(`name`, `age`, `gender`, `phone_no`, `email`, `problem_id`, `custom_problem_id`, `symptoms`) VALUES (%s,%s,UPPER(%s),%s,%s,%s,%s,%s)"

        try:
            db_cursor.execute(query, (name, age, gender, phone, email, problem_id, custom_problem_id, symptoms))
            mydb.commit()
            response = {'status':'success', 'lastInsertedId': db_cursor.lastrowid}
        except Exception as e:
            print('Error: ', e)
            response = {'status': 'failure', 'message': str(e)}
        return jsonify(**response)
    
@app.route('/api/make_appointment', methods=['POST'])
def make_appointment():
    """API route for inserting an appointment"""
    if request.method == 'POST':
        # Getting form data
        patient_id = int(request.form['patientId'])
        doctor_by_hospital_id = int(request.form['doctorByHospitalId'])
        appointment_date = request.form['appointmentDate']
        
        query = "INSERT INTO `appointments`(`patient_id`, `doctor_by_hospital_id`, `date`) VALUES (%s,%s,%s)"

        try:
            db_cursor.execute(query, (patient_id, doctor_by_hospital_id, appointment_date))
            mydb.commit()
            response = {'status':'success', 'appointmentId': db_cursor.lastrowid}
        except Exception as e:
            print('Error: ', e)
            response = {'status': 'failure', 'message': str(e)}

        return jsonify(**response)

@app.route('/successful', methods=['POST', 'GET'])
def successful():
    appointment_id = int(request.args['appointmentId'])

    appointment_details = {}

    try:
        db_cursor.execute('''SELECT 
                                h.hospital_name_bn AS hospital,
                                st.value_bn AS subdistrict_or_thana,
                                d.value_bn AS district,
                                dh.name_bn AS doctor,
                                dh.room_location,
                                a.serial_no,
                                a.date AS appointment_date,
                                a.time AS appointment_time,
                                p.phone_no AS contact_no,
                                p.email AS contact_email
                            FROM appointments a
                            JOIN doctors_by_hospital dh ON a.doctor_by_hospital_id = dh.id
                            JOIN hospitals h ON dh.hospital_id = h.id
                            JOIN subdistrict_and_thanas st ON h.subdistrict_thana_id = st.id
                            JOIN districts d ON st.district_id = d.id
                            JOIN patients p ON a.patient_id = p.id
                            WHERE a.id = %s;
        ''', (appointment_id,))

        result = db_cursor.fetchone()
         
        # Construct appointment details
        appointment_details = {
            'hospital_name': result[0],
            'hospital_district': result[2],
            'doctor': result[3],
            'room_location': result[4],
            'serial_no': result[5],
            'appointment_date': result[6],
            'appointment_time': convert_into_12hr_format(str(result[7])),
            'contact_no': result[8],
            'contact_email': result[9]
        }

        # Construct message template using appointment details
        message_template = (
            "আপনার {hospital_name}, {hospital_district} হাসপাতালে {doctor}-এর অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে। "
            "আপনার সিরিয়াল নং: {serial_no} এবং {appointment_date} তারিখে {appointment_time} এর মধ্যে "
            "এই হাসপাতালের {room_location} এ উপস্থিত থাকার জন্য অনুরোধ করা হলো"
        )

        # Format message using appointment details
        message = message_template.format(**appointment_details)

        send_sms(message, appointment_details['contact_no'])
    except Exception as e: 
        print('Error: ', e)

    return render_template('successful.html', appointment_details=appointment_details)


# @app.route('/send_sms', methods=['GET'])
# def send_sms2():
#     account_sid = 'AC0c3b046145c1886babbeb1e8d59f8dc8'
#     auth_token = '17f13346e591dc6d0dee9b272b6f8700'
#     client = Client(account_sid, auth_token)

#     if request.method == 'GET':
#         receiver_phone_no = request.args['to'] if request.args['to'].startswith("+88") else  "+88" + request.args['to']

#         message = client.messages.create(
#             from_='+12177182574',
#             body=request.args['message'],
#             to=receiver_phone_no
#         )

#     return message.sid

if __name__ == '__main__':
    app.run(debug=True)
    
