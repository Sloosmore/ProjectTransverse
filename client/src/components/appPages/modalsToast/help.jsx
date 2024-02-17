import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Button,
  Modal,
  Accordion,
  Card,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import Task from "../sidebar/task";
import { useState } from "react";
import { applyMarkdown } from "../services/noteConfig/applyMD";
import MarkdownElement from "../content/notes/md";

function HelpModal({ show, onClose }) {
  if (!show) {
    return null;
  }
  const [radioValue, setRadioValue] = useState(0);
  const [textArea, setTextArea] =
    useState(`###### Highlight something and then use to buttons to apply markdown 
  - ==highlight==
  - **bold**
  - *italicize*
  - \`code\`
  - the last button will clear any of the markdown when highlighted`);
  const title = ` Take Notes. In real time. Your way.`;
  const radios = [{ name: "Word" }, { name: "PDF" }];

  const content = [
    {
      title: "Setup and Personalization",
      body: () => (
        <>
          <div className=" text-black-50">
            <div>
              To start a new note or set your preffereences nav to the control
              center:
            </div>
            <div className="d-flex mt-2">
              <div
                className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2 shadow"
                role="button"
              >
                <i
                  className="bi bi-three-dots bi-2x align-left me-2"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <span className="mx-auto">Control Center</span>
              </div>
            </div>
            <div className="mt-3">
              From there go to either the preferences tab or the note tab:
              <ul className="mt-2">
                <li>
                  In the <strong>pref tab </strong>you can set how you want your
                  notes to be formated and how you want them to be explained
                  through natural launguage
                </li>
                <li className="mt-1">
                  In the <strong>note tab</strong> you can set the title of your
                  note and start taking notes
                </li>
              </ul>
              From there hit submit and you can find your notes in the notes tab
            </div>
            <div className="d-flex mt-2">
              <div
                className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2 shadow"
                role="button"
              >
                <i
                  className="bi bi-card-list bi-2x align-left me-3"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <span className="mx-4">Notes</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Notetaking",
      body: () => (
        <>
          <div>
            <div className="text-black-50">
              <div>
                <h6>Notes:</h6>

                <div>
                  Your active note (only one active note at a time) will be
                  denoted by a green blinking light
                </div>
                <div className="justify-content-center d-flex">
                  <div style={{ width: "250px" }}>
                    <Task
                      className=" shadow"
                      name="Active task"
                      state="active"
                      shadow={true}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  Inactive notes will be denoted by a grey light
                </div>
                <div className="justify-content-center d-flex">
                  <div style={{ width: "250px" }}>
                    <Task
                      className=" shadow"
                      name="Inactive task"
                      state="inactive"
                      shadow={true}
                    />
                  </div>
                </div>
              </div>
              <div className="border-top px-3 my-4"></div>
              <div className="">
                <h6>Editing:</h6>
                <div>
                  Inside the notes will be rendered using markdown from the
                  textarea. To get the the textarea click the arrow:
                </div>
                <div className="text-center mt-3">
                  <i
                    className="bi bi-caret-left text-secondary "
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
                <br /> <MarkdownElement element={textArea} />
                <textarea
                  className="form-control mt-3 text-secondary"
                  id="exampleFormControlTextarea1"
                  style={{ height: "15vh", overflow: "auto", resize: "none" }}
                  value={textArea}
                  onChange={(e) => setTextArea(e.target.value)}
                />
                <div>
                  {" "}
                  <div className=" d-flex mt-2 col-4 justify-content-between">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("highlight", textArea, setTextArea)
                      }
                    >
                      <i className="bi bi-marker-tip"></i>{" "}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("bold", textArea, setTextArea)
                      }
                    >
                      <i className="bi bi-type-bold"></i>
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("italic", textArea, setTextArea)
                      }
                    >
                      <i className="bi bi-type-italic "></i>
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("code", textArea, setTextArea)
                      }
                    >
                      <i className="bi bi-code-slash"></i>{" "}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        applyMarkdown("clear", textArea, setTextArea)
                      }
                    >
                      <i className="bi bi-eraser"></i>{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Exporting and File Management",
      body: () => (
        <div className="text-black-50">
          <div>Go to the Files button:</div>
          <div className="d-flex">
            <div
              className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2 shadow"
              role="button"
            >
              <i
                className="bi bi-folder bi-2x align-left"
                style={{ fontSize: "1.5rem" }}
              ></i>{" "}
              <span className="mx-5">Files</span>
            </div>
          </div>
          <div className="mt-4">
            And find the edit button for the specific file:
          </div>
          <div className="text-center mt-3">
            <button className="btn btn-outline-secondary shadow">
              <i className="bi bi-pencil-square"></i>
            </button>
          </div>
          <div className="mt-3">
            From there you can change the title, markdown, visibility in the
            sidebar and more in the edit page.
          </div>
          <br />
          <div>You can also download the markdown as a PDF/Word doc:</div>
          <div className="col justify-content-center d-flex mt-3 ">
            <ButtonGroup>
              {radios.map((radio, idx) => (
                <ToggleButton
                  className="shadow"
                  key={idx}
                  variant="info-outline"
                  type="radio"
                  name="radio"
                  checked={radioValue === idx} // Compare with idx
                  onClick={() => setRadioValue(idx)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      className="text-secondary"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2>{title}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion defaultActiveKey="0">
          {content.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header as={Card.Header}>
                <div className="text-muted">{item.title}</div>
              </Accordion.Header>
              <Accordion.Body>
                <Card.Body>{item.body()}</Card.Body>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default HelpModal;

/*     
    `
  ## Note Personilzation\n 
  - Voice: Say the title of your notes and then afterword say 'note insturctions'\n
  - Command Center: Open the Command Center and enter in custom LLM propmpt\n
  ##\n
  ## Note Taking\n
  - Voice: Say the title of your notes and then "Note Mode" afterword to be\n
  - Command Center: Open the Command Center, navigate to the 2nd accordian tab, enter document name and submit\n
  ##\n
  ## Document Gen\n
  - Voice: give your document a prompt and then say the keyword "tranverse" after a brief pause to send your script to the backend\n
  - Command Center: Open the Command Center and enter in custom LLM propmpt\n
  ##\n
  ## Clear Transcript\n
   - Voice: say "Clear" after pausing breifly while to the model\n
   - Keyboard: Press the C Key\n

   ## Additional Commands\n
   - "Help": Brings up this modal
   `,*/
