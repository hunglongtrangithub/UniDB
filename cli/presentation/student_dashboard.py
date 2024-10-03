from data_access import student_repository

def student_dashboard():
    print("1. Add Student")
    print("2. Update Student")
    print("3. Delete Student")
    print("4. View Student by ID")
    print("5. List All Students")
    choice = input("Choose an option: ")

    if choice == '1':
        student_repository.add_student()
    elif choice == '2':
        student_repository.update_student()
    elif choice == '3':
        student_repository.delete_student()
    elif choice == '4':
        student_id=input("Enter Student Id:")
        student_data=student_repository.search_student(student_id)
        
        if student_data:

            print(f"Name: {student_data.get('name')}")
            print(f"Major: {student_data.get('major')}")
            print(f"Email: {student_data.get('email')}")

        else:
            print("Student not found.")




    elif choice == '5':
        student_repository.list_students()
