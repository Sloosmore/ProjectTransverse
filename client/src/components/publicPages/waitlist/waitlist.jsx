import { addToWaitlist } from "./waitlist";
import { useState } from "react";
import "../landing/blockText.css";
import "./waitlist.css";
import { toast } from "sonner";

function Waitlist({}) {
  const [email, setEmail] = useState("");
  const onEmailSubmit = async () => {
    //check if valid email
    const res = await addToWaitlist(email);
    if (!res) {
      toast.error("Invalid email");
    } else {
      toast.success("You have been added to the waitlist!");
    }
  };

  return (
    <div className="flex justify-center my-20">
      <div className="w-full">
        <h2 className="text-gray-500 flex justify-center text-4xl">
          Join the waitlist today
        </h2>
        <div className="my-10 flex flex-row gap-x-6 justify-center">
          <input
            type="text"
            className="border focus:ring-1 focus:border-gray focus:outline-gray-300 focus-visible:ring-0 p-2 me-2 rounded-lg ps-4 w-[500px] py-3"
            placeholder="Email Here"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            onClick={onEmailSubmit}
            className="px-4 py-2 text-lg text-white rounded-xl bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600"
            style={{
              transition: "all .15s ease",
              boxShadow: "0 0 0 0 rgba(127, 90, 179, 0)",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 0 2px 2px rgba(127, 90, 179, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 0 0 0 rgba(127, 90, 179, 0)";
            }}
          >
            Get In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Waitlist;
