import { supabase } from "./client";

export const getStudentInfo = async (studentId: string) => {
  // get university number, id, and major id
  // join with users table to get first name, last name
  // join with majors table to get major name
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select(
      `
      university_number,
      users (
        first_name, last_name
      ),
      majors (
        name
      )
    `,
    )
    .eq("id", studentId).single();

  if (studentError) {
    console.error("Error fetching student:", studentError.message);
    return null;
  }
  console.log(student.majors.name);
  const studentInfo = {
    university_number: student.university_number,
    first_name: student.users.first_name,
    last_name: student.users.last_name,
    major: student.majors.name,
  };
  return studentInfo;
};
