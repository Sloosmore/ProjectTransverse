import { createContext } from "react";

export const NoteDataContext = createContext({
  noteData: [],
  setNotes: () => {},
  noteID: null,
  setNoteID: () => {},
  mode: null,
  setMode: () => {},
});

export function useNoteData() {
  if (noteData === undefined || mode === undefined) {
    throw new Error("useNoteData must be used within a NoteDataProvider");
  }

  return useContext(NoteDataContext);
}
