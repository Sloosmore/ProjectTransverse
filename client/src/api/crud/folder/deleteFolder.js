import { supabaseClient } from "@/config/supabaseClient";

export const deleteFolder = async (folder_id) => {
  const result = await supabaseClient
    .from("folder")
    .delete()
    .eq("folder_id", folder_id);
  if (result.error) {
    throw result.error;
  }
};
