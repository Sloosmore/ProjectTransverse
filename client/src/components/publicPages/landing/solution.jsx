import { useState } from "react";
import preferences from "../../../assets/preferences.png";
import refine from "../../../assets/reasons.png";
import capture from "../../../assets/capture.png";
import generate from "../../../assets/generate.png";
import "./blockText.css";

const VrseFix = () => {
  const [activePoint, setActivePoint] = useState(preferences);

  const steps = [
    {
      title: "Generate notes on the fly",
      description:
        "Create notes from the transcript quickly putting more time in your hands to focus on the class",
      state: generate,
    },
    {
      title: "Capture everything",
      description:
        "Record classes, get a live transcript and take notes all at once",
      state: capture,
    },
    {
      title: "Add your note prefferenes",
      description:
        "Add your note prefferences and we will help you keep up with your notes",
      state: preferences,
    },

    {
      title: "Refine over time",
      description:
        "Improve your prompts and styles over time to get the best out of your notes",
      state: refine,
    },
  ];

  return (
    <div className=" flex-col xl:h-screen sm:mx-20 justify-center items-center flex">
      <h2 className="text-5xl text-center  gradient-text lg:my-14 my-20   ">
        vrse fixes this
      </h2>
      <div className="flex flex-col-reverse lg:flex-row items-center w-full justify-between">
        <div className="flex justify-center min-w-[30rem]">
          <div className="flex flex-col lg:my-0 my-12">
            {steps.map((item) => (
              <button
                className={`items-center space-x-2 rounded-md px-4 py-3 text-left text-sm hover:bg-accent aria-selected:bg-accent mb-4 ${
                  item.state === activePoint ? "bg-accent" : ""
                }`}
                key={item.title}
                onClick={() => setActivePoint(item.state)}
              >
                <div>
                  <h3 className="text-2xl text-gray-600">{item.title}</h3>
                </div>
              </button>
            ))}
            <div className="w-72 mx-auto border-t pt-6 ">
              {steps.find((item) => item.state === activePoint).description}
            </div>
          </div>
        </div>
        <div className="mx-10 md:mx-0">
          <img
            src={activePoint}
            alt=""
            className="lg:max-h-[42rem] max-h-[35rem] ring ring-gray-100 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default VrseFix;
