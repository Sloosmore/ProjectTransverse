import { supabaseClient } from "@/config/supabaseClient";

export const fetchUsers = async (domain_string) => {
  try {
    const result = await supabaseClient
      .from("user")
      .select("*")
      .like("email", `%${domain_string}%`);
    const users = result.data;
    return users;
  } catch (error) {
    console.error("Error:", error);
  }
};
