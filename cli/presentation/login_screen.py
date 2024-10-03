import requests
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv('API_BASE_URL')




def display_login():
    email = input("Enter email: ")
    password = input("Enter password: ")
    # Pass login details to Business Logic Layer

    #Authentication logic for passwords here to be done later

    response=requests.get(f"{BASE_URL}/students/{email}")

        
    if response.status_code==200:
        return True
        
    else:
        return False
    
  

