import React, { useState, useEffect } from "react";
import transverseImage from "../../assets/TvsLogo.svg";
import { Link } from "react-router-dom";
import ControlModal from "../modals/ControlModal";
function CmdCenter({ noteData, controlProps }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="pl-2 pr-2">
      <div className="text-center d-grid border-5 mt-3">
        <div
          className="btn btn-light mx-auto text-black-50 d-inline-block text-center py-3 px-3"
          role="button"
          style={{ width: "85%" }}
        >
          <Link to="/n">
            <img src={transverseImage} alt="" />
          </Link>
        </div>
        <div>
          <div
            className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2"
            role="button"
            style={{ width: "85%" }}
            onClick={handleShow}
          >
            <i
              className="bi bi-three-dots bi-2x align-left"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="mx-auto">Control Center</span>
          </div>
        </div>
      </div>
      <ControlModal
        show={show}
        handleClose={handleClose}
        noteData={noteData}
        controlProps={controlProps}
      />
    </div>
  );
}

export default CmdCenter;
