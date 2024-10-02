from business_logic import student_management

def student_dashboard():
    print("1. Add Student")
    print("2. Update Student")
    print("3. Delete Student")
    print("4. View Student by ID")
    print("5. List All Students")
    choice = input("Choose an option: ")

    if choice == '1':
        student_management.add_student()
    elif choice == '2':
        student_management.update_student()
    elif choice == '3':
        student_management.delete_student()
    elif choice == '4':
        student_management.view_student()
    elif choice == '5':
        student_management.list_students()
