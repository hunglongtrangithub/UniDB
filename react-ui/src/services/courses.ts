import { supabase } from "./client";

export const getStudentCourseEnrollments = async (studentId: string) => {
  // get all student enrollments from course_enrollments
  // join with course_offerings to get course_id
  // join with courses to get course credits
  // collect all grades and credits

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("course_enrollments")
    .select(
      `
      grade,
      course_offerings (
        courses (
          credits, name, prefix, number
        ),
        semesters (
          year, season
        )
      )
    `,
    )
    .eq("student_id", studentId);

  if (enrollmentsError) {
    console.error("Error fetching enrollments:", enrollmentsError.message);
    return null;
  }

  if (!enrollments) {
    console.error("No enrollments found for student:", studentId);
    return null;
  }
  return enrollments;
};

export const getCourses = async () => {
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*");

  if (coursesError) {
    console.error("Error fetching courses:", coursesError.message);
    return null;
  }

  if (!courses) {
    console.error("No courses found");
    return null;
  }

  return courses;
};
