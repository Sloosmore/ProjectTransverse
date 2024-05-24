import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ConfirmationPage = () => {
  const location = useLocation();
  const [confirmationUrl, setConfirmationUrl] = useState(() =>
    new URLSearchParams(location.search).get("confirmation_url")
  );

  useEffect(() => {
    setConfirmationUrl(
      new URLSearchParams(location.search).get("confirmation_url")
    );
  }, [location.search]);

  return (
    <div className="flex h-dvh flex-col items-center justify-center mx-3">
      <h2>Confirm Your Signup</h2>
      {confirmationUrl ? (
        <div>
          <p>Please click the button below to confirm your action:</p>
          <button onClick={() => (window.location.href = confirmationUrl)}>
            Confirm
          </button>
        </div>
      ) : (
        <p>No confirmation URL found.</p>
      )}
    </div>
  );
};

export default ConfirmationPage;
