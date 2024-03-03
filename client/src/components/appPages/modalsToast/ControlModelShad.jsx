import React, { useState, useEffect } from "react";
import { handleSendLLM, fetchLLMpref } from "../services/setNotepref";
import { useAuth } from "../../../hooks/auth";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UploadNotes from "./UploadNotes";

function ControlModalShad({ show, handleClose, noteData, controlProps }) {
  const { session } = useAuth();

  //LLM preffereences
  const [preferences, setPreferences] = useState([]);
  //Value of LLMPref text box
  const [textareaValue, setTextareaValue] = useState("");

  const [frequency, setFrequency] = useState(0);

  const [showAlert, setShowAlert] = useState(false);

  const [activeNum, setActiveNum] = useState(0);

  const [textKey, setTextKey] = useState(0);

  //Set prefferences when called
  const handleSubmitLLM = (preferences, frequency, activeNum, session) => {
    handleSendLLM(preferences, frequency, activeNum, session);
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
  }, [textareaValue, activeNum]);

  const prefArray = [0, 1, 2, 3, 4];

  return (
    <SheetContent className="text-gray-400 sm:max-w-[800px] rounded-l-lg flex-col flex justify-between ">
      <div className="min-width-[320px]">
        <SheetHeader>
          <SheetTitle> Set Prefferences</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col mt-3">
          <div className="mb-3 flex-col flex">
            <label htmlFor="prefTextArea" className="form-label">
              Notetaking Preferences
            </label>
            <textarea
              className="form-control p-3 border rounded"
              id="prefTextArea"
              rows="6"
              value={textareaValue || preferences[activeNum]}
              onChange={(e) => setTextareaValue(e.target.value)}
            ></textarea>

            <div className="flex flex-row sm:space-x-4 space-x-1 mt-2.5 overflow-x-auto">
              {prefArray.map((num) => (
                <div
                  className={
                    num === activeNum ? "border-b-2 border-gray-700 pb-2" : ""
                  }
                  key={num}
                >
                  <Button
                    className={`hover:bg-gray-700 hover:text-white bg-gray-200`}
                    variant="secondary"
                    onClick={(event) => {
                      setActiveNum(num);
                    }}
                  >
                    {num + 1}
                  </Button>
                </div>
              ))}
            </div>

            <label htmlFor="freqRange" className="my-3 mt-4 pt-4 border-t">
              Note Frequency (minutes)
            </label>
            <Slider
              className={cn(
                "border",
                "border-gray-300",
                "rounded-full",
                "mt-3"
              )}
              min={350}
              max={1500}
              step={5}
              defaultValue={[frequency]}
              onValueChange={(v) => setFrequency(...v)}
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
            <div className="justify-between flex flex-row mb-2 mt-3 pb-3 border-b">
              <div>Quicker (1m)</div>
              <div>Average (3m)</div>
              <div>Slower (5m)</div>
            </div>
          </div>

          <UploadNotes
            activeNum={activeNum}
            setPreferences={setPreferences}
            setTextareaValue={setTextareaValue}
          />

          <div className="sm:flex-row flex-col flex justify-between mt-4 gap-y-2 sm:gap-y-0">
            <Button
              onClick={() => {
                handleSubmitLLM(preferences, frequency, activeNum, session);
              }}
              variant="secondary"
              className="bg-gray-200"
            >
              Save Prefference
            </Button>
            <SheetClose asChild>
              <Button type="submit" variant="secondary" className="bg-gray-200">
                Close
              </Button>
            </SheetClose>
          </div>
        </div>
      </div>
      <div className="p-3 flex justify-end">
        {showAlert && (
          <div
            className="alert alert-success shadow-lg flex flex-row p-4 rounded-lg translate-x-4 translate-y-4"
            role="alert"
          >
            <i className="bi bi-check2-circle me-2"></i>
            <p>Notetaking preference submitted</p>
          </div>
        )}
      </div>
    </SheetContent>
  );
}

export default ControlModalShad;
