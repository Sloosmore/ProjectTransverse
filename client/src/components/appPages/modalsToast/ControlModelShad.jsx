import React, { useState, useEffect } from "react";
import { handleSendLLM, fetchLLMpref } from "../services/setNotepref";
import { useAuth } from "../../../hooks/userHooks/auth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPref } from "@/hooks/userHooks/userPreff";
import { toast } from "sonner";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

function ControlModalShad() {
  const { session } = useAuth();
  const {
    preferences,
    setPreferences,
    activeNum,
    setActiveNum,
    frequency,
    setFrequency,
  } = useUserPref();

  //LLM preffereences
  //Value of LLMPref text box
  const [textareaValue, setTextareaValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [textKey, setTextKey] = useState(0);
  const [activeTab, setActiveTab] = useState("note");

  //Set prefferences when called
  const handleSubmitLLM = (preferences, frequency, activeNum, session) => {
    handleSendLLM(preferences, frequency, activeNum, session);
    toast.success("Preferences Saved");
  };

  // Call fetchData when the modal opens
  useEffect(() => {
    if (inDevelopment) {
      console.log("fetching preffs");
    }
    fetchLLMpref(setPreferences, setActiveNum, setFrequency, session);
  }, []);

  useEffect(() => {
    setTextareaValue(preferences[activeTab][activeNum[activeTab]]);
  }, [activeNum, activeTab]);

  useEffect(() => {
    if (inDevelopment) {
      console.log(activeNum);
    }
    setPreferences((prev) => {
      if (inDevelopment) {
        console.log("activeTab", activeTab);
      }
      return {
        ...prev,
        [activeTab]: prev[activeTab].map((item, index) =>
          index === activeNum[activeTab] ? textareaValue : item
        ),
      };
    });
  }, [textareaValue, activeNum, activeTab]);

  useEffect(() => {
    if (inDevelopment) {
      console.log("pref", preferences);
    }
  }, [preferences]);

  const prefArray = [0, 1, 2, 3, 4];
  const typeArray = ["note", "diagram"];

  return (
    <SheetContent className="text-gray-400 sm:max-w-[800px] rounded-l-lg flex-col flex justify-between ">
      <div className="min-width-[320px]">
        <SheetHeader>
          <SheetTitle> Set Preferences</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col mt-3">
          <div className="mb-3 flex-col flex">
            <Tabs
              defaultValue="note"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="note">Notes</TabsTrigger>
                <TabsTrigger value="diagram">Diagrams</TabsTrigger>
              </TabsList>
              {activeTab === "note" && (
                <UploadNotes
                  activeNum={activeNum}
                  setPreferences={setPreferences}
                  setTextareaValue={setTextareaValue}
                  preferences={preferences}
                />
              )}
              {typeArray.map((type) => (
                <TabsContent key={type} value={type}>
                  <textarea
                    className="form-control p-3 border rounded w-full"
                    id="prefTextArea"
                    rows="6"
                    value={textareaValue || preferences[type][activeNum[type]]}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  ></textarea>
                  <div className="flex flex-row sm:space-x-4 space-x-1 mt-2.5 overflow-x-auto">
                    {prefArray.map((num) => (
                      <div
                        className={
                          num === activeNum[type]
                            ? "border-b-2 border-gray-700 pb-2"
                            : ""
                        }
                        key={num}
                      >
                        <Button
                          className={`hover:bg-gray-700 hover:text-white bg-gray-200`}
                          variant="secondary"
                          onClick={(event) => {
                            setActiveNum((prevNum) => {
                              return { ...prevNum, [type]: num };
                            });
                          }}
                        >
                          {num + 1}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            {/*
            <textarea
              className="form-control p-3 border rounded"
              id="prefTextArea"
              rows="6"
              value={textareaValue || preferences[activeNum]}
              onChange={(e) => setTextareaValue(e.target.value)}
            ></textarea>
              */}

            <label htmlFor="freqRange" className="my-3 mt-4 pt-4 border-t">
              Note Generation Speed (minutes)
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

          <div className="sm:flex-row flex-col flex justify-between mt-4 gap-y-2 sm:gap-y-0">
            <Button
              onClick={() => {
                handleSubmitLLM(preferences, frequency, activeNum, session);
              }}
              variant="secondary"
              className="bg-gray-200"
            >
              Save Preference
            </Button>
            <SheetClose asChild>
              <Button type="submit" variant="secondary" className="bg-gray-200">
                Close
              </Button>
            </SheetClose>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}

export default ControlModalShad;
