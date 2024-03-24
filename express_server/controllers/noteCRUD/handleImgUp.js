const supabase = require("../../db/supabase");
const uuid = require("uuid");

const uploadMDImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;

    console.log("Uploading file:", file);

    const fileName = `${uuid.v4()}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploaded_images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw error;
    }

    const response = await supabase.storage
      .from("uploaded_images")
      .getPublicUrl(fileName);

    const url = response.data.publicUrl;

    console.log("File uploaded successfully:", data);

    res.status(200).json({ message: "File uploaded successfully", url });
  } catch (err) {
    console.error("Error uploading file:", err.message);
    res.status(500).send(err.message);
  }
};

module.exports = { uploadMDImage };
