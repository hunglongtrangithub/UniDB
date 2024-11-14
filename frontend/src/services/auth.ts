import { createClient, AuthResponse } from "@supabase/supabase-js";

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sign up a new user with email and password.
 * @param email - User email
 * @param password - User password
 * @returns AuthResponse - The session data if sign-up is successful, or an error if failed.
 */
export const signUp = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    throw new Error(error.message);
  }

  console.log("Sign-up session:", data);
  return { data, error: null };
};

/**
 * Log in an existing user with email and password.
 * @param email - User email
 * @param password - User password
 * @returns AuthResponse - The session data if log-in is successful, or an error if failed.
 */
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

/**
 * Log out the current user.
 */
export const logOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
    throw new Error(error.message);
  }

  console.log("User logged out successfully.");
};
