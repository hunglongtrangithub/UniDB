from data_access import instructor_repository

def add_instructor():
    instructor_id = input("Enter Instructor ID: ")
    name = input("Enter Instructor Name: ")
    department = input("Enter Department: ")
    instructor_repository.add_instructor(instructor_id, name, department)

def update_instructor():
    instructor_id = input("Enter Instructor ID to update: ")
    name = input("Enter new name: ")
    department = input("Enter new department: ")
    instructor_repository.update_instructor(instructor_id, name, department)

def delete_instructor():
    instructor_id = input("Enter Instructor ID to delete: ")
    instructor_repository.delete_instructor(instructor_id)

def view_instructor():
    instructor_id = input("Enter Instructor ID to view: ")
    instructor = instructor_repository.search_instructor(instructor_id)
    if instructor:
        print(f"ID: {instructor[0]}, Name: {instructor[1]}, Department: {instructor[2]}")
    else:
        print("Instructor not found.")

def list_instructors():
    instructors = instructor_repository.list_instructors()
    for instructor in instructors:
        print(f"ID: {instructor[0]}, Name: {instructor[1]}, Department: {instructor[2]}")
