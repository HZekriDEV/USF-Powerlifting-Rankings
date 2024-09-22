from flask import Flask, jsonify, request, render_template
import requests
from bs4 import BeautifulSoup
import sqlite3
import pandas as pd
from io import StringIO
import psycopg2
from psycopg2 import sql

app = Flask(__name__)

DATABASE = 'postgres://avnadmin:AVNS_bOpJOYVrHmAIEZj30-L@usfpldata-kimozekri-ffda.k.aivencloud.com:15841/defaultdb?sslmode=require'
KG_TO_LB = 2.20462 

def init_db():
    conn = psycopg2.connect(DATABASE)
    cursor = conn.cursor()
    
    # Updated table schema with all the new columns
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS athletes (
            id SERIAL PRIMARY KEY,
            name TEXT,
            sex TEXT,
            event TEXT,
            equipment TEXT,
            age REAL,
            age_class TEXT,
            birth_year_class TEXT,
            division TEXT,
            bodyweight_kg REAL,
            weight_class_kg REAL,
            squat1_kg REAL,
            squat2_kg REAL,
            squat3_kg REAL,
            squat4_kg REAL,
            best3_squat_kg REAL,
            bench1_kg REAL,
            bench2_kg REAL,
            bench3_kg REAL,
            bench4_kg REAL,
            best3_bench_kg REAL,
            deadlift1_kg REAL,
            deadlift2_kg REAL,
            deadlift3_kg REAL,
            deadlift4_kg REAL,
            best3_deadlift_kg REAL,
            total_kg REAL,
            place TEXT,
            dots REAL,
            wilks REAL,
            glossbrenner REAL,
            goodlift REAL,
            tested TEXT,
            country TEXT,
            state TEXT,
            federation TEXT,
            parent_federation TEXT,
            date TEXT,
            meet_country TEXT,
            meet_state TEXT,
            meet_town TEXT,
            meet_name TEXT,
            sanctioned TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def scrape_athlete_data(athlete_name):
    # Normalize the athlete name by converting it to lowercase and replacing spaces with hyphens
    athlete_name = athlete_name.strip().lower().replace(' ', '')
    url = f"https://www.openpowerlifting.org/u/{athlete_name}"
    response = requests.get(url)
    
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the link to the CSV file
        csv_link_tag = soup.find('a', href=True, string='Download as CSV')
        
        if csv_link_tag:
            # Build the full CSV URL
            csv_url = f"https://www.openpowerlifting.org{csv_link_tag['href']}"
            
            # Now you can download the CSV data
            csv_response = requests.get(csv_url)
            
            if csv_response.status_code == 200:
                # Read the CSV data into a pandas DataFrame
                csv_data = csv_response.content.decode('utf-8')
                df = pd.read_csv(StringIO(csv_data))  # Use StringIO to read the CSV data into a DataFrame
                return df
            else:
                print(f"Failed to download CSV for {athlete_name}")
        else:
            print(f"CSV link not found for {athlete_name}")
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    metric = request.args.get('metric', 'dots')
    filter_value = request.args.get('filter', None)
    gender = request.args.get('gender', 'both')  # Get the gender filter, default to 'both'
    unit = request.args.get('unit', 'kg')

    conn = psycopg2.connect(DATABASE)
    cursor = conn.cursor()

    query = '''
        SELECT id, name, weight_class_kg, MAX(total_kg), dots
        FROM athletes
    '''
    conditions = []
    params = []

    if gender == 'male':
        conditions.append('sex = %s')
        params.append('M')
    elif gender == 'female':
        conditions.append('sex = %s')
        params.append('F')

    if filter_value:
        conditions.append('weight_class_kg = %s')
        params.append(filter_value)

    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)

    query += f' GROUP BY id, name, weight_class_kg, dots ORDER BY {metric} DESC'
    
    cursor.execute(query, params)
    athletes = cursor.fetchall()
    conn.close()

    if unit == 'lb':  # Convert to pounds if the unit is lb
        athletes = [
            (id, name, round((weight_class_kg or 0) * KG_TO_LB, 2), round((total_kg or 0) * KG_TO_LB, 2), dots)
            for id, name, weight_class_kg, total_kg, dots in athletes
        ]
    
    return jsonify(athletes)


