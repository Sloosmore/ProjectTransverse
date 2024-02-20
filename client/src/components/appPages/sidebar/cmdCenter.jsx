import React, { useState, useEffect } from "react";
import transverseImage from "../../../assets/TvsLogo.svg";
import { Link } from "react-router-dom";
import ControlModal from "../modalsToast/ControlModal";
function CmdCenter({ noteData, controlProps }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="">
      <div className="text-center d-grid mt-3">
        <div
          className="btn btn-light mx-auto text-black-50 d-inline-block text-center py-3 px-3"
          role="button"
          style={{ width: "100%" }}
        >
          <Link to="/n">
            <img src={transverseImage} alt="" />
          </Link>
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

/*
<div>
          <div
            className="btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2"
            role="button"
            onClick={handleShow}
          >
            <i
              className="bi bi-three-dots bi-2x align-left"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="mx-auto text">Control Center</span>
          </div>
        </div>*/
