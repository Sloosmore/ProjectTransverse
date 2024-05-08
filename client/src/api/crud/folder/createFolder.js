import { supabaseClient } from "@/config/supabaseClient";
import { v4 as uuid } from "uuid";

export const createFolder = async (session) => {
  const user_id = session.user.id;
  const title = "Untitled Folder";
  const folder_id = uuid();
  try {
    const result = await supabaseClient
      .from("folder")
      .insert({ title, folder_id, user_id });
    return { folder_id };
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
