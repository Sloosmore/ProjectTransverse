import "./sidebar.css";
//import TaskList from "./task_list";
import NoteList from "./note_list";
import CmdCenter from "./cmdCenter";
import { Button, Collapse } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import PausePlay from "./noteStateControl";
import StorageButton from "./storage";
import Profile from "./profile/profile";
import ProfDropdown from "./profile/dropdown";

function Sidebar({ Dropdown, noteData, pauseProps, controlProps, profileKit }) {
  const [openNotes, setOpenNotes] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);

  useEffect(() => {
    if (openNotes && openTasks) {
      setOpenTasks(false);
    }
  }, [openNotes]);

  useEffect(() => {
    if (openTasks && openNotes) {
      setOpenNotes(false);
    }
  }, [openTasks]);

  //this is the sidebar bar
  return (
    <div
      className="flex-col h-100 position-relative "
      style={{ height: "100%" }}
    >
      <CmdCenter noteData={noteData} controlProps={controlProps} />

      <StorageButton />

      <div className=" justify-content-center mt-2 text-center">
        <PausePlay pauseProps={pauseProps} />
      </div>

      <div className="overflow-auto list-container">
        <div
          className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2"
          role="button"
          style={{ width: "85%" }}
          onClick={() => setOpenNotes(!openNotes)}
        >
          <i
            className="bi bi-card-list bi-2x align-left"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <span className="mx-auto">Notes</span>
        </div>
        <Collapse in={openNotes}>
          <div
            id="example-collapse-text"
            className="overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            <NoteList notes={noteData} />
          </div>
        </Collapse>
      </div>
      <div className="absolute bottom-0 w-full mb-3">
        <Profile profileKit={profileKit} />
      </div>
    </div>
  );
}

export default Sidebar;

//documnets button
/*<div
          className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2"
          role="button"
          style={{ width: "85%" }}
          onClick={() => setOpenTasks(!openTasks)}
        >
          <i
            className="bi bi-file-earmark bi-2x align-left"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <span className="mx-auto">Docs</span>
        </div>
        <Collapse in={openTasks}>
          <div
            id="example-collapse-text"
            className="overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            <TaskList tasks={docData} />
          </div>
        </Collapse> */
