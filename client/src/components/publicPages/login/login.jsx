import { Auth } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./login.css";
import { useAuth } from "../../../hooks/userHooks/auth";
import { useTheme } from "@/hooks/theme";

const talkingPoints = [
  "Live Personoalized Generated Notes & Diagrams",
  "Recorded Audio Matched to Generatations",
  "Live Transcripts",
  "Easy Exports",
  "And More!",
];

const lightTheme = {
  style: {
    button: {
      borderRadius: "10px",
      borderColor: "rgba(219,219,220,1)",
      padding: "0.5rem",
    },
    input: {
      borderRadius: "10px",
      borderColor: "rgba(189,195,199,1)",
      padding: "0.5rem",
      marginTop: "0.5rem",
    },
  },
  variables: {
    default: {
      colors: {
        brandButtonText: "white",
        brand: "blue",
        brandAccent: `gray`,
      },
    },
  },
};

const darkTheme = {
  style: {
    button: {
      borderRadius: "10px",
      borderColor: "rgba(105,105,105,1)", // Darker gray
      padding: "0.5rem",
    },
    input: {
      borderRadius: "10px",
      borderColor: "rgba(105,105,105,1)", // Darker gray
      padding: "0.5rem",
      marginTop: "0.5rem",
    },
  },
  variables: {
    default: {
      colors: {
        brandButtonText: "white",
        brand: "blue",
        brandAccent: `gray`,
      },
    },
  },
};

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    setTheme(darkMode ? darkTheme : lightTheme);
  }, [darkMode]);

  useEffect(() => {
    const { data } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          navigate("/app/folder-grid"); // replace '/n' with the path you want to navigate to
        }
      }
    );

    // Cleanup function
    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate, user]);

  useEffect(() => {
    if (user) {
      console.log(user);
      navigate("/app/folder-grid");
    }
  }, []);

  return (
    <div className="flex h-dvh flex-col md:flex-row xl:px-20 justify-center sm:justify-normal text-gray-500 dark:text-gray-300  md:px-6">
      <div className=" md:flex-grow sm:h-1/3  md:h-screen flex mx-auto lg:ms-[9%] md:mt-0 sm:mt-10">
        <div className="self-center">
          <h1 className=" sm:ms-8  ">
            Never miss a <span className="gradient-text "> vrse </span>
          </h1>
          <ul className="ms-14 mt-6 gap-y-2 flex-col sm:flex me-5 flex-shrink hidden sm:visable">
            {talkingPoints.map((value, index) => (
              <li key={index}>
                <i className="bi bi-check-circle-fill me-2 w-full"></i> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="  md:w-1/2  flex justify-center md:mt-0 mt-10 ">
        <div className=" w-[400px] self-center ">
          <div className=" text-center p-5 shadow-lg auth-container md:mb-2 mx-7 sm:mx-0 rounded-lg ring ring-gray-100 dark:ring-gray-00 ">
            <Auth
              supabaseClient={supabaseClient}
              appearance={theme}
              providers={["google"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

//providers={["google"]}

export default Login;
