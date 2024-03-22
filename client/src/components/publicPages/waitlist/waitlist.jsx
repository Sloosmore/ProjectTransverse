import { addToWaitlist } from "./waitlist";
import { useState } from "react";
import "../landing/blockText.css";

function Waitlist({}) {
  const [email, setEmail] = useState("");
  const onEmailSubmit = async () => {
    //check if valid email
    await addToWaitlist(email);
  };

  return (
    <div className="flex justify-center">
      <div className="">
        <h2 className="text-gray-500 flex justify-center">
          Join the waitlist today
        </h2>
        <div className="my-10 flex gap-x-6 justify-center">
          <input
            type="text"
            className="border focus:ring-0 focus:border-gray focus:outline-none focus-visible:ring-0 p-2 me-2 rounded-lg ps-4 "
            placeholder="Email Here"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            onClick={onEmailSubmit}
            className="px-4 py-2  text-white rounded-md bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Waitlist;
