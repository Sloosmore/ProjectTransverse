import React from "react";
import { useState } from "react";
import "./help.css";
import icon from "../../../assets/TransverseIcon.svg";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function HelpModalShad({ show, onClose }) {
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

  /**/

  const content = [
    {
      title: "Notetaking Video",
      body: () => (
        <div className="flex justify-center align-center">
          <h2>
            <a
              href="https://www.youtube.com/watch?v=VvOh4cMfcdo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch the video
            </a>
          </h2>
        </div>
      ),
      link: "https://www.youtube.com/watch?v=VvOh4cMfcdo",
    },
    {
      title: "Personalization Video",
      body: () => (
        <div className="flex justify-center align-center">
          <a
            href="https://www.youtube.com/watch?v=oybdf31Xqcs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch the video
          </a>
        </div>
      ),
      link: "https://www.youtube.com/watch?v=oybdf31Xqcs",
    },
    {
      title: "Exporting and File Management",
      body: () => (
        <div className="text-gray-400">
          <div>Hit the transverse Icon to go back home</div>
          <div className="flex justify-center ">
            <div className="shadow rounded-lg mt-2">
              <img className="h-16 w-16 p-2.5" src={icon} alt="Transverse" />
            </div>
          </div>
          <div className="mt-4">
            And find the edit button for the specific file:
          </div>
          <div className="text-center mt-3 flex justify-center">
            <div className=" border-2 border-gray-300 p-4 w-4 h-5 flex justify-center items-center hover:bg-gray-500 rounded-lg hover:text-white">
              <div className="  align-middle  ">
                <i className=" bi bi-gear align-middle "></i>
              </div>
            </div>
          </div>
          <div className="mt-3">
            From there you can change the title, markdown, visibility in the
            sidebar and more in the edit page.
          </div>
          <br />
          <div>You can also download the markdown as a PDF/Word doc:</div>
          <div className="col justify-content-center d-flex mt-3 "></div>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-auto max-h-[500px]">
      <DialogContent className="text-gray-600 dark:text-gray-200 sm:max-w-[500px] sm:max-h-auto md:max-w-[700px] max-w-[350px] lg:max-w-screen-lg h-dvl overflow-y-scroll max-h-screen rounded ">
        <DialogHeader>
          <DialogTitle className=" text-3xl mb-3">How vrse works</DialogTitle>
        </DialogHeader>
        <>
          {content.slice(0, 2).map((item, index) => (
            <h3 key={index} className=" text-2xl  border-b pb-3 pt-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {item.title}
              </a>
            </h3>
          ))}
          <Accordion type="single" collapsible className="w-full ">
            {content.slice(2).map((item, index) => (
              <div key={index + 2}>
                <AccordionItem value={(index + 2).toString()}>
                  <AccordionTrigger>
                    <div className="text-2xl hover:underline">{item.title}</div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>{item.body()}</div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </>
        <DialogFooter>
          <Button
            variant="secondary"
            className=""
            type="button"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}

export default HelpModalShad;

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
   `,
   
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




              <div className=" text-black-50">
            <div>
              <h6 className="mb-6">
                <strong>Start a new note:</strong>
              </h6>
              <div> To start a new note hit the new Note button</div>
              <div className="flex my-8 content-center ">
                <div className="z-10 mx-auto">
                  <button className="bg-gray-100 inline-flex justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-gray-500 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-200">
                    <i
                      className="bi bi-plus-lg"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    <span className="ms-2 flex justify-center items-center w-full text-center my-auto">
                      New Note
                    </span>
                  </button>
                </div>
              </div>
              <div className="my-3">
                From there drop the title of your note and then hit submit
              </div>
              <div
                className={`lg:w-3/4 md:w-5/6 sm:w-11/12 mx-auto z-10 transition-opacity duration-300 p-5 `}
              >
                <div className=" flex flex-row overflow-hidden bg-white [&:has(textarea:focus)]:border-token-border-xheavy shadow-lg w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy rounded-2xl bg-token-main-surface-primary shadow-lg">
                  <input
                    type="text"
                    className="m-0 w-full resize-none border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 max-h-25 py-[10px] pr-4 md:py-3.5 md:pr-12 placeholder-gray-400 dark:placeholder-opacity-100 pl-4 text-gray-800"
                    placeholder="Drop the title here! The title is important because it will help with prompting."
                  />
                  <button className="w-10 h-10 flex-shrink-0 bottom-0 right-0 rounded-lg border border-gray-500 bg-gray-500 text-white transition-colors disabled:text-gray-400 disabled:opacity-10 dark:border-white my-auto me-2">
                    <i
                      className="bi bi-arrow-up-short"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </button>
                </div>
              </div>
              <div className="mb-6">
                Boom you are done and will automatically go to the new note
              </div>
            </div>
            <div className="border-top px-10"></div>
            <h6 className="mt-6">
              <strong>Set Prefferences:</strong>
            </h6>
            <div className="mt-6">
              To set preferences hit the profile icon in the top right corner
            </div>
            <div className="my-6">
              <button className="flex justify-center items-center ml-auto mr-auto w-12 h-12 justify-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500  ring-1 ring-inset ring-gray-300 hover:bg-gray-200 shadow">
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </button>
            </div>
            <div className="my-2.5">
              Then hit <span className="underline">Note Settings</span>
            </div>
            <div>
              From there you can:
              <ul className="list-disc list-inside space-y-1 mt-1.5">
                <li>Set how you want your notes to be formated</li>
                <li>
                  Specify how you want them to be explained through natural
                  launguage
                </li>
                <li>Control how fast the notes are created</li>
              </ul>
            </div>
          </div>


           <div>
            <div className="text-black-50 flex-col">
              <div className=" list-disc list-inside">
                <h5 className="mb-6">
                  <strong> Editing:</strong>
                </h5>
                <p>Edit the notes just like notion!</p>
                <ul className="list-disc list-inside">
                  <li className="p-1">
                    You can drag and drop the notes to move them around
                  </li>
                  <li className="p-1 ">
                    You can highlight the notes and then use the buttons to
                    apply styling
                  </li>
                  <li className="p-1 ">
                    You use the markdown to apply styling
                  </li>
                  <li className="p-1 ">
                    and hit slash to bring up the more features
                  </li>
                </ul>
              </div>
              <div className="border-top px-10 my-6"></div>

              <div className="flex-col">
                <h5 className="my-6">
                  <strong> Recording:</strong>
                </h5>
                <div>
                  <p>
                    Find the recording button on the transcript and editing side
                    of the notes
                  </p>
                  <p>
                    Toggle the pause play button group to start and stop
                    recording
                  </p>
                </div>
                <h6 className="mt-2">While Playing:</h6>
                <div className="flex justify-center items-center my-6">
                  <div className="">
                    <i
                      className={`${"bi bi-record2 bi-2x align-left"} align-middle my-auto hover:bg-gray-100 rounded p-2.5`}
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  </div>
                  <div className="">
                    <i
                      className={`${"bi bi-square-fill"} align-middle my-auto hover:bg-gray-100 rounded p-2.5`}
                    ></i>
                  </div>
                </div>
                <h6>While Paused:</h6>
                <div className="flex justify-center items-center my-6">
                  <div className="flex justify-center items-center my-6">
                    <div className="">
                      <i
                        className={`${"bi bi-pause-fill bi-2x align-left"} align-middle my-auto hover:bg-gray-100 rounded p-2.5`}
                        style={{ fontSize: "1.2rem" }}
                      ></i>
                    </div>
                    <div className="">
                      <i
                        className={`${" bi bi-square-fill"} align-middle my-auto hover:bg-gray-100 rounded p-2.5`}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
   */
