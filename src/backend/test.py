import sqlite3

def get_db_connection():
    conn = sqlite3.connect('./gustavo_cruz/src/backend/TEST101.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS gustavo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    print('Base de datos creada')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()