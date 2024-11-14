BEGIN;
SELECT plan(1);

-- Add users for testing
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES
('00000000-0000-0000-0000-000000000001', 'authenticated', '{"role": "student", "first_name": "John", "last_name": "Doe"}'),
('00000000-0000-0000-0000-000000000002', 'authenticated', '{"role": "instructor", "first_name": "Jane", "last_name": "Smith"}');

-- Add a dummy department
INSERT INTO public.departments (id, name, building, office)
OVERRIDING SYSTEM VALUE
VALUES (1, 'Computer Science', 'Science Building', 'Room 101');

-- Add a major using the department id
INSERT INTO public.majors (id, name, department_id, is_unique)
OVERRIDING SYSTEM VALUE
VALUES (1, 'Computer Science', 1, TRUE);

-- Add a course using the department id
INSERT INTO public.courses (id, prefix, number, name, credits, department_id)
OVERRIDING SYSTEM VALUE
VALUES (1, 'CS', '101', 'Introduction to Computer Science', 4, 1);

-- Add a semester
INSERT INTO public.semesters (id, year, season)
OVERRIDING SYSTEM VALUE
VALUES (1, 2024, 'F');

-- Add an instructor using the department id
INSERT INTO public.instructors (id, department_id)
VALUES ('00000000-0000-0000-0000-000000000002', 1);

-- Add a course offering using the course id, semester id, and instructor id 
INSERT INTO public.course_offerings (id, course_id, semester_id, instructor_id, schedule)
OVERRIDING SYSTEM VALUE
VALUES (1, 1, 1, '00000000-0000-0000-0000-000000000002', '{"days": "MW", "time": "10:00-11:00"}'::jsonb);

-- Add a student using the major id
INSERT INTO public.students (id, university_number, major_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'U12345678', 1);


-- TEST default value of grade in course_enrollments

-- (1) Check if the default value of grade in course_enrollments is "I"
INSERT INTO public.course_enrollments (student_id, course_offering_id)
VALUES ('00000000-0000-0000-0000-000000000001', 1);
SELECT is(
    (SELECT grade FROM public.course_enrollments WHERE student_id = '00000000-0000-0000-0000-000000000001'), 
    'I', 
    'Default value of grade in course_enrollments is "I"'
);