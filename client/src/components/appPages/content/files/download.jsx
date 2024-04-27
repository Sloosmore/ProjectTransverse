import { useState } from "react";
import "./files.jsx";
import { sendDownload } from "../../services/downloadNote.js";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button.jsx";

const radios = [{ name: "Word" }, { name: "PDF" }];

function DownloadMd({ noteID, json }) {
  const [radioValue, setRadioValue] = useState(0); // Initialize with 0

  return (
    <div className=" mb-3 flex justify-between">
      <div className="">
        <RadioGroup
          defaultValue={radioValue}
          onValueChange={(value) => {
            console.log(value);
            setRadioValue(value);
          }}
        >
          {radios.map((radio, index) => (
            <div key={index}>
              <RadioGroupItem value={index} id={index} />
              <Label htmlFor={index} className="ms-2">
                {radio.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="self-center">
        <Button
          variant="secondary"
          className="align-middle"
          onClick={(event) => {
            console.log(noteID);
            event.preventDefault();
            if (json.content.length > 1 && json.content[0].content) {
              sendDownload(noteID, radios[radioValue].name);
            } else {
              toast.error("No content to download the file is empty.");
            }
          }}
        >
          Download
        </Button>
      </div>
    </div>
  );
}

export default DownloadMd;
