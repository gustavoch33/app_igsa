from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pytz
import sqlite3


app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('./src/backend/TEST101.db')
    conn.row_factory = sqlite3.Row
    return conn

def timestamp():
    # Establece la zona horaria a 'America/Mexico_City'
    tz = pytz.timezone('America/Mexico_City')
    # Obtiene la hora actual en la zona horaria especificada
    return datetime.now(tz).strftime('%Y-%m-%d %H:%M:%S')

# Obtiene los registros en la base de datos
@app.route('/tareas', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM gustavo ORDER BY created_at DESC').fetchall()
    print(tasks)
    conn.close()
    return jsonify([dict(row) for row in tasks])

# Ruta para crear una nueva tarea
@app.route('/tareas', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    if not title:
        return jsonify({'error': '¡El título es requerido!'}), 400

    conn = get_db_connection()
    conn.execute('INSERT INTO gustavo (title, description, created_at) VALUES (?, ?, ?)', (title, description, timestamp()))
    conn.commit()
    conn.close()
    return jsonify({'message': '¡Tarea creada!'}), 201

# Ruta para actualizar una tarea por ID
@app.route('/tareas/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'error': '¡El título es requerido!'}), 400

    conn = get_db_connection()
    task = conn.execute('SELECT * FROM gustavo WHERE id = ?', (task_id,)).fetchone()

    if task is None:
        conn.close()
        return jsonify({'error': '¡Tarea no encontrada!'}), 404

    conn.execute('UPDATE gustavo SET title = ?, description = ?, created_at = ? WHERE id = ?', (title, description, timestamp(), task_id))
    conn.commit()
    conn.close()
    return jsonify({'message': f'Tarea {task_id} actualizada'}), 200

# Ruta para eliminar una tarea por ID
@app.route('/tareas/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    task = conn.execute('SELECT * FROM gustavo WHERE id = ?', (task_id,)).fetchone()

    if task is None:
        conn.close()
        return jsonify({'error': '¡Tarea no encontrada!'}), 404

    conn.execute('DELETE FROM gustavo WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'Tarea {task_id} eliminada'}), 200

# Crear tabla si no existe
@app.before_request
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS gustavo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            created_at DATETIME
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    print('Inicializando la base de datos...')
    app.run(debug=True)