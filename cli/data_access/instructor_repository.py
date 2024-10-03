import sqlite3

def connect_db():
    conn = sqlite3.connect('school.db')  # Use the same database for all entities
    return conn

def add_instructor(instructor_id, name, department):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO instructors (instructor_id, name, department) VALUES (?, ?, ?)", (instructor_id, name, department))
    conn.commit()
    conn.close()

def update_instructor(instructor_id, name, department):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE instructors SET name = ?, department = ? WHERE instructor_id = ?", (name, department, instructor_id))
    conn.commit()
    conn.close()

def delete_instructor(instructor_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM instructors WHERE instructor_id = ?", (instructor_id,))
    conn.commit()
    conn.close()

def search_instructor(instructor_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM instructors WHERE instructor_id = ?", (instructor_id,))
    instructor = cursor.fetchone()
    conn.close()
    return instructor

def list_instructors():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM instructors")
    instructors = cursor.fetchall()
    conn.close()
    return instructors