@app.route('/add_athlete', methods=['POST'])
def add_athlete():
    name = request.json.get('name')
    athlete_data = scrape_athlete_data(name)
    
    if athlete_data is not None:
        conn = psycopg2.connect(DATABASE)
        cursor = conn.cursor()
        
        # Iterating over the DataFrame rows and inserting into the database
        for index, row in athlete_data.iterrows():
            if row.equals(athlete_data.loc[athlete_data['TotalKg'].idxmax()]):
                cursor.execute("""
                    INSERT INTO athletes (
                        name, sex, event, equipment, age, age_class, birth_year_class,
                        division, bodyweight_kg, weight_class_kg, squat1_kg, squat2_kg,
                        squat3_kg, squat4_kg, best3_squat_kg, bench1_kg, bench2_kg,
                        bench3_kg, bench4_kg, best3_bench_kg, deadlift1_kg, deadlift2_kg,
                        deadlift3_kg, deadlift4_kg, best3_deadlift_kg, total_kg, place,
                        dots, wilks, glossbrenner, goodlift, tested, country, state,
                        federation, parent_federation, date, meet_country, meet_state,
                        meet_town, meet_name, sanctioned
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    row['Name'], row['Sex'], row['Event'], row['Equipment'], row['Age'],
                    row['AgeClass'], row['BirthYearClass'], row['Division'], row['BodyweightKg'],
                    row['WeightClassKg'] if pd.notna(row['WeightClassKg']) else 0, row['Squat1Kg'], row['Squat2Kg'], row['Squat3Kg'], 
                    row['Squat4Kg'], row['Best3SquatKg'], row['Bench1Kg'], row['Bench2Kg'],
                    row['Bench3Kg'], row['Bench4Kg'], row['Best3BenchKg'], row['Deadlift1Kg'], 
                    row['Deadlift2Kg'], row['Deadlift3Kg'], row['Deadlift4Kg'], 
                    row['Best3DeadliftKg'], row['TotalKg'], row['Place'], row['Dots'], 
                    row['Wilks'], row['Glossbrenner'], row['Goodlift'], row['Tested'], 
                    row['Country'], row['State'], row['Federation'], row['ParentFederation'], 
                    row['Date'], row['MeetCountry'], row['MeetState'], row['MeetTown'], 
                    row['MeetName'], row['Sanctioned']
                ))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Athlete added successfully!'}), 200
    
    return jsonify({'error': 'Athlete not found'}), 404


@app.route('/update_weight_class', methods=['POST'])
def update_weight_class():
    data = request.json
    athlete_id = data.get('athlete_id')
    new_weight_class = data.get('weight_class_kg')

    if athlete_id is not None and new_weight_class is not None:
        conn = psycopg2.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("UPDATE athletes SET weight_class_kg = %s WHERE id = %s", (new_weight_class, athlete_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Weight class updated successfully!'}), 200
    return jsonify({'error': 'Invalid data'}), 400

@app.route('/remove_athlete', methods=['DELETE'])
def remove_athlete():
    data = request.json
    athlete_name = data.get('name')
    
    conn = psycopg2.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM athletes WHERE name = %s", (athlete_name,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'{athlete_name} removed successfully!'}), 200

def truncate_all_tables():
    try:
        # Connect to your Aiven PostgreSQL database
        conn = psycopg2.connect(DATABASE)
        cursor = conn.cursor()

        # Get the list of all tables in the current schema
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        
        tables = cursor.fetchall()
        
        # Loop through each table and truncate it
        for table in tables:
            print(f"Truncating table {table[0]}...")
            cursor.execute(f"TRUNCATE TABLE {table[0]} CASCADE;")
    
        
        # Commit the transaction
        conn.commit()
        print("All tables truncated successfully!")

    except Exception as e:
        print(f"Error occurred: {e}")
        conn.rollback()

    finally:
        if conn:
            cursor.close()
            conn.close()


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
