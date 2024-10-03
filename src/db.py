import firebase_admin
from firebase_admin import firestore
from dotenv import load_dotenv

# Load GOOGLE_APPLICATION_CREDENTIALS from .env file
load_dotenv()

firebase_admin.initialize_app()

db = firestore.client()

STUDENTS = [
    {
        "student_id": "S001",
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "gpa": 3.5,
        "major": "Physics",
        "year_of_study": "Sophomore",
        "address": "123 Elm St, Physics Town",
    },
    {
        "student_id": "S002",
        "name": "Bob Smith",
        "email": "bob@example.com",
        "gpa": 3.7,
        "major": "Mathematics",
        "year_of_study": "Junior",
        "address": "456 Maple St, Math City",
    },
    {
        "student_id": "S003",
        "name": "Catherine Ray",
        "email": "catherine@example.com",
        "gpa": 3.2,
        "major": "Computer Science",
        "year_of_study": "Freshman",
        "address": "789 Oak St, CompSci Village",
    },
]


def clear_existing_students():
    students_ref = db.collection("students")
    students = students_ref.stream()

    for student in students:
        student_ref = db.collection("students").document(student.id)
        student_ref.delete()
    print("Existing students cleared from Firestore.")


def add_student_data():
    for student in STUDENTS:
        db.collection("students").add(student)

    print("Student data added to Firestore.")


def fetch_student_data():
    students_ref = db.collection("students")
    fetched_students = students_ref.stream()

    print("Fetching added student data...")

    collected_students = []
    for student in fetched_students:
        student = student.to_dict()
        collected_students.append(student)

    print("Student data fetched from Firestore:")
    print("Number of students:", len(collected_students))
    print(collected_students)


if __name__ == "__main__":
    # Clear existing data, add updated data, and fetch to verify
    clear_existing_students()
    add_student_data()
    fetch_student_data()
