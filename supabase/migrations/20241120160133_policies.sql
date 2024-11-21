-- -- ENABLE ROW LEVEL SECURITY

-- -- Enable Row-Level Security (RLS) on relevant tables
-- ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.majors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.advisor_department ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.course_offerings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- -- NOTE: Assume that Supabase does not grant any privileges to the authenticated role on application-defined tables by default


-- -- STAFF POLICIES


-- -- 1. Allows staff to manage all data within their department only

-- -- Staff can view user_roles table
-- CREATE POLICY "staff_view_user_roles" ON public.user_roles
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
-- );

-- -- Staff can view users table
-- CREATE POLICY "staff_view_users" ON public.users
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
-- );

-- -- Staff can view majors table
-- CREATE POLICY "staff_view_majors" ON public.majors
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
-- );

-- -- Staff can manage courses in their department
-- CREATE POLICY "staff_manage_courses" ON public.courses
-- AS PERMISSIVE FOR ALL
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
--   AND EXISTS (
--     SELECT 1
--     FROM public.staff st
--     WHERE st.id = auth.uid() AND st.department_id = public.courses.department_id
--   )
-- );

-- -- Staff can manage instructors in their department
-- CREATE POLICY "staff_manage_instructors" ON public.instructors
-- AS PERMISSIVE FOR ALL
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
--   AND EXISTS (
--     SELECT 1
--     FROM public.staff st
--     WHERE st.id = auth.uid() AND st.department_id = public.instructors.department_id
--   )
-- );

-- -- Staff can manage students in their department
-- CREATE POLICY "staff_manage_students" ON public.students
-- AS PERMISSIVE FOR ALL
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
--   AND EXISTS (
--     SELECT 1
--     FROM public.majors m
--     JOIN public.staff st ON st.department_id = m.department_id
--     WHERE st.id = auth.uid() AND m.id = public.students.major_id
--   )
-- );

-- -- Staff can see the department they belong to
-- CREATE POLICY "staff_view_own_department" ON public.departments
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_department_data')
--   AND EXISTS (
--     SELECT 1
--     FROM public.staff st
--     WHERE st.id = auth.uid() AND st.department_id = public.departments.id
--   )
-- );

-- -- 2. Restricts staff from viewing or managing student course enrollments

-- -- Staff are restricted from accessing course enrollments
-- CREATE POLICY "staff_restrict_course_enrollments" ON public.course_enrollments
-- AS RESTRICTIVE FOR ALL
-- TO authenticated
-- USING (
--   authorize('cannot_see_course_enrollments')
-- );

-- -- 3. Allow staff to assign or change courses for an instructor to teach only if staff and instructor belong to the same department

-- -- Staff can select and insert into semesters table
-- CREATE POLICY "staff_view_semesters" ON public.semesters
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_courses_for_instructors')
-- );
-- CREATE POLICY "staff_insert_semesters" ON public.semesters
-- AS PERMISSIVE FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   authorize('manage_courses_for_instructors')
-- );

-- -- Staff are only allowed to update or insert in course offerings
-- CREATE POLICY "staff_insert_course_offerings" ON public.course_offerings
-- AS PERMISSIVE FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   authorize('manage_courses_for_instructors')
--   AND EXISTS (
--     SELECT 1
--     FROM public.staff st
--     JOIN public.instructors i ON st.department_id = i.department_id
--     WHERE st.id = auth.uid() AND i.id = public.course_offerings.instructor_id
--   )
-- );
-- CREATE POLICY "staff_update_course_offerings" ON public.course_offerings
-- AS PERMISSIVE FOR UPDATE
-- TO authenticated
-- WITH CHECK (
--   authorize('manage_courses_for_instructors')
--   AND EXISTS (
--     SELECT 1
--     FROM public.staff st
--     JOIN public.instructors i ON st.department_id = i.department_id
--     WHERE st.id = auth.uid() AND i.id = public.course_offerings.instructor_id
--   )
-- );


-- -- ADVISOR POLICIES


-- -- 1. Allows advisors to add or drop students in their department

-- -- Advisors can see all course offerings
-- -- NOTE: I assume that students can take courses of other majors
-- CREATE POLICY "advisor_view_course_offerings" ON public.course_offerings
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_student_enrollments')
-- );
-- -- Advisors can see students in their department
-- CREATE POLICY "advisor_view_students" ON public.students
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('manage_student_enrollments')
--   AND EXISTS (
--     SELECT 1
--     FROM public.advisors a
--     JOIN public.advisor_department a_d ON a.id = a_d.advisor_id
--     JOIN public.majors m ON a_d.department_id = m.department_id
--     WHERE a.id = auth.uid() AND m.id = public.students.major_id
--   )
-- );

