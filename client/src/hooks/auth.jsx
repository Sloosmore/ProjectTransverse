import { createContext, useContext, useState, useEffect } from "react";
import { supabaseClient } from "../config/supabaseClient";

// Create a context for authentication
const AuthContext = createContext({
  session: null,
  user: null,
  signOut: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(data.session);
      setUser(data.session?.user);
      setLoading(false);
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
