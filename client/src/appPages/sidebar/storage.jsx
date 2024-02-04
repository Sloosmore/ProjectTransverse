import React from "react";
import { Link } from "react-router-dom";

function StorageButton() {
  return (
    <div className=" justify-content-center text-center">
      <Link
        to="/files"
        style={{
          textDecoration: "none",
        }}
      >
        <div
          className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2"
          role="button"
          style={{ width: "85%" }}
        >
          <i
            className="bi bi-folder bi-2x align-left"
            style={{ fontSize: "1.5rem" }}
          ></i>{" "}
          <span className="mx-auto">Files</span>
        </div>
      </Link>
    </div>
  );
}

export default StorageButton;
