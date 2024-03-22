//install supabase in front
import { supabaseClient } from "../../../config/supabaseClient";

export const addToWaitlist = async (email) => {
  const { data, error } = await supabaseClient
    .from("waitlist")
    .insert({ email: email });
};
