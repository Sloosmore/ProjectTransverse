import { useState } from "react";
import preferences from "../../../assets/staticPages/preferences.png";
import refine from "../../../assets/staticPages/reasons.png";
import capture from "../../../assets/staticPages/capture.png";
import generate from "../../../assets/staticPages/generate.png";
import "./blockText.css";

const VrseFix = () => {
  const [activePoint, setActivePoint] = useState(preferences);

  const steps = [
    {
      title: "Generate notes on the fly",
      description:
        "Create notes and diagrams quickly letting you focus on the class",
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
      <div className="lg:py-10 py-20 xl:mb-5 ">
        <h2 className="text-5xl text-center  gradient-text pb-3 ">
          vrse fixes this through understanding you
        </h2>
        <h3 className="text-gray-500">
          We take in a real time transcrcript and your preferences to generate
          real time full/guided notes and diagrams
        </h3>
      </div>
      <div className="flex flex-col-reverse lg:flex-row items-center w-full justify-between">
        <div className="flex justify-center md:min-w-[30rem] flex-grow">
          <div className="flex lg:flex-col flex-col-reverse lg:my-0 my-12 2xl:me-10">
            <div className="flex-col flex">
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
            </div>
            <div className="w-72 mx-auto lg:border-t lg:border-b-0 border-b lg:pt-6 pb-6 ">
              {steps.find((item) => item.state === activePoint).description}
            </div>
          </div>
        </div>
        <div className="mx-10 md:mx-0 xl:me-10">
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
