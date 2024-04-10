import { addToWaitlist } from "./waitlist";
import { useState } from "react";
import "../landing/blockText.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function WaitlistScreen({}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const onEmailSubmit = async () => {
    //check if valid email
    const res = await addToWaitlist(email);
    if (!res) {
      toast.error("Invalid email");
    } else {
      toast.success(
        "You have been added to the waitlist! Going back to home..."
      );
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center flex-col w-full">
      <h2 className="text-gray-500 flex justify-center text-4xl mx-4 text-center">
        Join the waitlist today
      </h2>
      <div className="my-10 flex md:flex-row justify-center items-center flex-col w-full">
        <input
          type="text"
          className="border focus:ring-1 focus:border-gray focus:outline-gray-300 focus-visible:ring-0 p-2 me-2 rounded-lg ps-4 md:w-[500px] md:mx-0 w-3/4 py-3 "
          placeholder="Email Here"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEmailSubmit();
            }
          }}
        />
        <button
          onClick={onEmailSubmit}
          className="px-4py-2 text-lg md:ms-6 px-6 py-3 md:mt-0 mt-6 md:w-auto w-3/4 text-white rounded-xl bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600 "
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
  );
}

export default WaitlistScreen;
