const handleTscript = async (req, res) => {
  try {
    console.log(req.body);

    res.status(201).json({ message: "all good" });
  } catch (error) {
    console.error("Error saving audio file:", error);
    res.status(500).send("Error saving audio file");
  }
};
module.exports = { handleTscript };
