import json
import mysql.connector

def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def insert_data_to_mysql(data, db_config, table_name):
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

    # Replace with your JSON file path
    json_file_path = './doctors.json'

    # Replace with your actual table name
    table_name = 'doctors'

    # Read JSON data from the file
    json_data = read_json(json_file_path)

    # Insert data into MySQL database
    insert_data_to_mysql(json_data, db_config, table_name)
