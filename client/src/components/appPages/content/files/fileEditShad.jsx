import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import DownloadMd from "./download";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  updateTitle,
  updateVis,
  saveNoteMarkdown,
  deleteRecord,
} from "../../services/crudApi";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNoteData } from "@/hooks/noteDataStore";
import { useAuth } from "@/hooks/auth";

import { fetchNoteRecords } from "../../services/crudApi";

//edit for sheet

export function EditExportNote({ file }) {
  const { setNotes } = useNoteData();
  const { session } = useAuth();

  const [title, setTitle] = useState(file ? file.title : "");
  const [visible, setVisible] = useState(file ? file.visible : "");
  const [markdown, setMarkdown] = useState(file ? file.full_markdown : "");
  const [noteID, setNoteID] = useState(file ? file.note_id : "");
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    setTitle(file ? file.title : "");
    setVisible(file ? file.visible : "");
    setMarkdown(file ? file.full_markdown : "");
    setNoteID(file ? file.note_id : "");
  }, [file]);

  const updateNote = async (
    file,
    markdown,
    visible,
    title,
    noteID,
    setShowAlert
  ) => {
    if (file) {
      await saveNoteMarkdown(noteID, markdown);
      await updateVis(noteID, visible);
      await updateTitle(noteID, title);
      setShowAlert(true);
      const notes = await fetchNoteRecords(session, true);
      setNotes(notes);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const deleteRec = async (noteID) => {
    await deleteRecord(noteID);
    const notes = await fetchNoteRecords(session, true);
    setNotes(notes);
  };

  return (
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
        <div className="d-flex align-items-center justify-content-between mt-4">
          <Button
            type="button"
            onClick={() => {
              updateNote(file, markdown, visible, title, noteID, setShowAlert);
            }}
            className="col"
          >
            Save
          </Button>
        </div>

        {showAlert && (
          <Toast
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
            }}
            className="bg-success text-white"
          >
            <Toast.Body className="bg-success">
              <i className="bi bi-check2-circle me-2"></i>
              Saved
            </Toast.Body>
          </Toast>
        )}

        <div className="border my-3"></div>

        <div className="mt-4">
          <DownloadMd noteID={noteID} />
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
          <Button
            variant="destructive"
            onClick={() => {
              deleteRec(noteID);
            }}
          >
            Delete
          </Button>
        </div>
      </form>
      <SheetFooter>
        {/*
        <SheetClose asChild>
          <Button type="submit" variant="secondary" className="mx-auto">
            Close
          </Button>
          </SheetClose>*/}
      </SheetFooter>
    </SheetContent>
  );
}

export default EditExportNote;
