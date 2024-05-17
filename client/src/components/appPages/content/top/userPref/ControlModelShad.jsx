import React, { useState, useEffect } from "react";
import { handleSendLLM } from "@/api/crud/user/setNotepref";
import { useAuth } from "../../../../../hooks/userHooks/auth";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
  Sheet,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UploadNotes from "../../../modalsToast/UploadNotes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPref } from "@/hooks/userHooks/userPreff";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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
    guidedNotes,
    setGuidedNotes,
  } = useUserPref();

  //LLM preffereences
  //Value of LLMPref text box
  const [textareaValue, setTextareaValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [textKey, setTextKey] = useState(0);
  const [activeTab, setActiveTab] = useState("note");

  //Set prefferences when called
  const handleSubmitLLM = (
    preferences,
    frequency,
    activeNum,
    guidedNotes,
    session
  ) => {
    handleSendLLM(preferences, frequency, activeNum, guidedNotes, session);
    toast.success("Preferences Saved");
  };

  // Call fetchData when the modal opens
  useEffect(() => {
    if (inDevelopment) {
      console.log("fetching preffs");
    }
    //this may not be needed because of hook
    //fetchLLMpref(setPreferences, setActiveNum, setFrequency, session);
  }, []);

  useEffect(() => {
    setTextareaValue(preferences[activeTab][activeNum[activeTab]]);
  }, [activeNum, activeTab]);

  useEffect(() => {
    if (inDevelopment) {
      //console.log(activeNum);
    }
    setPreferences((prev) => {
      if (inDevelopment) {
        //console.log("activeTab", activeTab);
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
      //console.log("pref", preferences);
    }
  }, [preferences]);

  const prefArray = [0, 1, 2, 3, 4];
  const typeArray = ["note", "diagram"];

  useEffect(() => {
    guidedNotes
      ? toast.info(
          "Make sure to set preferences accordingly to make the most out of guided notes"
        )
      : () => {};
  }, [guidedNotes]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          as="a"
          className="block rounded-md px-3 py-2 text-base text-gray-400 dark:text-gray-300 dark:hover:text-white hover:text-gray-700"
        >
          <i className="bi bi-person-gear" style={{ fontSize: "1.5rem" }}></i>
        </div>
      </SheetTrigger>

      <SheetContent className="text-gray-400 sm:max-w-[800px] rounded-l-lg flex-col flex justify-between ">
        <div className="min-width-[320px] overflow-auto">
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
                  <div className="border rounded-lg p-6 mt-3 mb-5">
                    <UploadNotes
                      activeNum={activeNum}
                      setPreferences={setPreferences}
                      setTextareaValue={setTextareaValue}
                      preferences={preferences}
                    />
                  </div>
                )}
                {typeArray.map((type) => (
                  <TabsContent key={type} value={type}>
                    <div className="px-1">
                      <Textarea
                        className="form-control p-6 border rounded-lg w-full"
                        id="prefTextArea"
                        rows="6"
                        value={
                          textareaValue || preferences[type][activeNum[type]]
                        }
                        onChange={(e) => setTextareaValue(e.target.value)}
                      ></Textarea>
                    </div>

                    <div className="flex flex-row s overflow-x-auto px-6 py-6 rounded-xl border justify-between mt-4">
                      <div>
                        <div className="text-lg text-gray-700 dark:text-gray-300">
                          Prompt Selection
                        </div>
                        <div>Each prompt corresponds to the text input</div>
                      </div>
                      <div className="flex flex-row space-x-5 ms-5 jusify-center items-center">
                        {prefArray.map((num) => (
                          <Button
                            className={`  ${
                              num === activeNum[type]
                                ? "bg-gray-700 text-white hover:bg-gray-700 text-white dark:bg-gray-500 dark:hover:bg-gray-500"
                                : " "
                            }`}
                            variant="secondary"
                            onClick={(event) => {
                              setActiveNum((prevNum) => {
                                return { ...prevNum, [type]: num };
                              });
                            }}
                            key={num}
                          >
                            {num + 1}
                          </Button>
                        ))}
                      </div>
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
              <div className="mt-5 border px-6 py-6 rounded-xl ">
                <label
                  htmlFor="freqRange"
                  className="my-3 mt-4 pt-4 text-lg text-gray-700 dark:text-gray-300"
                >
                  Note Generation Speed (minutes)
                </label>
                <Slider
                  className={cn(
                    "border",
                    "border-gray-300",
                    "rounded-full",
                    "mt-6"
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
                <div className="justify-between flex flex-row mt-5 ">
                  <div>Quicker (1m)</div>
                  <div>Average (3m)</div>
                  <div>Slower (5m)</div>
                </div>
              </div>

              <div className="flex flex-row justify-between my-5 border px-6 py-6 rounded-xl ">
                <div className="">
                  <div className="text-lg text-gray-700 dark:text-gray-300">
                    Guided Note Mode
                  </div>
                  <div>Create partial generations that you fill in</div>
                </div>
                <div className="my-auto">
                  <Switch
                    defaultChecked={guidedNotes}
                    onCheckedChange={() =>
                      setGuidedNotes((i) => {
                        return !i;
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="sm:flex-row flex-col flex justify-between gap-y-2 sm:gap-y-0">
              <Button
                onClick={() => {
                  handleSubmitLLM(
                    preferences,
                    frequency,
                    activeNum,
                    guidedNotes,
                    session
                  );
                }}
                variant="secondary"
                className=""
              >
                Save Preference
              </Button>
              <SheetClose asChild>
                <Button type="submit" variant="secondary" className="">
                  Close
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ControlModalShad;