-- -- Advisors can manage course enrollments of students in their department
-- CREATE POLICY "advisor_insert_course_enrollments" ON public.course_enrollments
-- AS PERMISSIVE FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   authorize('manage_student_enrollments')
--   AND EXISTS (
--     SELECT 1
--     FROM public.advisors a
--     JOIN public.advisor_department a_d ON a.id = a_d.advisor_id
--     JOIN public.majors m ON a_d.department_id = m.department_id
--     JOIN public.students s ON m.id = s.major_id
--     WHERE a.id = auth.uid() AND s.id = public.course_enrollments.student_id
--   )
-- );
-- CREATE POLICY "advisor_delete_course_enrollments" ON public.course_enrollments
-- AS PERMISSIVE FOR DELETE
-- TO authenticated
-- USING (
--   authorize('manage_student_enrollments')
--   AND EXISTS (
--     SELECT 1
--     FROM public.advisors a
--     JOIN public.advisor_department a_d ON a.id = a_d.advisor_id
--     JOIN public.majors m ON a_d.department_id = m.department_id
--     JOIN public.students s ON m.id = s.major_id
--     WHERE a.id = auth.uid() AND s.id = public.course_enrollments.student_id
--   )
-- );

-- -- 2. Allows advisors to perform What-If analysis for a student in their department

-- -- NOTE: I assume that a student can take courses of other majors
-- -- Advisors can view all courses
-- CREATE POLICY "advisor_view_courses" ON public.courses
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('perform_what_if_analysis')
-- );

-- -- Advisors can view all semesters
-- CREATE POLICY "advisor_view_semesters" ON public.semesters
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('perform_what_if_analysis')
-- );

-- -- Advisors can view course enrollments for students in their departments
-- CREATE POLICY "advisor_view_course_enrollments" ON public.course_enrollments
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('perform_what_if_analysis')
--   AND EXISTS (
--     SELECT 1
--     FROM public.advisors a 
--     JOIN public.advisor_department a_d ON a.id = a_d.advisor_id
--     JOIN public.majors m ON a_d.department_id = m.id
--     JOIN public.students s ON m.id = s.major_id
--     WHERE a.id = auth.uid() AND s.id = public.course_enrollments.student_id
--   )
-- );


-- -- STUDENT POLICIES


-- -- 1. Allows students to view only their own student records

-- -- 2. Allows students to perform What-If analysis

-- -- Students can view their own records
-- CREATE POLICY "student_view_own_record" ON public.students
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('access_student_own_data')
--   AND auth.uid() = public.students.id
-- );

-- -- Students can view their own course enrollments
-- CREATE POLICY "student_view_own_enrollments" ON public.course_enrollments
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   (authorize('access_student_own_data') OR authorize('perform_what_if_analysis'))
--   AND auth.uid() = public.course_enrollments.student_id
-- );

-- -- Student can view course offerings
-- CREATE POLICY "student_view_course_offerings" ON public.course_offerings
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   (authorize('access_student_own_data') OR authorize('perform_what_if_analysis'))
-- );

-- -- Student can view courses
-- CREATE POLICY "student_view_courses" ON public.courses
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   (authorize('access_student_own_data') OR authorize('perform_what_if_analysis'))
-- );

-- -- Student can view semesters
-- CREATE POLICY "student_view_semesters" ON public.semesters
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   (authorize('access_student_own_data') OR authorize('perform_what_if_analysis'))
-- );


-- -- INSTRUCTOR POLICIES


-- -- 1. Allows instructors to view their own records only

-- -- Instructors can view their own records
-- CREATE POLICY "instructor_view_own_record" ON public.instructors
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('access_instructor_own_data')
--   AND auth.uid() = public.instructors.id
-- );

-- -- 2. Allows instructors to view their own teaching data

-- -- Instructors can view their own course offerings
-- CREATE POLICY "instructor_view_courses" ON public.course_offerings
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('access_instructor_own_data')
--   AND auth.uid() = public.course_offerings.instructor_id
-- );

-- -- Instructors can view semesters
-- CREATE POLICY "instructor_view_semesters" ON public.semesters
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('access_instructor_own_data')
-- );

-- -- Instructors can view courses
-- CREATE POLICY "instructor_view_courses" ON public.courses
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('access_instructor_own_data')
-- );


-- -- SUMMARY REPORT POLICIES


-- -- Can see departments, majors, students, instructors, courses, semesters, course offerings, and course enrollments
-- CREATE POLICY "view_summary_reports_departments" ON public.departments
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('view_summary_reports')
-- );

-- CREATE POLICY "view_summary_reports_majors" ON public.majors
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('view_summary_reports')
-- );

-- CREATE POLICY "view_summary_reports_students" ON public.students
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('view_summary_reports')
-- );

-- CREATE POLICY "view_summary_reports_instructors" ON public.instructors
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('view_summary_reports')
-- );

-- CREATE POLICY "view_summary_reports_courses" ON public.courses
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('view_summary_reports')
-- );

-- CREATE POLICY "view_summary_reports_semesters" ON public.semesters
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   authorize('view_summary_reports')
-- );
