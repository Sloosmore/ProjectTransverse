import React, { createContext } from "react";

export const TranscriptContext = createContext({
  fullTranscript: "",
  caption: [],
  setFullTranscript: () => {},
  setCaption: () => {},
});
