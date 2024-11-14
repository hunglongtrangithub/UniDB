BEGIN;
SELECT plan(1);

-- Add users for testing
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES
('00000000-0000-0000-0000-000000000001', 'authenticated', '{"role": "student", "first_name": "John", "last_name": "Doe"}'),
('00000000-0000-0000-0000-000000000002', 'authenticated', '{"role": "instructor", "first_name": "Jane", "last_name": "Smith"}');

-- Add a dummy department
INSERT INTO public.departments (name, building, office)
VALUES ('Computer Science', 'Science Building', 'Room 101');

-- Add a major using the department id
INSERT INTO public.majors (name, department_id, is_unique)
VALUES ('Computer Science', (SELECT id FROM public.departments WHERE name = 'Computer Science'), TRUE);
-- Add a course using the department id
INSERT INTO public.courses (prefix, number, name, credits, department_id)
VALUES ('CS', '101', 'Introduction to Computer Science', 4, (SELECT id FROM public.departments WHERE name = 'Computer Science'));

-- Add a semester
INSERT INTO public.semesters (year, season)
VALUES (2024, 'F');

-- Add an instructor using the department id
INSERT INTO public.instructors (id, department_id)
VALUES ('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.departments WHERE name = 'Computer Science'));

-- Add a course offering using the course id, semester id, and instructor id 
INSERT INTO public.course_offerings (course_id, semester_id, instructor_id, schedule)
VALUES (
    (SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '101'), 
    (SELECT id FROM public.semesters WHERE year = 2024 AND season = 'F'), 
    '00000000-0000-0000-0000-000000000002',
    '{"days": "MW", "time": "10:00-11:00"}'::jsonb
);

-- Add a student using the major id
INSERT INTO public.students (id, university_number, major_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'U12345678', (SELECT id FROM public.majors WHERE name = 'Computer Science'));


-- TEST default value of grade in course_enrollments

-- (1) Check if the default value of grade in course_enrollments is "I"
INSERT INTO public.course_enrollments (student_id, course_offering_id)
VALUES ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '101') AND semester_id = (SELECT id FROM public.semesters WHERE year = 2024 AND season = 'F')));
SELECT is(
    (SELECT grade FROM public.course_enrollments WHERE student_id = '00000000-0000-0000-0000-000000000001'), 
    'I', 
    'Default value of grade in course_enrollments is "I"'
);