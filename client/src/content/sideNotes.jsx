import React from "react";
import Button from "react-bootstrap/Button";

const applyMarkdown = (formatType, markdown, setMarkdown) => {
  const textarea = document.getElementById("exampleFormControlTextarea1");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = markdown.substring(start, end);

  let markdownSyntax;
  switch (formatType) {
    case "bold":
      markdownSyntax = `**${selectedText}**`;
      break;
    case "italic":
      markdownSyntax = `*${selectedText}*`;
      break;
    case "code":
      markdownSyntax = `\`${selectedText}\``;
      break;
    default:
      markdownSyntax = selectedText;
  }

  const newMarkdown =
    markdown.substring(0, start) + markdownSyntax + markdown.substring(end);
  setMarkdown(newMarkdown);

  // Optional: Reset the selection to the end of the newly formatted text
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd =
      start + markdownSyntax.length;
  }, 0);
};

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
}) => {
  return (
    <div
      style={{ height: "100vh" }}
      className={`${annotating ? "col-7" : "col-auto"} transition-sidebar 
`}
    >
      <div className="row h-100">
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
          <div className="col-10 ms-4 text-secondary">
            <ul className="nav nav-underline mt-5">
              <li className="nav-item">
                <button
                  className={`nav-link text-secondary ${
                    view === "notes" ? "active" : ""
                  }`}
                  onClick={() => setView("notes")}
                >
                  <h5>Notes</h5>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-secondary ${
                    view === "transcript" ? "active" : ""
                  }`}
                  onClick={() => setView("transcript")}
                >
                  <h5>Transcript</h5>
                  <div className="overflow-auto flex-grow-1 pt-2"></div>
                </button>
              </li>
            </ul>
            {view === "notes" && (
              <div>
                <textarea
                  className="form-control mt-3 text-secondary"
                  id="exampleFormControlTextarea1"
                  style={{ height: "80vh", overflow: "auto", resize: "none" }}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                />
                <div className="mt-2 row">
                  <div className="col-9 d-flex align-items-center justify-content-between">
                    <Button
                      variant="outline-primary"
                      type="button"
                      onClick={saveNote}
                    >
                      Save
                    </Button>{" "}
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
                  <div className="col-3 justify-content-between d-flex">
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
                  </div>
                </div>
              </div>
            )}
            {view === "transcript" && (
              <div style={{ overflow: "auto", maxHeight: "85vh" }}>
                {fullTs}
                {status === "active" && transcript}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNotes;
