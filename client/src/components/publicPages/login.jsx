import { Auth } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import "./login.css";
import { useAuth } from "../../hooks/auth";

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const { data } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const { user: supabaseUser } = session;
          const { data, error } = await supabaseClient
            .from("user")
            .select("*")
            .eq("user_id", supabaseUser.id);
          console.log(data);
          if (error) {
            console.error("Error fetching user:", error);
            // handle error appropriately
          } else if (data.length === 0) {
            const { error: insertError } = await supabaseClient
              .from("user")
              .insert({
                user_id: supabaseUser.id,
                email: supabaseUser.email,
                is_active: true,
                date_created: new Date(),
                note_preferences: [
                  "Use a bullet point style with a subtitle schema (##). For more complex subjects include analogies.",
                  "prompt2",
                  "prompt3",
                  "prompt4",
                  "prompt5",
                ],
                note_frequency: 700,
                pref_number: 0,
              });

            if (insertError) {
              console.error("Error inserting new user:", insertError);
              // handle error appropriately
            }
          }
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
      navigate("/app");
    }
  }, []);

  return (
    <div className=" flex align-items-center vh-100">
      <div className=" mx-auto w-3/4 sm:w-7/12 md:w-1/2 mt-20">
        <div className=" text-center p-5 shadow-lg auth-container rounded-lg">
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
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}

//providers={["google"]}

export default Login;
