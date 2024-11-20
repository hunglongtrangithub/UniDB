import { createClient, AuthResponse } from "@supabase/supabase-js";

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const signUp = async (
  email: string,
  password: string,
  options?: { data: Record<string, any> },
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: options,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    throw new Error(error.message);
  }

  console.log("Sign-up session:", data);
  return { data, error: null };
};

export const logIn = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    throw new Error(error.message);
  }

  console.log("Log-in session:", data);
  return { data, error: null };
};

export const logOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
    throw new Error(error.message);
  }

  console.log("User logged out successfully.");
};
