
from flask import Flask, jsonify, request, render_template
import requests
from bs4 import BeautifulSoup
import sqlite3

app = Flask(__name__)

DATABASE = 'athletes.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS athletes
                     (id INTEGER PRIMARY KEY, name TEXT, weight_class TEXT, gender TEXT, total INTEGER, dots FLOAT, gl_points FLOAT)''')
    conn.commit()
    conn.close()

def scrape_athlete_data(athlete_name):
    url = f"https://www.openpowerlifting.org/api/athlete/{athlete_name}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()  # Assume Open Powerlifting has an API
        return data
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    metric = request.args.get('metric', 'total')
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM athletes ORDER BY {metric} DESC")
    athletes = cursor.fetchall()
    conn.close()
    return jsonify(athletes)

@app.route('/add_athlete', methods=['POST'])
def add_athlete():
    name = request.json.get('name')
    athlete_data = scrape_athlete_data(name)
    if athlete_data:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO athletes (name, weight_class, gender, total, dots, gl_points) VALUES (?, ?, ?, ?, ?, ?)",
                       (athlete_data['name'], athlete_data['weight_class'], athlete_data['gender'], athlete_data['total'], athlete_data['dots'], athlete_data['gl_points']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Athlete added successfully!'}), 200
    return jsonify({'error': 'Athlete not found'}), 404

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
