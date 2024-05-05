import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileCog } from "lucide-react";
import { fontStore } from "./editor/fontStore";

function PopoverSetting({ setFontColor, fontColor, setFontSize, fontSize }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="px-2 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer text-gray-400">
          <FileCog className="h-5" strokeWidth={1.75} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Customize Notes</h4>
            <p className="text-sm text-muted-foreground">
              Set the color and text size
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Color</Label>
              <Input
                id="width"
                defaultValue={fontColor ? fontColor : "#6B7280"}
                className="col-span-2 h-8 py-1 px-5 rounded rounded-md"
                type="color"
                onChange={(e) => {
                  setFontColor(e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Text Size</Label>
              <Slider
                min={0.5}
                max={2}
                step={0.125}
                defaultValue={fontSize ? [fontSize] : [1]}
                onValueChange={(v) => {
                  const val = v[0];
                  console.log(val);
                  setFontSize(val);
                  fontStore.set(val);
                }}
                className="col-span-2 h-8 py-1 rounded rounded-md"
              ></Slider>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PopoverSetting;
