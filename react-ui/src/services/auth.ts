import { AuthResponse } from "@supabase/supabase-js";
import { supabase } from "./client";

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
