import { createContext, useContext, useState, useEffect } from "react";
import { supabaseClient } from "../../config/supabaseClient";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

// Create a context for authentication
const AuthContext = createContext({
  session: null,
  user: null,
  signOut: () => {},
  userType: null,
  setUserType: () => {},
  accountID: null,
  setAccountID: () => {},
  audioOn: true,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("Standard");
  const [accountID, setAccountID] = useState(null);
  const [audioOn, setAudioOn] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (data.session) {
        const userID = data.session.user.id;

        const { data: userType, error: userErr } = await supabaseClient
          .from("user")
          .select("user_type, account_id, audio_on")
          .eq("user_id", userID)
          .single();
        if (inDevelopment) console.log("userType", userType.user_type);
        if (userErr) throw userErr;

        setSession(data.session);
        setUser(data.session?.user);
        setLoading(false);
        setUserType(userType.user_type);
        setAudioOn(userType.audio_on);
        console.log("userType data", userType.account_id);
        userType.user_type === "Admin" && setAccountID(userType.account_id);
      }
    };

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      if (user) {
        const userID = user.id;

        const { data: userType, error: userErr } = await supabaseClient
          .from("user")
          .select("user_type")
          .eq("user_id", userID)
          .single();
        if (inDevelopment) console.log("userType", userType.user_type);
        if (userErr) throw userErr;
        setUserType(userType.user_type);
      }
    };
    updateUser();
  }, [user]);

  const value = {
    session,
    user,
    signOut: () => supabaseClient.auth.signOut(),
    userType,
    setUserType,
    accountID,
    setAccountID,
    audioOn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
