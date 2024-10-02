import firebase_admin
from firebase_admin import firestore
from dotenv import load_dotenv

# Load GOOGLE_APPLICATION_CREDENTIALS from .env file
load_dotenv()

firebase_admin.initialize_app()

db = firestore.client()


STUDENTS = [
    {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "gpa": 3.5,
        "major": "Physics",
    },
    {
        "name": "Bob Smith",
        "email": "bob@example.com",
        "gpa": 3.7,
        "major": "Mathematics",
    },
    {
        "name": "Catherine Ray",
        "email": "catherine@example.com",
        "gpa": 3.2,
        "major": "Computer Science",
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
    # need to run this only once
    clear_existing_students()
    add_student_data()
    fetch_student_data()
