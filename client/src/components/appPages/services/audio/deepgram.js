const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export const fetchDeepGramKey = () => {
  if (inDevelopment) console.log("getting a new api key");
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
