import React, { useState, useEffect } from "react";
import { Modal, Accordion, Button } from "react-bootstrap";
import { handleSendLLM, fetchLLMpref } from "../services/setNotepref";
import { createNewNote } from "../services/noteModeApi";
import { useAuth } from "../../../hooks/auth";

function ControlModal({ show, handleClose, noteData, controlProps }) {
  const { session } = useAuth();
  const {
    setDocs,
    setNotes,
    wsJSON,
    setMode,
    resetTranscript,
    setActiveToast,
    setToastMessage,
  } = controlProps;
  //LLM preffereences
  const [preferences, setPreferences] = useState(null);
  //Value of LLMPref text box
  const [textareaValue, setTextareaValue] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  //Set prefferences when called
  const handleSubmitLLM = () => {
    setPreferences(textareaValue);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000); // hide after 5 second
  };

  // Call fetchData when the modal opens
  useEffect(() => {
    if (show) {
      fetchLLMpref(setTextareaValue, session);
      console.log(textareaValue);
    }
  }, [show]);
  //send preff over on submit
  useEffect(() => {
    if (preferences) {
      handleSendLLM(preferences, session);
    }
  }, [preferences]);

  //Local Note Name (defined globally in use effect function)
  const [localNoteName, localNoteNameSet] = useState("");

  const startNotes = () => {
    if (localNoteName) {
      const transcript = "";
      createNewNote(
        localNoteName,
        transcript,
        noteData,
        setNotes,
        setMode,
        wsJSON,
        session
      );
      //toast
      handleClose();
      setToastMessage("Note Started, look in the notes tab");
      setActiveToast(true);
      setTimeout(() => {
        setActiveToast(false);
      }, 5000);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Control Center</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Set Prefferences</Accordion.Header>
              <Accordion.Body>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Notetaking Preferences
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="6"
                    value={textareaValue || ""}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  ></textarea>
                </div>
                <div className="row align-items-center">
                  <div className="col">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleSubmitLLM}
                    >
                      Submit
                    </Button>
                  </div>
                  <div className="col-lg-6 col-sm-9 ms-auto">
                    {showAlert && (
                      <div
                        className="alert alert-success"
                        role="alert"
                        style={{ padding: "8px", marginTop: "14px" }}
                      >
                        <i className="bi bi-check2-circle me-2"></i>
                        Notetaking preference submitted
                      </div>
                    )}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Take Notes</Accordion.Header>
              <Accordion.Body>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Note Title
                  </label>
                  <div className="row">
                    <div className="col-9">
                      <input
                        type="email"
                        className="form-control "
                        id="exampleFormControlInput1"
                        placeholder="Intro To CS Class 1"
                        onChange={(e) => localNoteNameSet(e.target.value)}
                      />
                    </div>
                    <div className="col-2 justify-content-right">
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={startNotes}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <div className="d-flex p-3 border-top">
          <Button
            variant="secondary"
            className="me-auto"
            onClick={() => resetTranscript()}
          >
            Clear Transcript
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ControlModal;
/* 
import { tvrseFunc } from "../services/tverseAPI";
<Accordion.Item eventKey="1">
            <Accordion.Header>Generate Document</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Document Prompt
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea2"
                  rows="3"
                  value={docPrompt}
                  onChange={(e) => setDocPrompt(e.target.value)}
                ></textarea>
              </div>
              <Button variant="primary" type="submit" onClick={sendDoc}>
                Submit
              </Button>
            </Accordion.Body>
          </Accordion.Item> 
          
          
          
  const [docPrompt, setDocPrompt] = useState("");

  const sendDoc = () => {
    tvrseFunc(docPrompt, setDocs);
    setDocPrompt("");
  };*/
