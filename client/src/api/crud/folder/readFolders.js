import { supabaseClient } from "@/config/supabaseClient";

export const fetchFolders = async (session) => {
  const user_id = session.user.id;

  try {
    const result = await supabaseClient
      .from("folder")
      .select("*")
      .eq("user_id", user_id);
    let folderRecords = result.data;
    return folderRecords;
  } catch (error) {
    console.error("Error:", error);
  }
};
