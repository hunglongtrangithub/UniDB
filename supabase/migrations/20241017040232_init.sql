-- TODO: think about ON DELETE conditions for the foreign keys in this schema
CREATE TYPE USER_ROLE AS ENUM ('STUDENT', 'INSTRUCTOR', 'STAFF', 'ADVISOR');
-- Define acceptable grades for courses (Constraint 2.4)
CREATE TYPE GRADE AS ENUM ('A', 'B', 'C', 'D', 'F', 'I', 'S', 'U');
-- Define seasons for semesters (Constraint 2.5)
CREATE TYPE SEASON AS ENUM ('F', 'S', 'U'); -- Fall, Spring, Summer


CREATE TABLE public.departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    building NVARCHAR(255),
    office VARCHAR(255),

    -- Each department can be located in the same building but different office (Constraint 5.2)
    UNIQUE (building, office)
);


CREATE TABLE public.majors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    -- Major >--- Department (from Requirement 2: "if the advisor and the student's major belong to the same department"). Assume one major belongs to one department only.
    department_id INT NOT NULL REFERENCES public.departments (id) ON DELETE CASCADE,
    -- Departments must offer at least one unique major program (Constraint 5.1)
    is_unique BOOLEAN NOT NULL DEFAULT FALSE,

    -- TODO: test if this partial index feature actually works
    -- Enforce only one unique major per department
    CONSTRAINT unique_major_per_department UNIQUE (department_id) WHERE (is_unique = TRUE)
);

-- Enforce that each department must have at least one unique major (Constraint 5.1)
CREATE OR REPLACE FUNCTION enforce_one_unique_major_per_department()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there's already a unique major in the department
    IF (NEW.is_unique = TRUE) THEN
        IF EXISTS (
            SELECT 1 FROM public.majors
            WHERE department_id = NEW.department_id
            AND is_unique = TRUE
            AND id != NEW.id
        ) THEN
            RAISE EXCEPTION 'Only one unique major is allowed per department';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce the above function
CREATE TRIGGER check_unique_major
BEFORE INSERT OR UPDATE ON public.majors
FOR EACH ROW EXECUTE FUNCTION enforce_one_unique_major_per_department();


CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    -- Users can be students, instructors, staff, or advisors
    role USER_ROLE NOT NULL,

    -- For students only
    -- Student IDs start with 'U' followed by 8 digits (from Constraint 7.B: "any student ID that does not begin with a letter 'U' violates student ID value integrity")
    university_number VARCHAR(9) CHECK (university_number ~ '^U[0-9]{8}$') UNIQUE,
    -- Students must have a major (from Constraint 2.1: "Are all assumed to have only one major")
    major_id INT REFERENCES public.majors (id),

    -- For staff, advisors, and instructors only
    -- Advisor >---< Department (from Requirement 2: "if the advisor and the student's major belong to the same department" and Constraint 6: "advisors can work for more than one department")
    -- Staff >--- Department (from Requirement 1: "Staff...the department they belong to" and Constraint 6: "no staffs are allowed to work for more than one department")
    -- Instructor >--- Department (from Requirement 1: "if the staff and instructor belong to the same department" and Constraint 3.1: "Can be hired to teach courses of one department only")
    department_id INT REFERENCES public.departments (id),

    -- Enforce role-based column constraints: NULL on columns that are not applicable to the role, and NOT NULL on columns that are applicable
    CONSTRAINT by_role_columns_check CHECK (
        (role = 'STUDENT' AND department_id IS NULL AND university_number IS NOT NULL AND major_id IS NOT NULL) OR
        (role IN ('INSTRUCTOR', 'STAFF', 'ADVISOR') AND major_id IS NULL AND university_number IS NULL AND department_id IS NOT NULL)
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


-- Advisors can work for more than one department (from Constraint 6: "advisors can work for more than one department")
CREATE TABLE public.advisor_department (
    advisor_id UUID REFERENCES public.users (id) ON DELETE CASCADE,
    department_id INT REFERENCES public.departments (id) ON DELETE CASCADE,
    PRIMARY KEY (advisor_id, department_id)
);


-- Courses offered by departments
CREATE TABLE public.courses (
    id SERIAL PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    number VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    -- Course credits are between 1 and 4 (Constraint 4.1)
    credits INT NOT NULL CHECK (credits >= 1 AND credits <= 4),
    -- Course >--- Department (from Requirement 1: "courses, instructors, students, and everything about the department they belong to"). Assume one course belongs to one department only.
    department_id NOT NULL INT REFERENCES public.departments (id),
    -- Ensure uniqueness of course prefix and number (from Constraint 7.G: "every course is uniquely identified by its prefix and number together")
    UNIQUE (prefix, number)
);


CREATE TABLE public.semesters (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    season SEASON NOT NULL,
    UNIQUE (year, season) -- Prevent duplicate semesters
);


-- Specific offerings of courses in semesters
-- Enforce that an instructor cannot teach the same course twice in the same semester (Constraint B.2)
CREATE TABLE public.course_offerings (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    semester_id INT NOT NULL REFERENCES public.semesters(id),
    instructor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    -- Schedule information is needed for each course offering (from Constraint 3.3: "Cannot teach courses with overlapped class time in the same semester.")
    schedule JSONB NOT NULL, -- e.g., {"days": "MW", "time": "10:00-11:00"}
    location VARCHAR(255),

    -- Verify that the instructor is actually an instructor
    CONSTRAINT instructor_must_be_instructor CHECK (
        (SELECT role FROM public.users WHERE id = instructor_id) = 'INSTRUCTOR'
    ),

    -- Prevent instructor from teaching the same course twice in the same semester (from Constraint 3.2: "Cannot teach the same course twice in the same semester.")
    CONSTRAINT unique_instructor_course_semester UNIQUE (semester_id, course_id, instructor_id)
);

-- Enforce that an instructor can teach courses of one department only (Constraint 3.1)
CREATE OR REPLACE FUNCTION enforce_instructor_department()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.users u
        JOIN public.courses c ON c.department_id = u.department_id
        WHERE u.id = NEW.instructor_id AND c.id = NEW.course_id
    ) THEN
        RAISE EXCEPTION 'Instructor can only teach courses from their own department';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before insert or update
CREATE TRIGGER check_instructor_department
BEFORE INSERT OR UPDATE ON public.course_offerings
FOR EACH ROW EXECUTE FUNCTION enforce_instructor_department();


-- Students' enrollments in course offerings
CREATE TABLE public.course_enrollments (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    -- This satisfies Constraint 2.3 ("May repeat a course in a different semester."), because two course_offerings can have the same course_id but different semester_ids.
    course_offering_id INT NOT NULL REFERENCES public.course_offerings(id) ON DELETE RESTRICT,
    -- Grades must be one of the defined types (Constraint 2.4: "May receive a grade of A, B, C, D, F, I (for incomplete), S (for satisfied), or U (for unsatisfied) and no others.")
    grade GRADE,
    UNIQUE (student_id, course_offering_id), -- Prevent duplicate enrollments
    
    -- Verify that the user is a student
    CONSTRAINT student_must_be_student CHECK (
        (SELECT role FROM public.users WHERE id = student_id) = 'STUDENT'
    )
);

-- Trigger function to prevent students from enrolling in the same course twice in the same semester (Constraint 2.2: "Cannot take the same course twice in the same semester.")
CREATE OR REPLACE FUNCTION prevent_duplicate_course_enrollment()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.course_enrollments ce
        JOIN public.course_offerings co ON ce.course_offering_id = co.id
        WHERE ce.student_id = NEW.student_id
        AND co.course_id = (SELECT course_id FROM public.course_offerings WHERE id = NEW.course_offering_id)
        AND co.semester_id = (SELECT semester_id FROM public.course_offerings WHERE id = NEW.course_offering_id)
    ) THEN
        RAISE EXCEPTION 'Student cannot enroll in the same course twice in the same semester';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce the above function
CREATE TRIGGER check_duplicate_course_enrollment
BEFORE INSERT ON public.course_enrollments
FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_course_enrollment();
