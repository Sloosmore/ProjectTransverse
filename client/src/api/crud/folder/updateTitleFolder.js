import { supabaseClient } from "@/config/supabaseClient";

export const updateFolderTitle = async (folder_id, title) => {
  try {
    const result = await supabaseClient
      .from("folder")
      .update({ title: title })
      .eq("folder_id", folder_id);
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
