import { Auth } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import "./login.css";
import { useAuth } from "../../../hooks/auth";

const talkingPoints = [
  "Live Personoalized Generated Notes & Diagrams",
  "Recorded Audio Matched to Generatations",
  "Live Transcripts",
  "Easy Exports",
  "And More!",
];

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="flex h-screen flex-col md:flex-row xl:px-20">
      <div className=" md:flex-grow h-1/3 md:h-screen flex mx-auto lg:ms-[9%] md:mt-0 sm:mt-20">
        <div className="self-center">
          <h1 className="text-gray-500 ms-8  ">
            Find Your <span className="gradient-text "> Verse </span> Today
          </h1>
          <ul className="ms-14 mt-6 gap-y-2 flex-col flex text-gray-500 me-5 flex-shrink">
            {talkingPoints.map((value) => (
              <li>
                <i className="bi bi-check-circle-fill me-2 w-full"></i> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="  md:w-1/2  flex justify-center md:me-2 md:mt-0 mt-10">
        <div className=" w-[400px] self-center ">
          <div className=" text-center p-5 shadow-lg auth-container rounded-lg ring ring-gray-100 ">
            <Auth
              supabaseClient={supabaseClient}
              appearance={{
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
              }}
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
