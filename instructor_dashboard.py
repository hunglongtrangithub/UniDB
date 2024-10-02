from business_logic import instructor_management

def instructor_dashboard():
    print("\nInstructor Dashboard")
    print("--------------------------")
    print("1. Add Instructor")
    print("2. Update Instructor")
    print("3. Delete Instructor")
    print("4. View Instructor by ID")
    print("5. List All Instructors")
    print("6. Back to Main Menu")
    
    choice = input("Choose an option: ")

    if choice == '1':
        instructor_management.add_instructor()
    elif choice == '2':
        instructor_management.update_instructor()
    elif choice == '3':
        instructor_management.delete_instructor()
    elif choice == '4':
        instructor_management.view_instructor()
    elif choice == '5':
        instructor_management.list_instructors()
    elif choice == '6':
        print("Returning to Main Menu.")
    else:
        print("Invalid choice, please try again.")
