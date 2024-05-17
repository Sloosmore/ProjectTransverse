const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export const fetchDeepGramKey = () => {
  //if (inDevelopment) console.log("getting a new api key");
  return fetch(`${import.meta.env.VITE_BASE_URL}/audio/deepgram`, {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((object) => {
      if (!("key" in object)) throw new Error("No api key returned");
      if (inDevelopment) console.log("api key", object.key);
      return object;
    })
    .catch((e) => console.error(e));
};

export const isKeyExpired = (keyObject) => {
  const currentDate = new Date();
  const currentDateUTC = Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
    currentDate.getUTCHours(),
    currentDate.getUTCMinutes(),
    currentDate.getUTCSeconds(),
    currentDate.getUTCMilliseconds()
  );

  const expirationDate = new Date(keyObject.expiration_date);
  const expirationDateUTC = expirationDate.getTime();

  console.log("currentDateUTC", new Date(currentDateUTC));
  console.log("expirationDateUTC", new Date(expirationDateUTC));
  console.log("therfore", currentDateUTC > expirationDateUTC + 10000);

  return currentDateUTC > expirationDateUTC + 10000;
};
