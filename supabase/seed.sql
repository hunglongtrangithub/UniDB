-- DEPARTMENTS
-- add 3 departments to public.departments (Computer Science, Information Technology, Cybersecurity)
-- MAJORS
-- add 3 majors to public.majors (Computer Science, Information Technology, Cybersecurity)
-- 1 major for each department

-- USERS
-- add users to auth.users
-- 3 for each role (total 12 users)
-- STUDENTS
-- add 3 students with 3 random university numbers to 3 majors
-- add to table public.students
-- INSTRUCTORS: 
-- add 3 instructors to 3 departments
-- add to table public.instructors
-- ADVISORS: 
-- add 3 advisors to 3 departments
-- add to table public.advisors first, then add to table public.advisor_department with the department_id
-- STAFF: add 3 staff
-- add 3 staff to 3 departments
-- add to table public.staff

-- COURSES
-- add 3 courses to each department (total 9 courses)
-- add to table public.courses

-- SEMESTERS
-- add 1 semester to public.semesters: (2024, 'F')

-- ROOMS
-- add 3 rooms to each department (total 9 rooms)
-- add to table public.rooms (building, room_number, capacity)

-- COURSE OFFERINGS
-- each instructor should be teaching 3 courses in their department
-- add 1 course offering for each course in the semester (total 9 course offerings)
-- add to table public.course_offerings

-- COURSE ENROLLMENTS
-- add 3 course enrollments for each student (total 9 course enrollments)
-- each student should be enrolled in 3 courses in their major
-- add to table public.course_enrollments


-- DEPARTMENTS
INSERT INTO public.departments (name, building, office)
VALUES 
('Computer Science', 'Science Building', 'Room 101'),
('Information Technology', 'Technology Building', 'Room 201'),
('Cybersecurity', 'Security Building', 'Room 301');

-- MAJORS
INSERT INTO public.majors (name, department_id, is_unique)
VALUES 
('Computer Science', 1, TRUE),
('Information Technology', 2, TRUE),
('Cybersecurity', 3, TRUE);

-- USERS
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000001', 'authenticated', '{"role": "student", "first_name": "Alice", "last_name": "Smith"}'),
('00000000-0000-0000-0000-000000000002', 'authenticated', '{"role": "student", "first_name": "Bob", "last_name": "Johnson"}'),
('00000000-0000-0000-0000-000000000003', 'authenticated', '{"role": "student", "first_name": "Charlie", "last_name": "Brown"}'),
('00000000-0000-0000-0000-000000000004', 'authenticated', '{"role": "instructor", "first_name": "David", "last_name": "Williams"}'),
('00000000-0000-0000-0000-000000000005', 'authenticated', '{"role": "instructor", "first_name": "Eve", "last_name": "Davis"}'),
('00000000-0000-0000-0000-000000000006', 'authenticated', '{"role": "instructor", "first_name": "Frank", "last_name": "Miller"}'),
('00000000-0000-0000-0000-000000000007', 'authenticated', '{"role": "advisor", "first_name": "Grace", "last_name": "Wilson"}'),
('00000000-0000-0000-0000-000000000008', 'authenticated', '{"role": "advisor", "first_name": "Hank", "last_name": "Moore"}'),
('00000000-0000-0000-0000-000000000009', 'authenticated', '{"role": "advisor", "first_name": "Ivy", "last_name": "Taylor"}'),
('00000000-0000-0000-0000-000000000010', 'authenticated', '{"role": "staff", "first_name": "Jack", "last_name": "Anderson"}'),
('00000000-0000-0000-0000-000000000011', 'authenticated', '{"role": "staff", "first_name": "Karen", "last_name": "Thomas"}'),
('00000000-0000-0000-0000-000000000012', 'authenticated', '{"role": "staff", "first_name": "Leo", "last_name": "Jackson"}');

-- STUDENTS
INSERT INTO public.students (id, university_number, major_id)
VALUES 
('00000000-0000-0000-0000-000000000001', 'U12345678', 1),
('00000000-0000-0000-0000-000000000002', 'U23456789', 2),
('00000000-0000-0000-0000-000000000003', 'U34567890', 3);

-- INSTRUCTORS
INSERT INTO public.instructors (id, department_id)
VALUES 
('00000000-0000-0000-0000-000000000004', 1),
('00000000-0000-0000-0000-000000000005', 2),
('00000000-0000-0000-0000-000000000006', 3);

