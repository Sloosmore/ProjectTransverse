//install supabase in front
import { supabaseClient } from "../../../config/supabaseClient";

export const addToWaitlist = async (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const { data, error } = await supabaseClient
    .from("waitlist")
    .insert({ email: email });

  if (error) {
    console.error("Error adding to waitlist", error);
    return false;
  }
  return true;
};
