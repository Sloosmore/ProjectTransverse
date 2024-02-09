import React from "react";
import { Toast } from "react-bootstrap";
import { useState, useEffect } from "react";

const SupportedToast = () => {
  const [browserName, setBrowserName] = useState("Unknown");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (
        getComputedStyle(document.documentElement).getPropertyValue(
          "--arc-palette-background"
        )
      ) {
        setBrowserName("Arc Browser");
      } else {
        // Fallback to user agent detection
        let userAgent = window.navigator.userAgent;
        if (userAgent.indexOf("Chrome") > -1) {
          setBrowserName("Google Chrome");
        } else if (userAgent.indexOf("Safari") > -1) {
          setBrowserName("Apple Safari");
        } else if (userAgent.indexOf("Firefox") > -1) {
          setBrowserName("Mozilla Firefox");
        } else if (
          userAgent.indexOf("MSIE") > -1 ||
          userAgent.indexOf("Trident") > -1
        ) {
          setBrowserName("Microsoft Internet Explorer");
        } else if (userAgent.indexOf("Edge") > -1) {
          setBrowserName("Microsoft Edge");
        } else {
          setBrowserName("unknown");
        }
      }
      setShowWarning(true);
      console.log(browserName);
    }, 1000);

    setTimeout(() => {
      setShowWarning(false);
    }, 7000);
  }, []);

  return (
    showWarning && (
      <div>
        {browserName !== "Google Chrome" && browserName !== "Apple Safari" && (
          <Toast
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
            }}
            className="bg-warning text-white"
          >
            <Toast.Body>
              <i className="bi bi-dash-circle me-2"></i>
              This browser may not be supported, Safari and Chrome are
              recommended.
            </Toast.Body>
          </Toast>
        )}
      </div>
    )
  );
};

export default SupportedToast;
