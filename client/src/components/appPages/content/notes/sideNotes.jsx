import React from "react";
import Button from "react-bootstrap/Button";
import { applyMarkdown } from "../../services/frontendNoteConfig/applyMD";
import Record from "./pausePlay";

const SideNotes = ({
  annotating,
  setAnnotating,
  view,
  setView,
  markdown,
  setMarkdown,
  saveNote,
  showAlert,
  status,
  transcript,
  fullTs,
  pauseProps,
  localNoteID,
}) => {
  return (
    <div
      className={` h-full ${
        annotating ? "col-lg-7 col" : "col-auto"
      } transition-sidebar 
`}
    >
      <div className="row h-full">
        <div
          className={`toggle-sidebar d-flex align-items-center col-1 ${
            annotating && "bg-lightgrey"
          }`}
        >
          {annotating && (
            <i
              className="bi bi-caret-right text-white"
              style={{ fontSize: "2rem" }}
              onClick={() => setAnnotating(!annotating)}
            ></i>
          )}
          {!annotating && (
            <i
              className="bi bi-caret-left text-secondary"
              style={{ fontSize: "2rem" }}
              onClick={() => setAnnotating(!annotating)}
            ></i>
          )}
        </div>
        {annotating && (
          <div className="col-10 ms-4 text-secondary ">
            <div className="flex flex-row mt-5 items-center">
              <div className="flex my-auto space-x-4">
                <button
                  className={`${
                    view === "notes"
                      ? "text-secondary underline underline-offset-4"
                      : "text-secondary"
                  }`}
                  onClick={() => setView("notes")}
                >
                  <div>Notes</div>
                </button>
                <button
                  className={`${
                    view === "transcript"
                      ? "text-secondar underline underline-offset-4"
                      : "text-secondary"
                  }`}
                  onClick={() => setView("transcript")}
                >
                  <div>Transcript</div>
                </button>
              </div>
              <div className="ml-auto">
                <Record pauseProps={pauseProps} localNoteID={localNoteID} />
              </div>
            </div>
            {view === "notes" && (
              <div>
                <textarea
                  className="form-control mt-3 text-secondary"
                  id="exampleFormControlTextarea1"
                  style={{ height: "70vh", overflow: "auto", resize: "none" }}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                />
                <div className="mt-2 row">
                  <div className="col d-flex align-items-center justify-content-between">
                    <Button
                      variant="outline-primary"
                      type="button"
                      onClick={saveNote}
                    >
                      Save
                    </Button>
                    {showAlert && (
                      <div
                        className="alert alert-success "
                        role="alert"
                        style={{
                          padding: "6px",
                          margin: "0",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                        }}
                      >
                        <i className="bi bi-check2-circle me-2"></i>
                        Saved
                      </div>
                    )}
                  </div>
                  <div className="col-lg-5 col-md-6 col-sm-8 justify-content-between d-flex">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("highlight", markdown, setMarkdown)
                      }
                    >
                      <i className="bi bi-marker-tip"></i>{" "}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("bold", markdown, setMarkdown)
                      }
                    >
                      <i className="bi bi-type-bold"></i>
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("italic", markdown, setMarkdown)
                      }
                    >
                      <i className="bi bi-type-italic "></i>
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("code", markdown, setMarkdown)
                      }
                    >
                      <i className="bi bi-code-slash"></i>{" "}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("clear", markdown, setMarkdown)
                      }
                    >
                      <i className="bi bi-eraser"></i>{" "}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {view === "transcript" && (
              <div className="h-full">
                <div style={{ height: "80vh", overflow: "auto" }}>
                  {fullTs &&
                    fullTs.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  {status === "active" && transcript}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNotes;
