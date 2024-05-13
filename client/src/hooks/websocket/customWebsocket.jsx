import useWebSocket from "react-use-websocket";
import { handleOnMessage } from "@/components/appPages/services/noteWebsockets/wsResponce";

const WS_URL = `${import.meta.env.VITE_WS_SERVER_URL}/notes-api`;
const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export function useCustomWebSocket(noteData, setNotes, noteID, navigate) {
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      if (inDevelopment) {
        console.log("WebSocket connection established.");
      }
    },

    onMessage: (event) => {
      handleOnMessage(event, noteData, setNotes, noteID, navigate);
    },

    onError: (event) => {
      console.error("WebSocket error observed:", event);
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  return { sendJsonMessage, readyState };
}
