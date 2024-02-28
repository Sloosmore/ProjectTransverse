import React, { useState, useEffect } from "react";
import { handleSendLLM, fetchLLMpref } from "../services/setNotepref";
import { createNewNote } from "../services/noteWebsockets/noteModeApi";
import { useAuth } from "../../../hooks/auth";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

function ControlModalShad({ show, handleClose, noteData, controlProps }) {
  const { session } = useAuth();
  const {
    setDocs,
    setNotes,
    wsJSON,
    setMode,
    resetTranscript,
    setActiveToast,
    setToastMessage,
    SpeechRecognition,
  } = controlProps;

  //LLM preffereences
  const [preferences, setPreferences] = useState([]);
  //Value of LLMPref text box
  const [textareaValue, setTextareaValue] = useState("");

  const [frequency, setFrequency] = useState(0);

  const [showAlert, setShowAlert] = useState(false);

  const [activeNum, setActiveNum] = useState(0);

  //Set prefferences when called
  const handleSubmitLLM = () => {
    handleSendLLM(preferences, frequency, session);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000); // hide after 5 second
  };

  // Call fetchData when the modal opens
  useEffect(() => {
    console.log("fetching preffs");
    fetchLLMpref(setPreferences, setActiveNum, setFrequency, session);
  }, []);

  useEffect(() => {
    setTextareaValue(preferences[activeNum]);
  }, [activeNum]);

  useEffect(() => {
    setPreferences((prev) => {
      const newPrefs = [...prev];
      newPrefs[activeNum] = textareaValue;
      return newPrefs;
    });
  }, [textareaValue]);

  useEffect(() => {
    console.log(preferences);
  }, [preferences]);

  const prefArray = [0, 1, 2, 3, 4];

  return (
    <>
      <SheetContent className="text-gray-400 sm:max-w-[800px] rounded-l-lg">
        <SheetHeader>
          <SheetTitle> Set Prefferences</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          <div className="mb-3">
            <label htmlFor="prefTextArea" className="form-label">
              Notetaking Preferences
            </label>
            <textarea
              className="form-control"
              id="prefTextArea"
              rows="6"
              value={textareaValue || ""}
              onChange={(e) => setTextareaValue(e.target.value)}
            ></textarea>

            <div className="flex flex-row space-x-4 mt-2.5">
              {prefArray.map((num) => (
                <div
                  className={
                    num === activeNum && `border-b-2 border-gray-700 pb-2`
                  }
                >
                  <Button
                    key={num}
                    className={`text-white hover:bg-gray-700`}
                    onClick={(event) => {
                      setActiveNum(num);
                    }}
                  >
                    {num + 1}
                  </Button>
                </div>
              ))}
            </div>

            <label htmlFor="freqRange" className="my-3 mt-4">
              Note Frequency (minutes) cskdfjskld
            </label>
            <Slider
              min={350}
              max={1500}
              step={5}
              defaultValue={[frequency]}
              onChange={(e, newValue) => setFrequency(newValue)}
              id="freqRange"
            ></Slider>

            {/* <input
              type="range"
              className="form-range"
              min="350"
              max="1500"
              step="5"
              id="freqRange"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
                ></input>*/}
            <div className="d-flex justify-content-between mb-4 mt-1 pb-2 border-bottom">
              <div>Quicker (1m)</div>
              <div>Average (3m)</div>
              <div>Slower (5m)</div>
            </div>
          </div>
          <div className="row align-items-center mt-2">
            <div className="col">
              <Button onClick={handleSubmitLLM}>Submit</Button>
            </div>
            <div className="col-lg-6 col-sm-9 ms-auto">
              {showAlert && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check2-circle me-2"></i>
                  Notetaking preference submitted
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex p-3 border-top">
          <Button className="me-auto" onClick={() => resetTranscript()}>
            Clear Transcript
          </Button>
          <SheetClose asChild>
            <Button type="submit">Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </>
  );
}

export default ControlModalShad;
