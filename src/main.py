from fastapi import FastAPI
from db import db

app = FastAPI()


# just for testing purposes
@app.get("/")
def hello_world():
    return {"Hello": "World"}


@app.get("/students")
async def get_students():
    students_ref = db.collection("students")
    students = students_ref.stream()

    student_list = []
    for student in students:
        student_data = student.to_dict()
        student_list.append(student_data)

    return student_list


@app.get("/students/{email}")
async def get_student_by_email(email: str):
    students_ref = db.collection("students")
    query = students_ref.where("email", "==", email).stream()

    student_data = None
    for student in query:
        student_data = student.to_dict()

    if student_data:
        return student_data
    else:
        return {"error": "Student not found"}
