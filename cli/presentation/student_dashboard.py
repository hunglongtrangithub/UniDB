from data_access import student_repository


def student_dashboard():
    print("1. Add Student")
    print("2. Update Student")
    print("3. Delete Student")
    print("4. View Student by ID")
    print("5. List All Students")
    choice = input("Choose an option: ")

    if choice == "1":
        student_id = input("Enter Student Id:")
        name = input("Enter Student Name:")
        major = input("Enter Student Major:")
        success, data = student_repository.add_student(student_id, name, major)
        if success:
            print("Student added successfully.")
    elif choice == "2":
        student_repository.update_student()
    elif choice == "3":
        student_repository.delete_student()
    elif choice == "4":
        student_id = input("Enter Student Id:")
        student_data = student_repository.search_student(student_id)

        if student_data:
            print(f"Name: {student_data.get('name')}")
            print(f"Major: {student_data.get('major')}")
            print(f"Email: {student_data.get('email')}")

        else:
            print("Student not found.")

    elif choice == "5":
        success, data = student_repository.list_students()
        if success:
            print("List of students:")
            for student in data:
                print(f"ID: {student.get('student_id')}")
                print(f"Name: {student.get('name')}")
                print(f"Major: {student.get('major')}")
                print()
        else:
            print("No students found.")
