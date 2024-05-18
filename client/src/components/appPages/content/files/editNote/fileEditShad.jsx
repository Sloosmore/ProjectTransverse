import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState, useEffect } from "react";
import DownloadMd from "./download";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { deleteRecord } from "@/api/crud/notes/deleteNote";
import { updateTitle } from "@/api/crud/notes/updateTitle";
import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "@/components/ui/sheet";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { useAuth } from "@/hooks/userHooks/auth";

import { fetchNoteRecords } from "@/api/crud/notes/readNotes";
import { toast } from "sonner";
import ChangeFolder from "./changeFolder";
import { useParams } from "react-router-dom";
import { updateFolder } from "@/api/crud/notes/updateFolder";
import { fetchFolders } from "@/api/crud/folder/readFolders";

//edit for sheet

export function EditExportNote({ file }) {
  const { folderId } = useParams();
  const { setNotes } = useNoteData();
  const { session } = useAuth();
  const [title, setTitle] = useState(file ? file.title : "");
  const [noteID, setNoteID] = useState(file ? file.note_id : "");
  const [folder_id, setFolder_id] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const upFolderID = folderId ? folderId : null;
    setFolder_id(upFolderID);
  }, []);

  useEffect(() => {
    setTitle(file ? file.title : "");
    setNoteID(file ? file.note_id : "");
  }, [file]);

  const updateNote = async (file, title, noteID, folder_id) => {
    if (file) {
      await updateTitle(noteID, title);
      if (folder_id && folder_id.length > 10) {
        await updateFolder(noteID, folder_id);
      } else {
        await updateFolder(noteID, null);
      }
      const notes = await fetchNoteRecords(session);
      setNotes(notes);
    }
  };

  const deleteRec = async (noteID) => {
    await deleteRecord(noteID);
    setNotes((prev) => prev.filter((note) => note.note_id !== noteID));
  };

  useEffect(() => {
    fetchFolders(session, false).then(setFolders);
  }, [open]);

  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger className=" border-2 border-gray-300 p-4 w-4 h-5 flex justify-center items-center hover:bg-gray-500 rounded-lg hover:text-white">
        <div className="  align-middle  ">
          <i className=" bi bi-gear align-middle "></i>
        </div>
      </SheetTrigger>
      <SheetContent className="min-w-[350px] md:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Note</SheetTitle>
        </SheetHeader>
        <form>
          <div className="my-3">
            <label htmlFor="title" className="form-label ">
              Title:
            </label>

            <Input
              className="mt-2"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <ChangeFolder
              open={open}
              folderId={folder_id}
              setSelectedValue={setSelectedValue}
              folders={folders}
            />
          </div>
          <div className="d-flex align-items-center flex mt-4">
            <Button
              type="button"
              onClick={() => {
                updateNote(file, title, noteID, selectedValue);
                toast.success("Note Saved");
              }}
              className=""
            >
              Save
            </Button>
          </div>

          <div className="border my-3"></div>

          <div className="mt-4">
            <DownloadMd noteID={noteID} json={file.json_content} />
          </div>
          <div className="border-top my-4"></div>

          <div className=" flex flex row justify-between my-6">
            <Button data-tooltip-id="notion-tooltip">Export to Notion</Button>
            <ReactTooltip
              place="bottom"
              id="notion-tooltip"
              className="bg-light text-black-50 border"
              content="Comming Soon"
            />
            <SheetClose asChild>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={(e) => {
                  deleteRec(noteID);
                  toast.info("Note Deleted");
                }}
              >
                Delete
              </button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default EditExportNote;
