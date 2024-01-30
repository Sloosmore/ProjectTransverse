// fetchTranscript.js
import { useState } from "react";
import { fetchTaskRecords } from "./crudApi";

export const tvrseFunc = (transcript, setData) => {
  fetch(`/tverse-api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  })
    .then((response) => {
      if (!response.ok) {
        throw Error(
          `Server returned ${response.status}: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((content) => {
      let initRecord = JSON.parse(content);
      console.log(initRecord);
      setData((prevData) => [...prevData, initRecord]);
      const ID = initRecord.task_id;
      console.log(ID);
      return ID;
    })
    .then((ID) => {
      const eventSource = new EventSource(`/awaitDoc-api/?ID=${ID}`);
      eventSource.onopen = () => console.log(">>> Connection opened!");
      eventSource.onmessage = (message) => {
        console.log(message);
        try {
          fetchTaskRecords().then(setData);
        } catch {
          console.error("Error parsing SSE data:", error);
        }
      };
      eventSource.onerror = (error) => {
        //Will throw error upon disconnet but this is intentional behavior
        //console.error("SSE error:", error);
        //console.error("Error stack:", error.stack);
        eventSource.close();
      };
    })
    .catch((err) => {
      console.log(err);
    });
};
