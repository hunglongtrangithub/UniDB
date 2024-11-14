BEGIN;
SELECT plan(4);

-- Add users for testing
INSERT INTO auth.users (id, role, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000001', 'authenticated', '{"role": "student", "first_name": "John", "last_name": "Doe"}');

-- Add a dummy department
INSERT INTO public.departments (id, name, building, office)
OVERRIDING SYSTEM VALUE
VALUES (1, 'Computer Science', 'Science Building', 'Room 101');

-- Add a major using the department id
INSERT INTO public.majors (id, name, department_id, is_unique)
OVERRIDING SYSTEM VALUE
VALUES (1, 'Computer Science', 1, TRUE);


-- TEST regex check for university number

-- (1) valid university number
INSERT INTO public.students (id, university_number, major_id) 
VALUES ('00000000-0000-0000-0000-000000000001', 'U12345678', 1);
SELECT is(
    (SELECT university_number FROM public.students WHERE id = '00000000-0000-0000-0000-000000000001'), 
    'U12345678', 
    'Valid university number: U12345678'
);

-- (2) invalid university number (too short)
PREPARE insert_student2 AS
INSERT INTO public.students (id, university_number, major_id)
VALUES ('00000000-0000-0000-0000-000000000002', 'U1234567', 1);
SELECT throws_ok(
    'insert_student2',
    23514
); -- check_violation

-- (3) invalid university number (too long)
PREPARE insert_student3 AS
INSERT INTO public.students (id, university_number, major_id)
VALUES ('00000000-0000-0000-0000-000000000003', 'U123456789', 1);
SELECT throws_ok(
    'insert_student3',
    22001 -- string_data_right_truncation
);

-- (4) invalid university number (wrong format)
PREPARE insert_student4 AS
INSERT INTO public.students (id, university_number, major_id)
VALUES ('00000000-0000-0000-0000-000000000004', 'A12345678', 1);
SELECT throws_ok(
    'insert_student4',
    23514 -- check_violation
);

-- Finish the tests
SELECT * FROM finish();
ROLLBACK;

