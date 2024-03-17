const supabase = require("../db/supabase");

const uploadSlides = async (req, res) => {
  let buffer;
  let note_id;
  let slide_url;
  let file_path;

  //get file buffer
  try {
    console.log("customNotePrompt");
    console.log("req.body", req.body);

    note_id = req.body.note_id;
    file_path = `Slides for note: ${note_id}`;
    console.log("note_id", note_id);

    if (!req.file) {
      console.log("No file uploaded.");
      return res.status(400).send({ message: "No file uploaded." });
    }
    console.log("req.file", req.file);

    buffer = req.file.buffer;
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error Processing File" });
  }

  try {
    const fileType = await import("file-type");
    const contentType = (await fileType.fileTypeFromBuffer(buffer)).mime;
    console.log("contentType", contentType);
    const { upData, upError } = await supabase.storage
      .from("slides")
      .upload(file_path, buffer, { upsert: true, contentType });

    if (upError) {
      console.error(upError);
      return res.status(500).send({ message: "Error uploading file" });
    }
    console.log("noteID", note_id);
    const { data } = await supabase.storage
      .from("slides")
      .getPublicUrl(file_path);
    console.log("urlData", data);
    slide_url = data.publicUrl;

    try {
      const { data, error } = await supabase
        .from("note")
        .update({
          slide_url,
        })
        .eq("note_id", note_id);

      if (error) {
        console.error(error);
        return res.status(500).send({ message: "Error updating slide URL" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Error updating slide URL" });
    }

    return res.status(200).send({ slide_url });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = { uploadSlides };
