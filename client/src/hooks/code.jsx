import { createContext, useContext, useState, useEffect } from "react";
import { supabaseClient } from "../config/supabaseClient";

const codeContext = createContext({ codePass: null, setCodePass: () => {} });

export const CodeProvider = ({ children }) => {
  const [codePass, setCodePass] = useState(false);

  return (
    <codeContext.Provider value={{ codePass, setCodePass }}>
      {children}
    </codeContext.Provider>
  );
};

export const useCode = () => {
  return useContext(codeContext);
};
