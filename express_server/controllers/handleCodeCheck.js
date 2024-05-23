const { getUserIdFromToken } = require("../middleware/authDecodeJWS");
const supabase = require("../db/supabase");

const adminCode = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);

    // Extract the code from the request body
    const { code } = req.body;

    const { data: Accounts, error: accountErr } = await supabase
      .from("corporate_account")
      .select("*")
      .eq("account_id", code);

    if (accountErr) {
      console.error("Error querying accounts:", accountErr);
      res.status(500).send("Error querying accounts");
      return;
    }

    let isAdmin = Accounts.length > 0;

    if (isAdmin) {
      const { error: updateErr } = await supabase
        .from("user")
        .update({ user_type: "Admin", account_id: code })
        .eq("user_id", user_id);

      if (updateErr) {
        console.error("Error updating user:", updateErr);
        res.status(500).send("Error updating user");
        return;
      }
    }

    res.json({ Admin: isAdmin });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Error handling request");
  }
};

module.exports = { adminCode };
