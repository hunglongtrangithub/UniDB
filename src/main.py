from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from db import db

app = FastAPI()


class Student(BaseModel):
    student_id: str
    name: str
    gpa: float


class UpdateStudent(BaseModel):
    name: str
    gpa: float


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


@app.get("/students/{student_id}")
async def get_student_by_id(student_id: str):
    students_ref = db.collection("students")
    query = students_ref.where("student_id", "==", student_id).stream()

    student_data = None
    # TODO: handle the case of multiple students with same ID
    for student in query:
        student_data = student.to_dict()

    if student_data:
        return student_data
    else:
        raise HTTPException(status_code=404, detail="Student not found")


@app.post("/students")
async def add_student(student: Student):
    students_ref = db.collection("students")
    students_ref.add(student.model_dump())
    return {"message": "Student added successfully"}


@app.put("/students/{student_id}")
async def update_student(student_id: str, student: UpdateStudent):
    students_ref = db.collection("students")
    query = students_ref.where("student_id", "==", student_id).stream()

    doc_id = None
    for student_doc in query:
        doc_id = student_doc.id

    if doc_id:
        students_ref.document(doc_id).update(student.model_dump())
        return {"message": "Student updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Student not found")


@app.delete("/students/{student_id}")
async def delete_student(student_id: str):
    students_ref = db.collection("students")
    query = students_ref.where("student_id", "==", student_id).stream()

    doc_id = None
    for student_doc in query:
        doc_id = student_doc.id

    if doc_id:
        students_ref.document(doc_id).delete()
        return {"message": "Student deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Student not found")
