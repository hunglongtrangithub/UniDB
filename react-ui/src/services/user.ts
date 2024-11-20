import { supabase } from './client';

export const getUserDetails = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated.");
  }

  return { role: user.user_metadata.role, firstName: user.user_metadata.first_name, lastName: user.user_metadata.last_name };
};
