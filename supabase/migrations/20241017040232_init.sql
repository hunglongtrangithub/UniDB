CREATE TYPE USER_ROLE AS ENUM ('STUDENT', 'INSTRUCTOR', 'STAFF', 'ADVISOR');
CREATE TYPE GRADE AS ENUM ('A', 'B', 'C', 'D', 'F', 'I', 'S', 'U');
CREATE TYPE SEASON AS ENUM ('F', 'S', 'U'); -- Fall, Spring, Summer

-- Create the departments table
CREATE TABLE public.departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    building VARCHAR(255),
    office VARCHAR(255),
    UNIQUE (building, office) -- Make sure each department has its own office location
);

-- Create the Majors table with an is_unique column to mark the unique major for each department
CREATE TABLE public.majors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    department_id INT NOT NULL REFERENCES public.departments (id) ON DELETE CASCADE,
    is_unique BOOLEAN NOT NULL DEFAULT FALSE
);

-- Trigger function to enforce one unique major per department
CREATE OR REPLACE FUNCTION enforce_one_unique_major_per_department()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there is already a row with is_unique = TRUE for the same department
    IF (NEW.is_unique = TRUE) THEN
        IF EXISTS (
            SELECT 1 FROM public.majors
            WHERE department_id = NEW.department_id
            AND is_unique = TRUE
            AND id != NEW.id  -- Exclude the current row for updates
        ) THEN
            RAISE EXCEPTION 'Only one unique major is allowed per department';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on the majors table to enforce one unique major per department
CREATE TRIGGER check_unique_major
BEFORE INSERT OR UPDATE ON public.majors
FOR EACH ROW EXECUTE FUNCTION enforce_one_unique_major_per_department();
Create the users table with role-based fields

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role USER_ROLE NOT NULL,

    -- For students only
    university_number VARCHAR(255) CHECK (university_number ~ '^U[0-9]{8}$') UNIQUE,
    major_id INT REFERENCES public.majors (id),

    -- For staff, advisor, and instructors only
    department_id INT REFERENCES public.departments (id),

    -- Add a CHECK constraint to enforce role-based column nullability
    -- For a user, the other columns irrelevant to the user's role must be all NULL
    CONSTRAINT by_role_columns_check CHECK (
        (role = 'STUDENT' AND department_id IS NULL) OR

        (role IN ('INSTRUCTOR', 'STAFF', 'ADVISOR') AND major_id IS NULL AND university_number IS NULL)
    )
);

-- Inserts a row into public.profiles
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, role)
  VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name',
      (NEW.raw_user_meta_data ->> 'role')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TABLE public.advisor_department (
    advisor_id UUID REFERENCES public.users (id) ON DELETE CASCADE, -- Advisor ID (user role = 'ADVISOR')
    department_id INT REFERENCES public.departments (id) ON DELETE CASCADE, -- Department ID

    -- Composite primary key
    PRIMARY KEY (advisor_id, department_id)
);

-- Create the courses table
CREATE TABLE public.courses (
    id SERIAL PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    number VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,

    -- These columns do not need to have the NOT NULL constraint
    credits INT CHECK (credits >= 1 AND credits <= 4),
    department_id INT REFERENCES public.departments (id),
    UNIQUE (prefix, number) -- Ensure course prefix and number are unique
);

-- Create the semesters table
CREATE TABLE public.semesters (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    season SEASON NOT NULL,
    UNIQUE (year, season) -- Ensure no duplicate year and season combinations
);

-- Create course_participation table
CREATE TABLE public.course_participation (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users (id), -- Either student or instructor
    course_id INT NOT NULL REFERENCES public.courses (id),
    semester_id INT NOT NULL REFERENCES public.semesters (id),

    -- For students: grade information
    grade GRADE,

    -- For instructors: mark if they are teaching the course
    is_instructor BOOLEAN NOT NULL DEFAULT FALSE,

    UNIQUE (user_id, course_id, semester_id), -- Ensure unique participation for a course/semester

    -- Add a constraint to ensure that grade is NULL when is_instructor is TRUE
    CONSTRAINT grade_instructor_check CHECK (
        (is_instructor = FALSE) OR
        (grade IS NULL AND is_instructor = TRUE)
    )
);

