import requests
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv("API_BASE_URL")


def handle_response(response):
    if response.status_code == 200:
        return True, response.json()
    else:
        try:
            error_message = response.json()
        except ValueError:
            error_message = response.text
        return False, {
            "status_code": response.status_code,
            "error_message": error_message,
        }


def add_student(student_id, name, gpa):
    url = f"{BASE_URL}/students"
    data = {"student_id": student_id, "name": name, "gpa": gpa}
    response = requests.post(url, json=data)
    return handle_response(response)


def update_student(student_id, name, gpa):
    url = f"{BASE_URL}/students/{student_id}"
    data = {"name": name, "gpa": gpa}
    response = requests.put(url, json=data)
    return handle_response(response)


def search_student(student_id):
    url = f"{BASE_URL}/students/{student_id}"
    response = requests.get(url)
    return handle_response(response)


def delete_student(student_id):
    url = f"{BASE_URL}/students/{student_id}"
    response = requests.delete(url)
    return handle_response(response)


def list_students():
    url = f"{BASE_URL}/students"
    response = requests.get(url)
    return handle_response(response)


if __name__ == "__main__":
    print(list_students())
    print(add_student("123", "John Doe", 3.5))
    print(search_student("123"))
    print(delete_student("123"))
    print(list_students())