-- ADVISORS
INSERT INTO public.advisors (id)
VALUES 
('00000000-0000-0000-0000-000000000007'),
('00000000-0000-0000-0000-000000000008'),
('00000000-0000-0000-0000-000000000009');

INSERT INTO public.advisor_department (advisor_id, department_id)
VALUES 
('00000000-0000-0000-0000-000000000007', 1),
('00000000-0000-0000-0000-000000000008', 2),
('00000000-0000-0000-0000-000000000009', 3);

-- STAFF
INSERT INTO public.staff (id, department_id)
VALUES 
('00000000-0000-0000-0000-000000000010', 1),
('00000000-0000-0000-0000-000000000011', 2),
('00000000-0000-0000-0000-000000000012', 3);

-- COURSES
INSERT INTO public.courses (prefix, number, name, credits, department_id)
VALUES 
('CS', '101', 'Introduction to Computer Science', 4, 1),
('CS', '102', 'Data Structures', 4, 1),
('CS', '103', 'Algorithms', 4, 1),
('IT', '101', 'Introduction to Information Technology', 4, 2),
('IT', '102', 'Networking', 4, 2),
('IT', '103', 'Database Systems', 4, 2),
('CY', '101', 'Introduction to Cybersecurity', 4, 3),
('CY', '102', 'Cryptography', 4, 3),
('CY', '103', 'Network Security', 4, 3);

-- SEMESTERS
INSERT INTO public.semesters (year, season)
VALUES (2024, 'F');

-- ROOMS
INSERT INTO public.rooms (building, room_number, capacity)
VALUES 
('Science Building', '101', 30),
('Science Building', '102', 25),
('Science Building', '103', 20),
('Technology Building', '201', 30),
('Technology Building', '202', 25),
('Technology Building', '203', 20),
('Security Building', '301', 30),
('Security Building', '302', 25),
('Security Building', '303', 20);

-- COURSE OFFERINGS
INSERT INTO public.course_offerings (course_id, semester_id, instructor_id, schedule, room_id)
VALUES 
((SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '101'), 1, '00000000-0000-0000-0000-000000000004', '{"days": "MW", "time": "10:00-11:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Science Building' AND room_number = '101')),
((SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '102'), 1, '00000000-0000-0000-0000-000000000004', '{"days": "MW", "time": "11:00-12:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Science Building' AND room_number = '102')),
((SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '103'), 1, '00000000-0000-0000-0000-000000000004', '{"days": "MW", "time": "12:00-13:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Science Building' AND room_number = '103')),
((SELECT id FROM public.courses WHERE prefix = 'IT' AND number = '101'), 1, '00000000-0000-0000-0000-000000000005', '{"days": "TR", "time": "10:00-11:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Technology Building' AND room_number = '201')),
((SELECT id FROM public.courses WHERE prefix = 'IT' AND number = '102'), 1, '00000000-0000-0000-0000-000000000005', '{"days": "TR", "time": "11:00-12:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Technology Building' AND room_number = '202')),
((SELECT id FROM public.courses WHERE prefix = 'IT' AND number = '103'), 1, '00000000-0000-0000-0000-000000000005', '{"days": "TR", "time": "12:00-13:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Technology Building' AND room_number = '203')),
((SELECT id FROM public.courses WHERE prefix = 'CY' AND number = '101'), 1, '00000000-0000-0000-0000-000000000006', '{"days": "WF", "time": "10:00-11:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Security Building' AND room_number = '301')),
((SELECT id FROM public.courses WHERE prefix = 'CY' AND number = '102'), 1, '00000000-0000-0000-0000-000000000006', '{"days": "WF", "time": "11:00-12:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Security Building' AND room_number = '302')),
((SELECT id FROM public.courses WHERE prefix = 'CY' AND number = '103'), 1, '00000000-0000-0000-0000-000000000006', '{"days": "WF", "time": "12:00-13:00"}'::jsonb, (SELECT id FROM public.rooms WHERE building = 'Security Building' AND room_number = '303'));

-- COURSE ENROLLMENTS
INSERT INTO public.course_enrollments (student_id, course_offering_id)
VALUES 
('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '101'))),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '102'))),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CS' AND number = '103'))),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'IT' AND number = '101'))),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'IT' AND number = '102'))),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'IT' AND number = '103'))),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CY' AND number = '101'))),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CY' AND number = '102'))),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM public.course_offerings WHERE course_id = (SELECT id FROM public.courses WHERE prefix = 'CY' AND number = '103')));
