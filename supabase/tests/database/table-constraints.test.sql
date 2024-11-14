BEGIN;
SELECT plan(6);

-- Add 2 departments
INSERT INTO public.departments (id, name, building, office)
OVERRIDING SYSTEM VALUE
VALUES (1, 'Computer Science', 'Science Building', 'Room 101');
INSERT INTO public.departments (id, name, building, office)
OVERRIDING SYSTEM VALUE
VALUES (2, 'Information Technology', 'Technology Building', 'Room 201');

-- Add user as instructor
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000001', 'authenticated', '{"role": "instructor", "first_name": "John", "last_name": "Doe"}');
-- Add the user as an instructor of the department Computer Science
INSERT INTO public.instructors (id, department_id)
OVERRIDING SYSTEM VALUE
VALUES ('00000000-0000-0000-0000-000000000001', 1);
-- Add a course to the department Computer Science
INSERT INTO public.courses (id, prefix, number, name, credits, department_id)
OVERRIDING SYSTEM VALUE
VALUES (1, 'CS', '101', 'Introduction to Computer Science', 4, 1);
-- Add a course to the department Information Technology
INSERT INTO public.courses (id, prefix, number, name, credits, department_id)
OVERRIDING SYSTEM VALUE
VALUES (2, 'IT', '101', 'Introduction to Information technology', 4, 2);
-- Add a semester
INSERT INTO public.semesters (id, year, season)
OVERRIDING SYSTEM VALUE
VALUES (1, 2024, 'F');


-- TEST unique major per department constraint

-- (1) the constraint should allow for 2 different majors being unique for 2 different departments

-- Add 2 majors to the departments, each major is unique per department
INSERT INTO public.majors (id, name, department_id, is_unique) 
OVERRIDING SYSTEM VALUE
VALUES (1, 'Computer Science', 1, TRUE);
INSERT INTO public.majors (id, name, department_id, is_unique)
OVERRIDING SYSTEM VALUE
VALUES (2, 'Information Technology', 2, TRUE);
SELECT pass('Unique major per department allowed');

-- (2) the constraint should raise an error for a duplicate major per department
PREPARE insert_duplicate_major AS 
INSERT INTO public.majors (id, name, department_id, is_unique) 
OVERRIDING SYSTEM VALUE
VALUES (3, 'Computer Science', 1, TRUE);
SELECT throws_ok('insert_duplicate_major', 23505); -- unique_violation


-- TEST instructor teaching courses of one department only constraint

-- (3) the constraint should allow an instructor to teach courses of one department only
-- Add a course offering using the course id, semester id, and instructor id 
INSERT INTO public.course_offerings (id, course_id, semester_id, instructor_id, schedule)
OVERRIDING SYSTEM VALUE
VALUES (1, 1, 1, '00000000-0000-0000-0000-000000000001', '{"days": "MW", "time": "10:00-11:00"}'::jsonb);
SELECT pass('Instructor teaching courses of one department allowed');

-- (4) where the constraint should raise an error for an instructor teaching courses of different department
PREPARE insert_course_offering_different_department AS
INSERT INTO public.course_offerings (course_id, semester_id, instructor_id, schedule)
OVERRIDING SYSTEM VALUE
VALUES (2, 1, '00000000-0000-0000-0000-000000000001', '{"days": "MW", "time": "10:00-11:00"}'::jsonb);
SELECT throws_ok(
    'insert_course_offering_different_department',
    'Instructor can only teach courses from their own department',
    'Instructor teaching courses of different department constraint violated'
);


-- TEST preventing duplicate course enrollment in the same semester

-- (5) should allow a student to enroll in a course in a semester
-- Make a student user
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000002', 'authenticated', '{"role": "student", "first_name": "Jane", "last_name": "Smith"}');
-- Add a student using the major Computer Science
INSERT INTO public.students (id, university_number, major_id)
OVERRIDING SYSTEM VALUE
VALUES ('00000000-0000-0000-0000-000000000002', 'U12345678', 1);
-- Make another instructor user
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES ('00000000-0000-0000-0000-000000000003', 'authenticated', '{"role": "instructor", "first_name": "Alice", "last_name": "Wonderland"}');
INSERT INTO public.course_enrollments (student_id, course_offering_id) VALUES ('00000000-0000-0000-0000-000000000002', 1);
SELECT pass('Student enrolling in a course allowed');

-- (6) the constraint should raise an error for a student enrolling in the same course twice in the same semester
-- Add the user as an instructor of the department Computer Science
INSERT INTO public.instructors (id, department_id)
OVERRIDING SYSTEM VALUE
VALUES ('00000000-0000-0000-0000-000000000003', 1);
-- Make a course offering using the Introduction to Computer Science course, the semester, and the new instructor
INSERT INTO public.course_offerings (id, course_id, semester_id, instructor_id, schedule)
OVERRIDING SYSTEM VALUE
VALUES (2, 1, 1, '00000000-0000-0000-0000-000000000003', '{"days": "MW", "time": "10:00-11:00"}'::jsonb);
PREPARE insert_duplicate_course_enrollment AS
INSERT INTO public.course_enrollments (student_id, course_offering_id) VALUES ('00000000-0000-0000-0000-000000000002', 1);
SELECT throws_ok(
    'insert_duplicate_course_enrollment',
    'Student cannot enroll in the same course twice in the same semester',
    'Duplicate course enrollment in the same semester constraint violated'
);

SELECT * FROM finish();
ROLLBACK;