import { createContext, useContext, useState, useEffect } from "react";
import { fetchLLMpref } from "@/components/appPages/services/setNotepref";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export const UserPrefContext = createContext({
  preferences: { note: [], diagram: [] },
  setPreferences: () => {},
  activeNum: { note: 0, diagram: 0 },
  setActiveNum: () => {},
  frequency: 0,
  setFrequency: () => {},
});

const UserPrefProvider = ({ children, session }) => {
  const [preferences, setPreferences] = useState({ note: [], diagram: [] });

  const [frequency, setFrequency] = useState(0);

  const [activeNum, setActiveNum] = useState({ note: 0, diagram: 0 });

  useEffect(() => {
    if (inDevelopment) {
      console.log("fetching context prefs");
    }
    fetchLLMpref(setPreferences, setActiveNum, setFrequency, session);
  }, [session]);

  useEffect(() => {
    if (inDevelopment) {
      console.log("context freq", frequency);
    }
  }, [frequency]);

  return (
    <UserPrefContext.Provider
      value={{
        preferences,
        setPreferences,
        activeNum,
        setActiveNum,
        frequency,
        setFrequency,
      }}
    >
      {children}
    </UserPrefContext.Provider>
  );
};

export default UserPrefProvider;

export const useUserPref = () => {
  return useContext(UserPrefContext);
};
