import { supabaseClient } from "@/config/supabaseClient";

export const updateUsers = async (users) => {
  const upUser = users.reduce((acc, obj) => {
    if (obj.user_type !== "Admin") {
      acc.push({ ...obj, date_created: obj.date_created });
    }
    return acc;
  }, []);
  console.log(upUser);
  try {
    const result = await supabaseClient
      .from("user")
      .upsert(upUser, { onConflict: "user_id", ignoreDuplicates: false });
  } catch (error) {
    console.error("Error:", error);
  }
};
