import { createContext, useContext, useState, useEffect } from "react";

const Rewind = createContext({
  rewind: 0,
  setRewind: () => {},
});

const RewindProvider = ({ children }) => {
  const [rewind, setRewind] = useState(false);

  const value = {
    rewind,
    setRewind,
  };

  return <Rewind.Provider value={value}>{children}</Rewind.Provider>;
};

const useRewind = () => {
  const context = useContext(Rewind);
  if (!context) {
    throw new Error("useRewind must be used within a RewindProvider");
  }
  return context;
};

export { useRewind };
export default RewindProvider;
