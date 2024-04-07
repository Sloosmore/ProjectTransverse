import React from "react";
import "../landing/blockText.css";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../config/supabaseClient";
import { useCode } from "@/hooks/code";
import { useNavigate } from "react-router-dom";

const CodeCheck = () => {
  const { setCodePass } = useCode();
  const [codeValue, setCodeValue] = useState("");
  const [falseCode, setFalseCode] = useState(false);
  const navigate = useNavigate();

  const checkCode = async () => {
    try {
      const uuidRegex =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

      if (uuidRegex.test(codeValue)) {
        const { data: codeData, error } = await supabaseClient
          .from("code")
          .select()
          .eq("code_id", codeValue);

        if (error) {
          console.error("Error fetching code:", error);
        } else if (codeData.length > 0) {
          setCodePass(true);
          navigate("/login");
          console.log("Column exists:", codeData);
        } else {
          console.log("Column does not exist");
        }
      } else {
        const { data: emailData, error: emailError } = await supabaseClient
          .from("user")
          .select()
          .eq("email", codeValue);

        if (emailError) {
          console.error("Error fetching code:", emailData);
        } else if (emailData[0]) {
          setCodePass(true);
          setTimeout(() => {
            navigate("/login");
          }, [200]);
          console.log("Column exists:", emailData);
        } else {
          setFalseCode(true);
        }
      }
    } catch {}
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1> Enter a Code or Email if you are already signed up</h1>
      <p className="mt-3"></p>
      <input
        type="text"
        onChange={(e) => setCodeValue(e.target.value)}
        className="block p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:w-[600px] sm:w-[400px] w-[250px] my-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkCode();
          }
        }}
      />
      <div className="text-white">
        <button
          type="button"
          className="px-4 me-md-2 text-lg bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600 hover:bg-transparent py-2 rounded-md w-[200px]"
          onClick={() => {
            checkCode();
          }}
        >
          Check
        </button>
      </div>
      {falseCode && (
        <div className="text-red-400 mt-6">incorrect code please try again</div>
      )}
    </div>
  );
};

export default CodeCheck;
