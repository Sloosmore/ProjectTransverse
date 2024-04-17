import React, { createContext, useState, useEffect } from "react";

// Creating the context
const BrowserContext = createContext();

export const BrowserProvider = ({ children }) => {
  const [compatible, setCompatible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // Checking the user agent for browser identification
      const userAgent = window.navigator.userAgent;
      const isChrome = userAgent.includes("Chrome");
      const isSafari =
        userAgent.includes("Safari") && !userAgent.includes("Chrome"); // Chrome's UA also includes "Safari"

      // Show warning if it's not Chrome or Safari, or if Arc Browser is detected
      if (
        getComputedStyle(document.documentElement).getPropertyValue(
          "--arc-palette-title"
        )
      ) {
        if (BrowserContext) {
          console.log("arc");
        }

        setCompatible(false);
      }
      if (!isChrome && !isSafari) {
        setCompatible(false);
      }
    }, 1000);
  }, []);

  return (
    <BrowserContext.Provider value={{ compatible }}>
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => React.useContext(BrowserContext);
