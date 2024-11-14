-- Enforce that each department must have at least one unique major (Constraint 5.1)
CREATE UNIQUE INDEX unique_major_per_department ON public.majors (name, department_id) WHERE is_unique = TRUE;


-- Enforce that an instructor can teach courses of one department only (Constraint 3.1)
CREATE OR REPLACE FUNCTION enforce_instructor_department()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.instructors u
        JOIN public.courses c ON c.department_id = u.department_id
        WHERE u.id = NEW.instructor_id AND c.id = NEW.course_id
    ) THEN
        RAISE EXCEPTION 'Instructor can only teach courses from their own department';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER check_instructor_department
BEFORE INSERT OR UPDATE ON public.course_offerings
FOR EACH ROW EXECUTE FUNCTION enforce_instructor_department();


-- Trigger function to prevent students from enrolling in the same course twice in the same semester
CREATE OR REPLACE FUNCTION prevent_duplicate_course_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
$$;

CREATE TRIGGER check_duplicate_course_enrollment
BEFORE INSERT ON public.course_enrollments
FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_course_enrollment();
