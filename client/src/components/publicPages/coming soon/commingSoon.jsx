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
      <p className="my-3">When I say mvp I really mean mvp</p>
      <Link to="/">
        <div className="text-white">
          <button
            type="button"
            className="px-4 me-md-2  bg-gradient-to-r from-blue-700 to-fuchsia-600 hover:from-transparent hover:bg-white hover:text-purple-600 hover:bg-transparent py-2 rounded-md"
          >
            Go back Home
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ComingSoon;
