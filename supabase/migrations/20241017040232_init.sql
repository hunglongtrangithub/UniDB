CREATE TYPE public.grade AS ENUM ('A', 'B', 'C', 'D', 'F', 'I', 'S', 'U');
CREATE TYPE public.season AS ENUM ('F', 'S', 'U');  -- Fall, Spring, Summer

-- TABLES FOR APPLICATIONS

CREATE TABLE public.departments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE,
  building NVARCHAR(255),
  office VARCHAR(255),

  UNIQUE (building, office)
);

CREATE TABLE public.majors (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE,
  department_id BIGINT NOT NULL REFERENCES public.departments (id) ON DELETE RESTRICT,
  is_unique BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  university_number VARCHAR(9) UNIQUE CHECK (university_number ~ '^U[0-9]{8}$'),
  major_id BIGINT NOT NULL REFERENCES public.majors (id) ON DELETE RESTRICT
);

CREATE TABLE public.instructors (
  id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  department_id BIGINT NOT NULL REFERENCES public.departments (id) ON DELETE RESTRICT
);

CREATE TABLE public.advisors (
  id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
);
-- Advisors can work for more than one department
CREATE TABLE public.advisor_department (
  advisor_id UUID REFERENCES public.advisors (id) ON DELETE CASCADE,
  department_id BIGINT REFERENCES public.departments (id) ON DELETE CASCADE,
  PRIMARY KEY (advisor_id, department_id)
);

CREATE TABLE public.staff (
  id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  department_id BIGINT NOT NULL REFERENCES public.departments (id) ON DELETE RESTRICT
);

CREATE TABLE public.courses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  prefix VARCHAR(10) NOT NULL,
  number VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  credits INT NOT NULL CHECK (credits >= 1 AND credits <= 4),
  department_id NOT NULL BIGINT REFERENCES public.departments (id) ON DELETE RESTRICT,
  UNIQUE (prefix, number)
);

CREATE TABLE public.semesters (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  year INT NOT NULL,
  season SEASON NOT NULL,
  UNIQUE (year, season)
);

CREATE TABLE public.course_offerings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  course_id BIGINT NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  semester_id BIGINT NOT NULL REFERENCES public.semesters(id) ON DELETE RESTRICT,
  instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE RESTRICT,
  schedule JSONB NOT NULL, -- e.g., {"days": "MW", "time": "10:00-11:00"}

  CONSTRAINT unique_instructor_course_semester UNIQUE (semester_id, course_id, instructor_id)
);

CREATE TABLE public.course_enrollments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  course_offering_id BIGINT NOT NULL REFERENCES public.course_offerings(id) ON DELETE RESTRICT,
  grade public.grade DEFAULT 'I'::public.grade,
  UNIQUE (student_id, course_offering_id)
);

-- Create custom types for roles and permissions
CREATE TYPE public.app_role AS ENUM ('student', 'instructor', 'advisor', 'staff');
CREATE TYPE public.app_permission AS ENUM (
  'manage_department_data',
  'cannot_see_course_enrollments',
  'manage_courses_for_instructors',
  'manage_student_enrollments',
  'perform_what_if_analysis',
  'access_student_own_data',
  'access_instructor_own_data',
  'view_summary_reports'
);

-- TABLES FOR ROLES AND PERMISSIONS
-- permission represents an action regardless of role

-- NOTE: One user has one role only
CREATE TABLE public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  role public.app_role NOT NULL
);

-- NOTE: One role can have one or more permissions and vice versa
CREATE TABLE public.role_permissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role public.app_role NOT NULL,
  permission public.app_permission NOT NULL,
  UNIQUE (role, permission)
);

-- ASSIGN PERMISSIONS TO ROLES

-- Staff
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('staff', 'manage_department_data'),
  ('staff', 'cannot_see_course_enrollments'),
  ('staff', 'manage_courses_for_instructors'),
  -- Only staff can view summary reports
  ('staff', 'view_summary_reports');

-- Advisor
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('advisor', 'manage_student_enrollments'),
  ('advisor', 'perform_what_if_analysis');
  ('advisor', 'access_student_own_data');

-- Student
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('student', 'access_student_own_data'),
  ('student', 'perform_what_if_analysis');

-- Instructor
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('instructor', 'access_instructor_own_data');
  