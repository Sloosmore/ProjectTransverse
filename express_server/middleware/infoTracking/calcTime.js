const supabase = require("../../db/supabase");

const calculateTotTime = async (note_id) => {
  try {
    const { data: latestDate, error } = await supabase
      .from("note")
      .select("play_timestamps, pause_timestamps")
      .eq("note_id", note_id);

    if (error) {
      throw error;
    }

    if (latestDate.length === 0) {
      // Handle the case where no data is found
      console.error("No data found for the given note_id.");
      return;
    }

    const playArray = latestDate[0].play_timestamps;
    const pauseArray = latestDate[0].pause_timestamps;
    //console.log("playArray", playArray);
    //console.log("pauseArray", pauseArray);

    let totTime = 0;

    //this should loop for the lenth of pause array
    for (let i = 0; i < pauseArray.length; i++) {
      let timeDiferential =
        new Date(pauseArray[i]).getTime() - new Date(playArray[i]).getTime();
      totTime += timeDiferential;
      console.log("Step ", i, "Time", totTime);
    }

    //if in play mode (most of the time)
    if (pauseArray.length < playArray.length) {
      const lastIndex = playArray.length - 1;
      console.log(playArray[lastIndex]);
      let lastDate = new Date(playArray[lastIndex]);

      const timezoneOffsetMilliseconds =
        new Date().getTimezoneOffset() * 60 * 1000;

      // Subtract the timezone offset from lastDate
      lastDate = new Date(lastDate.getTime() - timezoneOffsetMilliseconds);

      const now = new Date();

      console.log("lastDate ", lastDate, "date", now);
      const mostUpdate = now.getTime() - lastDate.getTime();

      totTime += mostUpdate;
      console.log(totTime);
    }
    return totTime;
  } catch (error) {
    console.log("Stack Trace:", error.stack);
    console.error("Error:", error);
    return 0;
  }
};

module.exports = { calculateTotTime };
