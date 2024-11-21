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
      course_offering_id,
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

export const getInstructorTeachingSchedule = async (instructorId: string) => {
  // get all course_offerings for instructor
  // join with courses to get course name
  // join with semesters to get year and season
  // join with rooms to get room number, building, and capacity
  // join with course_enrollments to get student count

  const { data: teachingSchedule, error } = await supabase
    .from("course_offerings")
    .select(
      `
      courses (name, prefix, number),
      semesters (year, season),
      schedule,
      rooms (room_number, building, capacity),
      course_enrollments (id)
    `,
    )
    .eq("instructor_id", instructorId);

  if (error) {
    console.error("Error fetching teaching schedule:", error.message);
    return null;
  }

  return teachingSchedule;
};

export const getInstructorCourseEnrollments = async (instructorId: string) => {
  // get all course_offerings for instructor
  // join with courses to get course name, prefix, and number
  // join with semesters to get year and season
  // join with course_enrollments to get student id, and grade
  // join students and users to get student first and last name

  const { data: courseEnrollments, error } = await supabase
    .from("course_offerings")
    .select(
      `
      courses (name, prefix, number),
      semesters (year, season),
      course_enrollments (
        students (
          university_number,
          users (first_name, last_name)
        ),
        grade
      )
    `,
    )
    .eq("instructor_id", instructorId);

  if (error) {
    console.error("Error fetching course enrollments:", error.message);
    return null;
  }

  return courseEnrollments;
};

// TODO: have a semesterId parameter to filter by semester
export const getCourseOfferings = async () => {
  const { data: courseOfferings, error } = await supabase
    .from("course_offerings")
    .select(
      `
      id,
      courses (name, prefix, number),
      semesters (year, season),
      rooms (capacity),
      course_enrollments (id)
    `,
    );

  if (error) {
    console.error("Error fetching course offerings:", error.message);
    return null;
  }

  return courseOfferings;
};
