import { supabase } from "./client";
import { getStudentCourseEnrollments } from "./courses";
import { calculateGPA } from "../utils/grades";

export const getAllMajors = async () => {
  const { data: majors, error } = await supabase
    .from("majors")
    .select("id, name, is_unique, departments(name)");

  if (error) {
    console.error("Error fetching majors:", error.message);
    return null;
  }

  return majors;
};

export const getAllSemesters = async () => {
  const { data: semesters, error } = await supabase
    .from("semesters")
    .select("*");

  if (error) {
    console.error("Error fetching semesters:", error.message);
    return null;
  }

  return semesters;
};

export const getGPAByMajor = async (majorId: string | null) => {
  try {
    const { data: students, error } = await supabase
      .from("students")
      .select("id")
      .eq("major_id", majorId || undefined);

    if (error) {
      console.error("Error fetching students:", error.message);
      return null;
    }

    const studentIds = students.map((student) => student.id);
    console.log(`Student IDs for major ID ${majorId}:`, studentIds);

    const gpaData = await Promise.all(
      studentIds.map(async (studentId) => {
        const enrollments = await getStudentCourseEnrollments(studentId);
        if (!enrollments) {
          console.warn(`No enrollments found for student ID: ${studentId}`);
          return null;
        }

        console.log(`Enrollments for student ID ${studentId}:`, enrollments);

        const grades = enrollments.map((enrollment) => ({
          credits: enrollment.course_offerings.courses.credits,
          grade: enrollment.grade,
        }));

        console.log(`Grades for student ID ${studentId}:`, grades);

        const gpa = calculateGPA(grades);
        return gpa !== null ? parseFloat(gpa.toFixed(2)) : null;
      }),
    );

    const validGpas = gpaData.filter((gpa) => gpa !== null) as number[];

    if (validGpas.length === 0) {
      console.warn(`No valid GPAs found for major ID: ${majorId}`);
      return null;
    }

    const highestGPA = parseFloat(Math.max(...validGpas).toFixed(2));
    const lowestGPA = parseFloat(Math.min(...validGpas).toFixed(2));
    const averageGPA = parseFloat(
      (validGpas.reduce((acc, gpa) => acc + gpa, 0) / validGpas.length).toFixed(
        2,
      ),
    );

    console.log(
      `Major ID: ${majorId}, Highest GPA: ${highestGPA}, Lowest GPA: ${lowestGPA}, Average GPA: ${averageGPA}`,
    );

    return { highestGPA, lowestGPA, averageGPA };
  } catch (error) {
    console.error("Unexpected error fetching GPA statistics:", error);
    return null;
  }
};
