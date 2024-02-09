import React from "react";
import { useLocation } from "react-router-dom";

const ComingSoon = () => {
  const location = useLocation();
  const page = location.pathname.substring(1);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>The {page} page is coming soon</h1>
      <p>When I say mvp I really mean mvp</p>
    </div>
  );
};

export default ComingSoon;
