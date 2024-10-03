import sqlite3

def connect_db():
    conn = sqlite3.connect('students.db')
    return conn

def add_student(student_id, name, gpa):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO students (student_id, name, gpa) VALUES (?, ?, ?)", (student_id, name, gpa))
    conn.commit()
    conn.close()

def update_student(student_id, name, gpa):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE students SET name = ?, gpa = ? WHERE student_id = ?", (name, gpa, student_id))
    conn.commit()
    conn.close()

def delete_student(student_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
    conn.commit()
    conn.close()

def search_student(student_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE student_id = ?", (student_id,))
    student = cursor.fetchone()
    conn.close()
    return student

def list_students():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    conn.close()
    return students
