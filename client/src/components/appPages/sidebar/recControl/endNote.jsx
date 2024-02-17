import React from "react";

function EndNote({ setNoteID }) {
  return (
    <div>
      <button
        onClick={() => setNoteID(null)}
        className="bg-gray-100 inline-flex justify-center gap-x-1.5 rounded-md px-3 py-3 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
      >
        <i className="bi bi-square-fill"></i>
        <span className="ms-2">End</span>
      </button>
    </div>
  );
}

export default EndNote;
