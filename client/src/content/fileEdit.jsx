import React from "react";
import { Offcanvas } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Toast } from "react-bootstrap";

import {
  updateTitle,
  updateVis,
  saveNoteMarkdown,
  deleteRecord,
} from "../services/crudApi";

const updateNote = (file, markdown, visible, title, noteID, setShowAlert) => {
  if (file) {
    saveNoteMarkdown(noteID, markdown);
    updateVis(noteID, visible);
    updateTitle(noteID, title);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }
};

function EditOffcanvas({ canvasEdit, handleClose, file }) {
  const { showOffCanvasEdit, setOffCanvasEdit } = canvasEdit;

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
  }, [showOffCanvasEdit, file]);

  return (
    <Offcanvas
      show={showOffCanvasEdit}
      onHide={handleClose}
      placement="end"
      style={{ width: "56vh" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit Note</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-3">
              <label htmlFor="markdown" className="form-label">
                Markdown
              </label>
              <textarea
                type="text"
                className="form-control"
                id="markdown"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                style={{ maxHeight: "50vh" }}
              />
            </div>
          </div>
          <div className="align-items-center row d-flex">
            <div className="col align-items-center">
              <div>Visable</div>
            </div>
            <div className="col d-flex justify-content-end align-items-center mb-1">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="visible"
                  style={{ fontSize: "1.75em" }}
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                />
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-4">
            <Button
              variant="outline-primary"
              type="button"
              onClick={() =>
                updateNote(file, markdown, visible, title, noteID, setShowAlert)
              }
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
          <div className="border-top my-4"></div>
          <div className=" row">
            <div className="col">
              <Button variant="outline-dark">Export to Notion</Button>
            </div>
            <div className="col justify-content-end d-flex">
              <Button
                variant="outline-danger"
                onClick={() => {
                  deleteRecord(noteID);
                  setOffCanvasEdit(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default EditOffcanvas;
