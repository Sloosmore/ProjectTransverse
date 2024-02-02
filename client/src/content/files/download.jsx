import { ButtonGroup, ToggleButton, Button } from "react-bootstrap";
import { useState } from "react";
import "./files.jsx";
import { sendDownload } from "../../services/downloadNote.js";

const radios = [{ name: "Word" }, { name: "PDF" }];

function DownloadMd(noteID) {
  const [radioValue, setRadioValue] = useState(0); // Initialize with 0

  return (
    <div className="row mb-3">
      <div className="col">
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              variant="info-outline"
              type="radio"
              name="radio"
              checked={radioValue === idx} // Compare with idx
              onClick={() => setRadioValue(idx)} // Set state to idx
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      <div className="col justify-content-end d-flex">
        <Button
          variant="secondary"
          onClick={() => sendDownload(noteID, radios[radioValue].name)}
        >
          Download
        </Button>
      </div>
    </div>
  );
}

export default DownloadMd;
