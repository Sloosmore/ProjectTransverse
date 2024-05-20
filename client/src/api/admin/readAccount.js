import { supabaseClient } from "@/config/supabaseClient";

export const fetchAccount = async (account_id) => {
  try {
    const result = await supabaseClient
      .from("corporate_account")
      .select("*")
      .eq("account_id", account_id)
      .single();
    const account = result.data;
    return account;
  } catch (error) {
    console.error("Error:", error);
  }
};
