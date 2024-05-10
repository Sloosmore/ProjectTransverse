import { createContext, useContext, useState, useEffect } from "react";
import { fetchLLMpref } from "@/api/crud/user/setNotepref";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export const UserPrefContext = createContext({
  preferences: { note: [], diagram: [] },
  setPreferences: () => {},
  activeNum: { note: 0, diagram: 0 },
  setActiveNum: () => {},
  frequency: 0,
  setFrequency: () => {},
  guidedNotes: false,
  setGuidedNotes: () => {},
});

const UserPrefProvider = ({ children, session }) => {
  const [preferences, setPreferences] = useState({ note: [], diagram: [] });

  const [frequency, setFrequency] = useState(0);

  const [activeNum, setActiveNum] = useState({ note: 0, diagram: 0 });

  const [guidedNotes, setGuidedNotes] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (inDevelopment) {
        console.log("fetching context prefs");
      }

      await fetchLLMpref(
        setPreferences,
        setActiveNum,
        setFrequency,
        setGuidedNotes,
        session
      );
    };

    fetchPreferences();
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
        guidedNotes,
        setGuidedNotes,
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
