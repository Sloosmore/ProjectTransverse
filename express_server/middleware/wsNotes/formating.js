function formatElapsedTime(totTime) {
  let hours = Math.floor(totTime / 3600000);
  let minutes = Math.floor((totTime % 3600000) / 60000);
  let seconds = Math.floor(((totTime % 3600000) % 60000) / 1000);

  // Pad the minutes and seconds with leading zeros, if necessary
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  if (seconds % 10 === 0) {
    seconds = seconds.padEnd(2, "0");
  }

  let formattedTime = `${minutes}:${seconds}`;
  // If hours is not zero, prepend it to the formatted time
  if (hours > 0) {
    hours = hours.toString().padStart(2, "0");
    formattedTime = `${hours}:${formattedTime}`;
  }

  return formattedTime;
}

module.exports = { formatElapsedTime };
