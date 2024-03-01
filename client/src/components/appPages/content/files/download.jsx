import { useState } from "react";
import "./files.jsx";
import { sendDownload } from "../../services/downloadNote.js";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const radios = [{ name: "Word" }, { name: "PDF" }];

function DownloadMd({ noteID }) {
  const [radioValue, setRadioValue] = useState(0); // Initialize with 0

  return (
    <div className=" mb-3 flex justify-between">
      <div className="">
        <RadioGroup
          defaultValue={radioValue}
          onChange={(value) => setRadioValue(value)}
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
          onClick={() => sendDownload(noteID, radios[radioValue].name)}
        >
          Download
        </Button>
      </div>
    </div>
  );
}

export default DownloadMd;
