import json
import mysql.connector

def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def insert_data_to_mysql(data, db_config, table_name='hospitals'):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        for record in data:
            columns = ', '.join(record.keys())
            values = ', '.join(['%s' for _ in record.values()])
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
            cursor.execute(query, tuple(record.values()))

        connection.commit()
        print("Data inserted successfully!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    # Replace with your actual MySQL database connection details
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'hospital-e-ticketing',
        'raise_on_warnings': True
    }

    files = [{'filename': 'barisal.txt', 'subdistrict_or_thana_id_ranges': [118, 127]},
        {'filename': 'bodura.txt', 'subdistrict_or_thana_id_ranges': []},
        {'filename': 'chittagong.txt', 'subdistrict_or_thana_id_ranges': [60, 79]},
        {'filename': 'comilla.txt', 'subdistrict_or_thana_id_ranges': []},
        {'filename': 'dhaka.txt', 'subdistrict_or_thana_id_ranges': [6, 59]},
        {'filename': 'khulna.txt', 'subdistrict_or_thana_id_ranges': [100, 111]},
        {'filename': 'kustia.txt', 'subdistrict_or_thana_id_ranges': [112, 117]},
        {'filename': 'mymensingh.txt', 'subdistrict_or_thana_id_ranges': [607, 613]},
        {'filename': 'narayangang.txt', 'subdistrict_or_thana_id_ranges': [1, 5]},
        {'filename': 'pabna.txt', 'subdistrict_or_thana_id_ranges': [80, 88]},
        {'filename': 'rajshahi.txt', 'subdistrict_or_thana_id_ranges': [89, 99]},
        {'filename': 'rangpur.txt', 'subdistrict_or_thana_id_ranges': [601, 606]},
        {'filename': 'sylhet.txt', 'subdistrict_or_thana_id_ranges': [128, 139]}]

    scraped_hospitals = []

    with open('./hospitals/barisal.txt', mode='r') as f:
        for each in f.readlines():
            scraped_hospitals.append(each)

    for i in range(len(scraped_hospitals)):
        scraped_hospitals[i] = scraped_hospitals[i].replace("\n", "")
    
    print(scraped_hospitals)

    
