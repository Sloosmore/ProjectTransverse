export const reduceTranscript = (TS) => {
  function removeDuplicateWords(str) {
    return str
      .split(" ")
      .filter((word, index, arr) => arr.indexOf(word) === index)
      .join(" ");
  }
  function reducerFunction(acc, curr) {
    if (curr?.break === true) {
      //acc.push(curr);
      return acc;
    }
    if (acc?.length === 0) {
      acc.push({
        ...curr,
        caption: removeDuplicateWords(curr.caption),
      });
      return acc;
    }
    const prevObj = acc[acc?.length - 1];
    if (
      prevObj.speaker === curr.speaker &&
      prevObj.id === curr.id &&
      curr.time - prevObj.time <= 5
    ) {
      acc[acc.length - 1] = {
        ...prevObj,
        caption: removeDuplicateWords(prevObj.caption + " " + curr.caption),
        time: Math.min(prevObj.time, curr.time),
      };
    } else {
      acc.push({
        ...curr,
        caption: removeDuplicateWords(curr.caption),
      });
    }
    return acc;
  }

  return TS.reduce(reducerFunction, []);
};
