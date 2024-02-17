import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../landing/blockText.css";

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
      <Link to="/">
        <button type="button" className="btn btn-lg px-4 me-md-2 gradient-bg">
          Go back Home
        </button>
      </Link>
    </div>
  );
};

export default ComingSoon;
