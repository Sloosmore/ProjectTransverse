import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./submit.css";
import { fetchFolders } from "@/api/crud/folder/readFolders";

import { createNewNote } from "../../services/noteWebsockets/noteModeApi";
import { useAuth } from "../../../../hooks/userHooks/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { useNewNote } from "@/hooks/noteHooks/newNote";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/theme";

function SubmitNewNote() {
  const navigate = useNavigate();
  const { noteData, setNotes, setMode, setNoteID } = useNoteData();
  const { darkMode } = useTheme(); // Get the darkMode state

  const { session } = useAuth();
  const [localNoteName, localNoteNameSet] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const noteRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState("Choose a folder");

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const folderId = pathParts[pathParts.length - 1];
  const [selectedValue, setSelectedValue] = useState(null);

  const { newNoteField, setNewNoteField } = useNewNote();

  const handleNoteSubmit = () => {
    //no longer will have transcript
    setNewNoteField(false);

    console.log("selectedValue", selectedValue);

    createNewNote(
      localNoteName,
      setMode,
      session,
      selectedValue,
      setNoteID,
      navigate
    );
  };
  useEffect(() => {
    if (newNoteField) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [newNoteField]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        noteRef.current &&
        !noteRef.current.contains(event.target) &&
        !isDropdownOpen
      ) {
        setNewNoteField(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [noteRef, setNewNoteField, isDropdownOpen]);

  useEffect(() => {
    fetchFolders(session, false).then(setFolders);
  }, [newNoteField]);

  useEffect(() => {
    if (folderId) {
      setActiveFolder(folders.find((folder) => folder.folder_id === folderId));
    }
  }, [folders, folderId, newNoteField]);

  useEffect(() => {
    setSelectedValue(activeFolder?.folder_id || null);
  }, [activeFolder]);

  return (
    <>
      {newNoteField && (
        <div className="w-full mx-auto z-20 relative overflow-x-hidden overflow-y-hidden h-40 ">
          <div
            className={`absolute inset-0 pt-5 mt-5 ${
              darkMode ? "blur-shadow-dark" : "blur-shadow"
            }`}
          ></div>

          <div
            ref={noteRef}
            className={`lg:w-3/4 md:w-5/6 sm:w-11/12 mx-auto z-10 transition-opacity duration-300 p-5 mt-10`}
          >
            <div className=" flex  items-center flex-row overflow-hidden bg-white dark:bg-[#020817] [&:has(textarea:focus)]:border-token-border-xheavy shadow-lg w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy rounded-2xl bg-token-main-surface-primary shadow-lg">
              <input
                type="text"
                className="md:border-r m-0 w-full resize-none border-0 focus:ring-0 bg-transparent focus:outline-none focus-visible:ring-0 max-h-25 py-[10px] pr-4 md:py-3.5 placeholder-gray-400 dark:placeholder-opacity-100 pl-4 "
                placeholder="Enter the title here! (helps with prompting)"
                onChange={(e) => localNoteNameSet(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNoteSubmit();
                  }
                }}
              />
              <div className="md:border-r h-[52px] flex items-center me-2 ">
                <Select
                  className="self-center"
                  onOpenChange={(isDropdownOpen) =>
                    setIsDropdownOpen(isDropdownOpen)
                  }
                  defaultValue={activeFolder?.folder_id || null}
                  onValueChange={(value) => {
                    setSelectedValue(value);
                  }}
                >
                  <SelectTrigger className="w-[100px] p-0 md:p-3 sm:w-[180px] border-0 ring-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder, index) => (
                      <SelectItem key={index} value={folder.folder_id}>
                        {folder.title}
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <SelectItem value={null}>No Folder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-full">
                <button
                  className=" w-10 h-10 flex-shrink-0 bottom-0 right-0 rounded-lg border dark:border-gray-800 border-gray-500 bg-gray-500 text-white transition-colors disabled:text-gray-400 disabled:opacity-10 dark:border-white my-auto me-2"
                  onClick={() => {
                    handleNoteSubmit();
                  }}
                >
                  <i
                    className="bi bi-arrow-up-short"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SubmitNewNote;
