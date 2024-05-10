const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";
import { supabaseClient } from "@/config/supabaseClient";

export const handleSendLLM = async (
  instructions,
  frequency,
  pref_num,
  guided_notes,
  session
) => {
  const user_id = session.user.id;

  const note_pref_num = pref_num["note"];
  const diagram_pref_numb = pref_num["diagram"];
  const note_pref = instructions["note"];
  const diagram_pref = instructions["diagram"];

  console.log("note", note_pref);
  console.log("diagram", diagram_pref);

  console.log("guided_notes", guided_notes);

  try {
    const { error } = await supabaseClient
      .from("user")
      .update({
        note_preferences: note_pref,
        note_frequency: frequency,
        pref_number: note_pref_num,
        diagram_preferences: diagram_pref,
        diagram_pref_number: diagram_pref_numb,
        guided_note_setting: guided_notes,
      })
      .eq("user_id", user_id);
    console.log("error", error);
  } catch (error) {
    console.error(`Set LLM Error: ${error}`);
  }
};

export const fetchLLMpref = async (
  setPreferences,
  setActiveNum,
  setFrequency,
  setGuidedNotes,
  session
) => {
  if (inDevelopment) console.log(session);
  const { preferences, activeNum, frequency, guided_notes } =
    await clientFetchLLM(session);
  setFrequency(frequency);
  setPreferences(preferences);
  setActiveNum(activeNum);
  setGuidedNotes(guided_notes);
};

const clientFetchLLM = async (session) => {
  const user_id = session.user.id;
  const { data: message, error } = await supabaseClient
    .from("user")
    .select(
      "note_preferences, note_frequency, pref_number, diagram_preferences, diagram_pref_number, guided_note_setting"
    )
    .eq("user_id", user_id);

  const instructions = message[0].note_preferences;
  const frequency = message[0].note_frequency;
  const pref_num = message[0].pref_number;
  const diagram_instructions = message[0].diagram_preferences;
  const diagram_pref_numb = message[0].diagram_pref_number;
  const guided_notes = message[0].guided_note_setting;

  const preferences = {
    note: instructions,
    diagram: diagram_instructions,
  };

  const activeNum = {
    note: pref_num,
    diagram: diagram_pref_numb,
  };

  return { preferences, activeNum, frequency, guided_notes };
};
