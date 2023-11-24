from translate import Translator
import mysql.connector

def translate_into_bn(text):
    translator= Translator(to_lang="bn")
    translation = translator.translate(text)
    return translation

def update_table():
    # Connect to MySQL
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='hospital-e-ticketing'
    )

    # Create a cursor
    cursor = connection.cursor()

    try:
        # Select all rows from the table
        query_select = "SELECT id, name_en FROM doctors ORDER BY id DESC"
        cursor.execute(query_select)
        rows = cursor.fetchall()

        # Update each row with the translated value_bn
        for row in rows:
            id, name_en = row
            translated_value_en_to_bn = translate_into_bn(name_en)

            # Update the row in the table
            query_update = "UPDATE doctors SET name_bn = %s WHERE id = %s"
            cursor.execute(query_update, (translated_value_en_to_bn, id))
            connection.commit()

        print("Translation complete!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the cursor and connection
        cursor.close()
        connection.close()

if __name__ == "__main__":
    update_table()
