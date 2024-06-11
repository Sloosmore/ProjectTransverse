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
import { FileCog } from "lucide-react";
import VisSettings from "./visPref";

const TabGen = ({
  type,
  textareaValue,
  preferences,
  activeNum,
  setTextareaValue,
  prefArray,
  setActiveNum,
  frequency,
  setFrequency,
  guidedNotes,
  setGuidedNotes,
}) => {
  const { setFontColor, fontColor, setFontSize, fontSize } = useUserPref();

  return (
    <TabsContent key={type} value={type}>
      <div
        className="px-1"
        style={{
          ...(fontSize ? { fontSize: `${fontSize}rem` } : {}),
          ...(fontColor ? { color: fontColor } : {}),
        }}
      >
        <Textarea
          className="form-control p-6 border rounded-lg w-full"
          id="prefTextArea"
          rows="6"
          style={
            fontSize
              ? {
                  fontSize: `${fontSize}rem`,
                  lineHeight: `${fontSize * 1.5}rem`,
                }
              : {}
          }
          value={textareaValue || preferences[type][activeNum[type]]}
          onChange={(e) => setTextareaValue(e.target.value)}
        ></Textarea>
      </div>
      <div
        className="flex sm:flex-row flex-col  overflow-x-auto px-6 py-6 rounded-xl border justify-between mt-4"
        style={fontSize ? { fontSize: `${fontSize}rem` } : {}}
      >
        <div>
          <div
            className="text-lg text-gray-700 dark:text-gray-300"
            style={fontSize ? { fontSize: `${fontSize * 1.2}rem` } : {}}
          >
            Prompt Selection
          </div>
          <div>Each prompt corresponds to the text input</div>
        </div>
        <div className="flex flex-row sm:space-x-5 sm:ms-5 sm:justify-center justify-between items-center my-auto">
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
      <div className="mt-5 border px-6 py-6 rounded-xl ">
        <label
          htmlFor="freqRange"
          className="my-3 mt-4 pt-4 text-lg text-gray-700 dark:text-gray-300"
          style={fontSize ? { fontSize: `${fontSize * 1.2}rem` } : {}}
        >
          Note Generation Speed (minutes)
        </label>
        <Slider
          className={cn("border", "border-gray-300", "rounded-full", "mt-6")}
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
        <div
          className="justify-between flex flex-row mt-5 "
          style={{
            ...(fontSize ? { fontSize: `${fontSize}rem` } : {}),
            ...(fontColor ? { color: fontColor } : {}),
          }}
        >
          <div>Quicker (1m)</div>
          <div>Average (3m)</div>
          <div>Slower (5m)</div>
        </div>
      </div>
      <div className="flex flex-row justify-between my-5 border px-6 py-6 rounded-xl ">
        <div className="">
          <div
            className="text-lg text-gray-700 dark:text-gray-300"
            style={fontSize ? { fontSize: `${fontSize * 1.2}rem` } : {}}
          >
            Guided Note Mode
          </div>
          <div style={fontSize ? { fontSize: `${fontSize}rem` } : {}}>
            Create partial generations that you fill in
          </div>
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
    </TabsContent>
  );
};

export default TabGen;
