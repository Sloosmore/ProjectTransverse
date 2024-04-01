const jwt = require("jsonwebtoken");
const { getUserIdFromToken } = require("../../middleware/authDecodeJWS");
require("dotenv").config();

const handleTipTapAuth = async (req, res) => {
  try {
    const userToken = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(userToken);
    //create jwt token

    const payload = {
      user_id: user_id,
      tipTap: true,
    };

    const tiptapToken = jwt.sign(payload, process.env.JWT_TIPTAP_SECRET, {
      expiresIn: "12h",
      algorithm: "HS256",
    });

    res.status(201).json({ tiptapToken });
  } catch (error) {
    console.log(`TIPTAP JWT Error: ${error}`);
    res.status(500).send("A tip tap jwt error occurred");
  }
};

module.exports = { handleTipTapAuth };
