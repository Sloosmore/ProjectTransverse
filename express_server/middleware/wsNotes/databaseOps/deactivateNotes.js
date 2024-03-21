const supabase = require("../../../db/supabase");

const deactivateRecords = async (user) => {
  const user_id = user;

  const { error: updateError } = await supabase
    .from("note")
    .update({ status: "inactive" })
    .eq("user_id", user_id);

  if (updateError) {
    throw updateError;
  }

  const { data: inactiveRows, error: selectError } = await supabase
    .from("note")
    .select("*")
    .eq("user_id", user_id)
    .eq("status", "inactive")
    .eq("is_deleted", false);

  if (selectError) {
    throw selectError;
  }

  return inactiveRows;
};

module.exports = { deactivateRecords };
