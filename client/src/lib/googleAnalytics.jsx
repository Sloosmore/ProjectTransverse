import React, { useEffect } from "react";

const GoogleAnalytics = () => {
  useEffect(() => {
    // Create the first script tag
    const scriptTag1 = document.createElement("script");
    scriptTag1.async = true;
    scriptTag1.src = "https://www.googletagmanager.com/gtag/js?id=G-G854HE6L4H";
    document.head.appendChild(scriptTag1);

    // Create the second script tag
    const scriptTag2 = document.createElement("script");
    scriptTag2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-G854HE6L4H');
    `;
    document.head.appendChild(scriptTag2);
  }, []);

  return null;
};

export default GoogleAnalytics;
