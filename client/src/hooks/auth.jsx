import { createContext, useContext, useState, useEffect } from "react";
import { supabaseClient } from "../config/supabaseClient";

// Create a context for authentication
const AuthContext = createContext({
  session: null,
  user: null,
  signOut: () => {},
  userType: null,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      const userID = data.session.user.id;

      const { data: userType, error: userErr } = await supabaseClient
        .from("user")
        .select("user_type")
        .eq("user_id", userID)
        .single();
      console.log("userType", userType.user_type);
      if (error) throw error;
      setSession(data.session);
      setUser(data.session?.user);
      setLoading(false);
      setUserType(userType.user_type);
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

  const value = {
    session,
    user,
    signOut: () => supabaseClient.auth.signOut(),
    userType,
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
