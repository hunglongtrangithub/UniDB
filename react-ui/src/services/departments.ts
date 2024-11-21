import { supabase } from "./client";

export const getDepartments = async () => {
  const { data: departments, error: departmentsError } = await supabase
    .from("departments")
    .select("id, name");

  if (departmentsError) {
    console.error("Error fetching departments:", departmentsError.message);
    return null;
  }

  return departments;
};