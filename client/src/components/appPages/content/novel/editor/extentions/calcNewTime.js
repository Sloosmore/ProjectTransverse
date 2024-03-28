export const calcTime = (playArray, pauseArray) => {
  let totTime = 0;
  for (let i = 0; i < pauseArray.length; i++) {
    let timeDiferential =
      new Date(pauseArray[i]).getTime() - new Date(playArray[i]).getTime();
    totTime += timeDiferential;
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

    const mostUpdate = now.getTime() - lastDate.getTime();

    totTime += mostUpdate;
    console.log(totTime);
  }

  return totTime;
};
