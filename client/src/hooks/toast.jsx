import { createContext, useContext } from "react";
import { useState } from "react";

export const ToastContext = createContext({
  activeToast: false,
  setActiveToast: () => {},
  toastMessage: "",
  setToastMessage: () => {},
});

export const ToastProvider = ({ children }) => {
  const [activeToast, setActiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  return (
    <ToastContext.Provider
      value={{ activeToast, setActiveToast, toastMessage, setToastMessage }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
