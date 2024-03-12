const pool = require("../db/db");
const supabase = require("../db/supabase");
const uuid = require("uuid");
const { processAudioFiles } = require("../middleware/audio/combineAudio");
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
    const { id } = req.body;
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
    const newDate = new Date();
    const pauseArray = [...note.pause_timestamps, newDate];

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

    // calculate time difference between pause and play timestamps by also reading play timestamps
    const recording_intervals = pauseArray.length;
    let newTimeDifference = 0;
    let totTimePassed = 0;
    for (let i = 0; i < recording_intervals; i++) {
      let pauseTime = new Date(pauseArray[i]).getTime();
      let playTime = new Date(note.play_timestamps[i] + "Z").getTime(); // Convert to UTC

      let timeDiferential = pauseTime - playTime;

      totTimePassed += timeDiferential;
      if (i === recording_intervals - 1) {
        newTimeDifference = totTimePassed;
      }

      console.log("totTimePassed", totTimePassed);

      // insert time difference into segment
      const { data: segmentInsert, error: queryErrorInsert } = await supabase
        .from("audio_segment")
        .update({ duration: timeDiferential, end_time: totTimePassed })
        .eq("sequence_num", recording_intervals);

      if (queryErrorInsert) {
        throw queryErrorInsert;
      }

      console.log("timeDiferential", timeDiferential);

      // read audio segment to get segment sequence number and file path
      let segment, queryError, chunk, chunkError;

      try {
        const result = await supabase
          .from("audio_segment")
          .select("segment_id, file_path")
          .eq("note_id", id)
          .eq("sequence_num", recording_intervals);

        segment = result.data;
        queryError = result.error;

        if (queryError) {
          throw queryError;
        }
      } catch (error) {
        console.error("Error querying audio_segment:", error);
      }
      console.log("segment", segment);
      try {
        const result = await supabase
          .from("audio_chunk")
          .select("file_path")
          .eq("segment_id", segment[0].segment_id)
          .order("sequence_num", { ascending: true });

        chunk = result.data;
        chunkError = result.error;

        if (chunkError) {
          throw chunkError;
        }
      } catch (error) {
        console.error("Error querying audio_chunk:", error);
      }
      console.log("chunk", chunk);

      const filePaths = chunk.map((chunk) => chunk.file_path);

      // get all chunks urls from supabase

      let urlData, urlError;

      try {
        const result = await supabase.storage
          .from("audio_chunks")
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
      const segment_path = segment[0].file_path;

      try {
        const result = await processAudioFiles(urls, segment_path);
      } catch (error) {
        console.error("Error processing large audio files:", error);
      }

      res.status(201).json({ message: "Pause updated" });
    }
  } catch (error) {
    console.log(`pauseAppend:`, error);
    console.log("error", error.stack);
    res.status(500).json({ message: "An error occurred" });
  }
};

const playAppend = async (req, res) => {
  try {
    const { id } = req.body;
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

    let timeDifference = 0;
    for (let i = 0; i < note.pause_timestamps.length; i++) {
      timeDifference +=
        (new Date(note.pause_timestamps[i]) -
          new Date(note.play_timestamps[i])) /
        1000;
      // insert time difference into segment
    }
    timeDifference = Math.floor(timeDifference);

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
    const file_path = `${id}/${segment_id.padStart(2, "0")}`;

    const { data: audioSegment, error: audioError } = await supabase
      .from("audio_segment")
      .insert({
        segment_id,
        note_id,
        sequence_num: sequence_num,
        file_path,
        start_time: timeDifference,
      });

    if (audioError) {
      throw audioError;
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
