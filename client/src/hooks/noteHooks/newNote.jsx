import { createContext, useContext } from "react";
import { useState } from "react";

export const NewNoteContext = createContext({
  newNoteField: false,
  setNewNoteField: () => {},
});

export const NewNoteProvider = ({ children }) => {
  const [newNoteField, setNewNoteField] = useState(false);

  return (
    <NewNoteContext.Provider value={{ newNoteField, setNewNoteField }}>
      {children}
    </NewNoteContext.Provider>
  );
};

export const useNewNote = () => {
  return useContext(NewNoteContext);
};
