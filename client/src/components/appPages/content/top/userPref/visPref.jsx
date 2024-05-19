import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileCog } from "lucide-react";
import { fontStore } from "../../novel/editor/fontStore";
import { useUserPref } from "@/hooks/userHooks/userPreff";
import { useDebouncedCallback } from "use-debounce";
import { useAuth } from "@/hooks/userHooks/auth";
import { handleTextUpdate } from "@/api/crud/user/visualNotes";
import { useEffect } from "react";

function VisSettings() {
  const { setFontColor, fontColor, setFontSize, fontSize } = useUserPref();
  const { session } = useAuth();

  const upText = useDebouncedCallback(async (color, size) => {
    handleTextUpdate(size, color, session);
  }, 500);

  useEffect(() => {
    upText(fontColor, fontSize);
  });
  return (
    <div className="w-full sm:mb-4 mb-2">
      <div className="mt-6 mb-8 ">
        <div className=" flex flex-row border rounded-lg p-5 mb-6 items-center py-8">
          <Label
            htmlFor="width"
            className="text-lg text-gray-700 dark:text-gray-300 flex flex-col"
          >
            Note Text Color
            <div className="text-gray-500 text-base font-normal">
              {" "}
              Sets the color of text inside notes{" "}
            </div>
          </Label>

          <Input
            id="width"
            value={fontColor ? fontColor : "#6B7280"}
            className="col-span-2 w-2/4 h-10 py-1 px-5 rounded rounded-md border-0 ms-auto"
            type="color"
            onChange={(e) => {
              setFontColor(e.target.value);
            }}
          />
        </div>
        <div className=" flex flex-row border rounded-lg p-5 py-8 mb-6 items-center">
          <Label
            htmlFor="maxWidth"
            className="text-lg text-gray-700 dark:text-gray-300 flex flex-col"
          >
            Note Text Size
            <div className="text-gray-500 text-base font-normal">
              {" "}
              Sets the size of text inside notes
            </div>
          </Label>
          <Slider
            min={0.5}
            max={2}
            step={0.125}
            value={fontSize ? [fontSize] : [1]}
            onValueChange={(v) => {
              const val = v[0];
              fontStore.set(val);
              setFontSize(val);
            }}
            className="col-span-2 h-8 py-1 rounded rounded-md px-6 w-1/2 ms-auto"
          ></Slider>
        </div>
      </div>
      <div className="justify-self-end flex sm:mt-3">
        <Button
          variant="secondary"
          onClick={() => {
            setFontColor(null);
            setFontSize(1);
            fontStore.set(1);
          }}
          className="sm:w-auto w-full flex"
        >
          Reset Settings
        </Button>
      </div>
    </div>
  );
}

export default VisSettings;
