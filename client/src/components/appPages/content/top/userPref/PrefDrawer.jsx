import React, { useState, useEffect } from "react";
import { handleSendLLM } from "@/api/crud/user/setNotepref";
import { useAuth } from "../../../../../hooks/userHooks/auth";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import UploadNotes from "../../../modalsToast/UploadNotes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPref } from "@/hooks/userHooks/userPreff";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import VisSettings from "./visPref";
import TabGen from "./genTabContent";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

function ControlDrawerShad() {
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
  const [activeTab, setActiveTab] = useState("note");

  const [open, setOpen] = useState(false);

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
    activeTab !== "vis" &&
      setTextareaValue(preferences[activeTab][activeNum[activeTab]]);
  }, [activeNum, activeTab]);

  useEffect(() => {
    if (inDevelopment) {
      //console.log(activeNum);
    }
    activeTab !== "vis" &&
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
    guidedNotes && open
      ? toast.info(
          "Make sure to set preferences accordingly to make the most out of guided notes"
        )
      : () => {};
  }, [guidedNotes]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          as="a"
          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          Note Settings
        </div>
      </DrawerTrigger>

      <DrawerContent className="text-gray-400 flex-col flex justify-between p-5">
        <div className="min-width-[320px]">
          <DrawerHeader>
            <DrawerTitle> Set Preferences</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col mt-3 overflow-auto max-h-[500px]">
            <div className="sm:mb-3 flex-col flex">
              <Tabs
                defaultValue="note"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="note">Notes Gen</TabsTrigger>
                  <TabsTrigger value="diagram">Diagrams Gen</TabsTrigger>
                  <TabsTrigger value="vis">Visualization</TabsTrigger>
                </TabsList>
                {activeTab !== "vis" ? (
                  typeArray.map((type, index) => (
                    <TabGen
                      key={index}
                      type={type}
                      textareaValue={textareaValue}
                      preferences={preferences}
                      activeNum={activeNum}
                      setTextareaValue={setTextareaValue}
                      prefArray={prefArray}
                      setActiveNum={setActiveNum}
                      frequency={frequency}
                      setFrequency={setFrequency}
                      guidedNotes={guidedNotes}
                      setGuidedNotes={setGuidedNotes}
                    />
                  ))
                ) : (
                  <div>
                    <VisSettings />
                  </div>
                )}
              </Tabs>
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
              <DrawerClose asChild>
                <Button type="submit" variant="secondary" className="">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ControlDrawerShad;
