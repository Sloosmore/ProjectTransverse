import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import TranverseNote from "../../assets/TransverseNote.png";
import "./blockText.css";

export function BlockText() {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ overflowX: "hidden" }}
    >
      <div className="row min-vh-100 py-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 shadow-lg">
        <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
          <h1 className="display-4 fw-bold lh-1  gradient-text p-2">
            Take notes your way
          </h1>
          <p className="lead">
            Quickly design and customize responsive mobile-first sites with
            Bootstrap, the world’s most popular front-end open source toolkit,
            featuring Sass variables and mixins, responsive grid system,
            extensive prebuilt components, and powerful JavaScript plugins.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 me-md-2"
            >
              Sign up
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Log in
            </button>
          </div>
        </div>
        <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg img-fluid">
          <img
            className="rounded-lg-3 rounded"
            src={TranverseNote}
            alt=""
            width="840"
          />
        </div>
      </div>
    </div>
  );
}

export default BlockText;
