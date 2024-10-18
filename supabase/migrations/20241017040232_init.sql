-- Create enums for USER_ROLE, GRADE, and SEASON
CREATE TYPE USER_ROLE AS ENUM ('STUDENT', 'INSTRUCTOR', 'STAFF', 'ADVISOR');
CREATE TYPE GRADE AS ENUM ('A', 'B', 'C', 'D', 'F', 'I', 'S', 'U');
CREATE TYPE SEASON AS ENUM ('FALL', 'SPRING', 'SUMMER');

-- Create the User table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role USER_ROLE NOT NULL
);

-- Create the Student table
CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
    university_number VARCHAR(255) NOT NULL CHECK (university_number ~ '^U[0-9]{8}$') UNIQUE,
    major_id INT NOT NULL REFERENCES public.majors (id)
);

-- Create the Instructor table
CREATE TABLE public.instructors (
    id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES public.departments (id)
);

-- Create the Advisor table
CREATE TABLE public.advisors (
    id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES public.departments (id)
);

-- Create the Staff table
CREATE TABLE public.staff (
    id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES public.departments (id)
);

-- Create the Major table
CREATE TABLE public.majors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    department_id INT REFERENCES public.departments (id)
);

-- Create the Department table
CREATE TABLE public.departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    building VARCHAR(255),
    unique_major_id INT REFERENCES public.majors (id) UNIQUE,
);

-- Create the Course table
CREATE TABLE public.courses (
    id SERIAL PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    number INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT CHECK (credits >= 1 AND credits <= 4), -- Ensure credits between 1 and 4
    department_id INT REFERENCES public.departments (id),
    UNIQUE (prefix, number)
);

-- Create the Semester table
CREATE TABLE public.semesters (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    season SEASON NOT NULL,
    UNIQUE (year, season)
);

-- Create the Enrollment table
CREATE TABLE public.enrollments (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES public.students (id),
    course_id INT REFERENCES public.courses (id),
    semester_id INT REFERENCES public.semesters (id),
    grade GRADE,
    UNIQUE (student_user_id, course_id, semester_id) -- Ensure a student can't enroll in the same course twice in the same semester
);

-- Create the TeachingAssignment table
CREATE TABLE public.teaching_assignments (
    id SERIAL PRIMARY KEY,
    instructor_user_id UUID REFERENCES public.instructors (id),
    course_id INT REFERENCES public.courses (id),
    semester_id INT REFERENCES public.semesters (id),
    UNIQUE (instructor_user_id, course_id, semester_id) -- Ensure an instructor can't teach the same course twice in the same semester
);

