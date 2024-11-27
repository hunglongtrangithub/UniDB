import { supabase } from "./client";

export const getDepartments = async () => {
  const { data: departments, error: departmentsError } = await supabase
    .from("departments")
    .select("id, name, building, office");

  if (departmentsError) {
    console.error("Error fetching departments:", departmentsError.message);
    return null;
  }

  return departments;
};

export const getDepartmentById = async (departmentId: string) => {
  const { data: department, error: departmentError } = await supabase
    .from("departments")
    .select("id, name, building, office")
    .eq("id", departmentId)
    .single();

  if (departmentError) {
    console.error("Error fetching department:", departmentError.message);
    return null;
  }

  return department;
}

export const getDepartmentCourses = async (departmentId: string) => {
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, prefix, number, name, credits")
    .eq("department_id", departmentId);

  if (coursesError) {
    console.error("Error fetching department courses:", coursesError.message);
    return null;
  }

  return courses;
}

export const getDepartmentStaff = async (departmentId: string) => {
  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select(`
      id,
      users (
        first_name,
        last_name
      )
    `)
    .eq("department_id", departmentId).single();

  if (staffError) {
    console.error("Error fetching department staff:", staffError.message);
    return null;
  }
  console.log(staff);
  const staffData = {
    id: staff.id,
    first_name: staff.users.first_name,
    last_name: staff.users.last_name,
  }
  return staffData;
}

export const getDepartmentStudents = async (departmentId: string) => {
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select(`
      id,
      users (
        first_name,
        last_name
      ),
      university_number,
      majors (
        id,
        name,
        is_unique,
        department_id
      )
    `)
    .eq("majors.department_id", departmentId);

  if (studentsError) {
    console.error("Error fetching department students:", studentsError.message);
    return null;
  }

  const studentData = 
    students.map((student) => {
      return {
        id: student.id,
        university_number: student.university_number,
        first_name: student.users.first_name,
        last_name: student.users.last_name,
        major_id: student.major_id,
      };
    })
  return studentData;
}

export const getDepartmentInstructors = async (departmentId: string) => {
  const { data: instructors, error: instructorsError } = await supabase
    .from("instructors")
    .select(`
      id,
      users (
        first_name,
        last_name
      )
    `)
    .eq("department_id", departmentId);

  if (instructorsError) {
    console.error("Error fetching department instructors:", instructorsError.message);
    return null;
  }

  const instructorData = instructors.map((instructor) => {
      return {
        id: instructor.id,
        first_name: instructor.users.first_name,
        last_name: instructor.users.last_name,
      };
    })

  return instructorData;
}

export const getDepartmentAdvisors = async (departmentId: string) => {
  const { data: advisors, error: advisorsError } = await supabase
    .from("advisor_department")
    .select(`
      advisors (
        users (
          id,
          first_name,
          last_name
        )
      )
    `)
    .eq("department_id", departmentId);

  if (advisorsError) {
    console.error("Error fetching department advisors:", advisorsError.message);
    return null;
  }
  const advisorData = advisors.map((advisor) => {
    return {
      id: advisor.advisors.users.id,
      first_name: advisor.advisors.users.first_name,
      last_name: advisor.advisors.users.last_name,
    };
  });
  return advisorData;
}

export const getDepartmentMajors = async (departmentId: string) => {
  const { data: majors, error: majorsError } = await supabase
    .from("majors")
    .select("id, name, is_unique")
    .eq("department_id", departmentId);

  if (majorsError) {
    console.error("Error fetching department majors:", majorsError.message);
    return null;
  }

  return majors;
}