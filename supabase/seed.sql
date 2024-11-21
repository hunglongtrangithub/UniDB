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

-- COURSES
INSERT INTO public.courses (prefix, number, name, credits, department_id)
VALUES 
('CS', '101', 'Introduction to Computer Science', 3, 1),
('CS', '102', 'Data Structures', 4, 1),
('CS', '103', 'Algorithms', 3, 1),
('IT', '101', 'Introduction to Information Technology', 3, 2),
('IT', '102', 'Networking', 4, 2),
('IT', '103', 'Database Systems', 3, 2),
('CY', '101', 'Introduction to Cybersecurity', 3, 3),
('CY', '102', 'Cryptography', 4, 3),
('CY', '103', 'Network Security', 3, 3);

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

