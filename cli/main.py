from presentation import student_dashboard, instructor_dashboard, login_screen


def display_menu():
    print("\nWelcome to the School Database CLI!")
    print("-------------------------------------")
    print("1. Student Dashboard")
    print("2. Instructor Dashboard")
    print("3. Exit")
    print("-------------------------------------")


def main():
    # Call the login screen at the start
    login_screen.display_login()

    while True:
        display_menu()
        choice = input("Please choose an option: ")

        if choice == "1":
            student_dashboard.student_dashboard()
        elif choice == "2":
            instructor_dashboard.instructor_dashboard()
        elif choice == "3":
            print("Exiting the application. Goodbye!")
            break
        else:
            print("Invalid option. Please choose again.")


if __name__ == "__main__":
    main()
