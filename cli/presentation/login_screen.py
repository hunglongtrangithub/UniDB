import requests
import os
from dotenv import load_dotenv
from data_access import student_repository

load_dotenv()

BASE_URL = os.getenv('API_BASE_URL')




def display_login():
    Student_ID = input("Enter Student ID ")
    password = input("Enter password: ")
    # Pass login details to Business Logic Layer

    #Authentication logic for passwords here to be done later

    if student_repository.student_repository(Student_ID)==True:
        return True
    else:
        return False

    
  

