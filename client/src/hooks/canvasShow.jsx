import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { fetchNoteRecords } from "../components/appPages/services/crudApi";

export const CanvasContext = createContext({
  showOffCanvasEdit: false,
  setOffCanvasEdit: () => {},
});

export const CanvasProvider = ({ children, setNotes, session }) => {
  if (!setNotes) {
    console.error("setNotes is required in useCanvas use NoteDataHook");
  }
  const [showOffCanvasEdit, setOffCanvasEdit] = useState(false);
  useEffect(() => {
    console.log("fetching notes");
    fetchNoteRecords(session, true).then(setNotes);
  }, [showOffCanvasEdit, session]);

  return (
    <CanvasContext.Provider value={{ showOffCanvasEdit, setOffCanvasEdit }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  return useContext(CanvasContext);
};
