import requests


from data_access import student_repository


def display_login():
    Student_ID = input("Enter Student ID ")
    password = input("Enter password: ")
    # Pass login details to Business Logic Layer

    # Authentication logic for passwords here to be done later

    if student_repository.search_student(Student_ID):
        return True
    else:
        return False
