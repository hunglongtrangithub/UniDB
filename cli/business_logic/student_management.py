from data_access import student_repository

def add_student():
    student_id = input("Enter Student ID: ")
    name = input("Enter Student Name: ")
    gpa = float(input("Enter GPA: "))
    student_repository.add_student(student_id, name, gpa)

def update_student():
    student_id = input("Enter Student ID to update: ")
    name = input("Enter new name: ")
    gpa = float(input("Enter new GPA: "))
    student_repository.update_student(student_id, name, gpa)
    
def delete_student():
    student_id = input("Enter Student ID to delete: ")
    student_repository.delete_student(student_id)

def view_student():
    student_id = input("Enter Student ID to view: ")
    student = student_repository.search_student(student_id)
    if student:
        print(f"ID: {student[0]}, Name: {student[1]}, GPA: {student[2]}")
    else:
        print("Student not found.")

def list_students():
    students = student_repository.list_students()
    for student in students:
        print(f"ID: {student[0]}, Name: {student[1]}, GPA: {student[2]}")
