export const createUrlArray = (currentNote, urlList) => {
  console.log("urlList", urlList);
  const urlArray = [];
  let totTime = 0;
  let usedUrls = 0;
  for (let i = 0; i < currentNote.pause_timestamps.length; i++) {
    let timeDiferential =
      new Date(currentNote.pause_timestamps[i]).getTime() -
      new Date(currentNote.play_timestamps[i]).getTime();

    totTime += timeDiferential;
    let number_urls = Math.ceil(timeDiferential / 1000 / 30);
    let urlSet = urlList.slice(usedUrls, usedUrls + number_urls);
    usedUrls += number_urls;

    let urlObj = {
      urls: urlSet,
      time: totTime,
    };
    urlArray.push(urlObj);
  }
  return { urlArray, totTime };
};

export const getMaxTime = (urlArray) => {
  const endTimeArray = urlArray.map((url) => url.end_time);
  const maxTime = Math.max(...endTimeArray);
  return { totTime: maxTime };
};
