const supabase = require("../../db/supabase");
const uuid = require("uuid");
/*
const readUserRecordsFromNoteID = async (note_id) => {
  const idQuery = "SELECT user_id FROM note WHERE note_id = $1";
  const idRes = await pool.query(idQuery, [note_id]);
  const user_id = idRes.rows[0].user_id;

  const readQuery = "SELECT * FROM note WHERE user_id = $1";
  const { rows } = await pool.query(readQuery, [user_id]);
  return rows;
};*/

const pauseAppend = async (req, res) => {
  try {
    const { id, date } = req.body;
    console.log("date1", new Date());

    // read note to get pause timestamps and update pause timestamps
    const { data: note, error } = await supabase
      .from("note")
      .select("pause_timestamps, play_timestamps")
      .eq("note_id", id)
      .single();
    if (error) {
      throw error;
    }
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    console.log("date sent over", date);
    const newDate = date || new Date();
    console.log("date2", new Date());
    const pauseArray = [...note.pause_timestamps, newDate];

    console.log("noteID", id);

    const { error: updateError } = await supabase
      .from("note")
      .update({
        pause_timestamps: pauseArray,
        status: "inactive",
        date_updated: new Date(),
      })
      .eq("note_id", id);
    if (updateError) {
      throw updateError;
    }
    console.log("timestamps updated", note.play_timestamps, pauseArray);

    // Done updating ------------------------------

    // Update Segment with the time difference and end time
    const recording_intervals = pauseArray.length;
    let newTimeDifference = 0;
    let totTimePassed = 0;
    for (let i = 0; i < recording_intervals; i++) {
      if (i === recording_intervals - 1) {
        let pauseTime = new Date(pauseArray[i]).getTime();
        let playTime = new Date(note.play_timestamps[i] + "Z").getTime(); // add Z to fix timezone issue
        let endDiff = pauseTime - playTime;

        newTimeDifference = endDiff;
        totTimePassed += endDiff;
      } else {
        let pauseTime = new Date(note.pause_timestamps[i]).getTime();
        let playTime = new Date(note.play_timestamps[i]).getTime();

        let timeDiferential = pauseTime - playTime;

        totTimePassed += timeDiferential;
      }
    }

    // if there is only one recording interval, subtract 1100ms from the total time passed to account for the time it takes to process the pause
    if (recording_intervals === 1) {
      newTimeDifference = newTimeDifference - 1100;
    }

    //this is the time difference between the first play and the last pause
    totTimePassed = totTimePassed - 1100;

    console.log("totTimePassed", totTimePassed);

    // insert time difference into segment
    try {
      const { data: segmentInsert, error: queryErrorInsert } = await supabase
        .from("audio_segment")
        .update({ duration: newTimeDifference, end_time: totTimePassed })
        .eq("sequence_num", recording_intervals)
        .eq("note_id", id);
    } catch (error) {
      console.log("error", error);
    }

    console.log("timeDiferential", newTimeDifference);

    // Done updating ------------------------------
    // read audio segment to get segment sequence number and file path

    res.status(201).json({ message: "Pause updated" });
  } catch (error) {
    console.log(`pauseAppend:`, error);
    console.log("error", error.stack);
    res.status(500).json({ message: "An error occurred" });
  }
};

const playAppend = async (req, res) => {
  try {
    const { id } = req.body;

    // read note to get play timestamps and update play timestamps
    const { data: note, error } = await supabase
      .from("note")
      .select("play_timestamps, pause_timestamps")
      .eq("note_id", id)
      .single();
    if (error) {
      throw error;
    }
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const newDate = new Date();

    const playArray = [...note.play_timestamps, newDate];

    const { error: updateError } = await supabase
      .from("note")
      .update({
        play_timestamps: playArray,
        status: "active",
        date_updated: new Date(),
      })
      .eq("note_id", id);
    if (updateError) {
      throw updateError;
    }
    // Done updating ------------------------------

    const { data: segment, error: queryError } = await supabase
      .from("audio_segment")
      .select("*")
      .eq("note_id", id)
      .order("sequence_num", { ascending: false });

    if (queryError) {
      throw queryError;
    }

    const sequence_num = segment.length + 1;

    const segment_id = uuid.v4();
    const file_path = `${id}/${String(sequence_num).padStart(2, "0")}`;

    try {
      const { data: audioSegment, error: audioError } = await supabase
        .from("audio_segment")
        .insert({
          segment_id,
          note_id: id,
          sequence_num: sequence_num,
          file_path,
        });
    } catch (error) {
      console.log("error", error);
    }

    // read audio segment to get segment sequence number
    // create new audio segment
    // path to audio segment: note_id/segment_id.padStart(4, "0")
    // note_id, user_id, file_path, sequence_num, segment_id (generate uuid.v4())
    // upload audio segment to supabase on next pause

    res.status(201).json({ message: "Play updated" });
  } catch (error) {
    console.log(`playAppend: ${error}`);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { pauseAppend, playAppend };

// attempt to concatenate audio segments
{
  /*
   let segment, queryError;

    try {
      const result = await supabase
        .from("audio_segment")
        .select("segment_id, file_path")
        .eq("note_id", id);

      segment = result.data;
      queryError = result.error;

      if (queryError) {
        throw queryError;
      }
    } catch (error) {
      console.error("Error querying audio_segment:", error);
    }
    console.log("segment", segment);

    const filePaths = segment.map((segment) => segment.file_path);

    // get all chunks urls from supabase

    let urlData, urlError;

    try {
      const result = await supabase.storage
        .from("audio_segments")
        .createSignedUrls(filePaths, 60 ** 3);

      urlData = result.data;
      urlError = result.error;
    } catch (urlError) {
      console.error("Error querying audio_chunk from storage:", error);
    }

    console.log("urlsData", urlData);
    const urls = urlData.map((url) => url.signedUrl);
    console.log("urls newUrls", urls);
    // combine all chunks into a single audio file
    const full_path = `${id}`;

    try {
      const result = await processAudioFiles(urls, full_path);
    } catch (error) {
      console.error("Error processing large audio files:", error);
    } */
}
