const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";
import { supabaseClient } from "@/config/supabaseClient";

export const handleTextUpdate = async (text_size, text_color, session) => {
  const user_id = session.user.id;

  try {
    const { error } = await supabaseClient
      .from("user")
      .update({
        text_size,
        text_color,
      })
      .eq("user_id", user_id);
    console.log("error", error);
  } catch (error) {
    console.error(`Set textpref Error: ${error}`);
  }
};

export const fetchLLMText = async (setFontColor, setFontSize, session) => {
  //if (inDevelopment) console.log(session);
  const { text_color, text_size } = await clientFetchText(session);
  setFontColor(text_color);
  setFontSize(text_size);
};

const clientFetchText = async (session) => {
  const user_id = session.user.id;
  const { data: message, error } = await supabaseClient
    .from("user")
    .select("text_color, text_size")
    .eq("user_id", user_id);

  const text_color = message[0].text_color;
  const text_size = message[0].text_size;

  return { text_color, text_size };
};
