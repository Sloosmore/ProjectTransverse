import cornerFolder from "../../../assets/cornerFolder1.png";
import cornerPref from "../../../assets/cornerPref1.png";

const Corner = () => {
  return (
    <div className="text-gray-500">
      <div className="h-screen flex items-center border-t bg-gray-100 w-full">
        <div className="md:flex-row flex flex-col w-full">
          <div className="flex md:flex-col flex-grow md:mx-6 sm:mx-20 mx-12 md:mb-0 mb-10 md:w-1/2 sm:justify-center items-start">
            <div className="h-full self-start align-items flex flex-col justify-center md:items-start xl:ms-40 lg:ms-20 md:ms-10">
              <h2 className="mb-6  text-left me-4">
                The world’s first real-time note taker and diagram generator.
              </h2>
              <ul className="gap-y-6 flex-col flex items-start">
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-gray-500 "></i>
                  Understands how you take notes
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-gray-500"></i>
                  Diagram and Note Generatation
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-gray-500"></i>
                  Real-time note taking
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center flex-grow md:w-5/12 md:me-10">
            <img
              src={cornerFolder}
              alt=""
              className="object-cover lg:rounded-[2rem] rounded-lg shadow-xl ring-2 ring-gray-200 ring-opacity-50 lg:h-[600px] h-[400px]"
            />
          </div>
        </div>
      </div>
      <div className="h-screen flex items-center border-t w-full">
        <div className="md:flex-row flex flex-col-reverse w-full">
          <div className="flex justify-center flex-grow md:w-5/12 md:ms-20 xl:ms-40">
            <img
              src={cornerPref}
              alt=""
              className="object-cover lg:rounded-[2rem] rounded-lg shadow-xl ring-2 ring-gray-200 ring-opacity-50 lg:h-[600px] h-[400px]"
            />
          </div>
          <div className="flex flex-col flex-grow md:mx-6 sm:mx-20 mx-12 md:mb-0 mb-10 md:w-1/2 sm:justify-center items-start mt-10 md:mt-0">
            <div className="h-full self-start align-items flex flex-col justify-center md:items-start xl:ms-40 lg:ms-20 md:ms-10">
              <h2 className="mb-6  text-left me-4">
                Personalize notes with ease
              </h2>
              <ul className="gap-y-6 flex-col flex items-start">
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-gray-500 "></i>
                  Prompt exactly what you need
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-gray-500"></i>
                  Control style and explanation
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-gray-500"></i>
                  Better Note taking over time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corner;
