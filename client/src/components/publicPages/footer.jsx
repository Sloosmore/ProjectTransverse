import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/TransverseIcon.svg";

function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top px-4 ">
      <p className="col-md-4 mb-0 text-body-secondary">© 2024 Transverse</p>

      <Link
        to="/"
        className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <img
          src={logo}
          alt=""
          style={{
            width: "3rem",
            height: "3rem",
          }}
        />
      </Link>

      <ul className="nav col-md-4 justify-content-end">
        <li className="nav-item">
          <Link to="/about" className="nav-link px-2 text-body-secondary">
            About
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/terms" className="nav-link px-2 text-body-secondary">
            Terms
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/policy" className="nav-link px-2 text-body-secondary">
            Policy
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/thisPageDoesn'tLeadToAnything"
            className="nav-link px-2 text-body-secondary"
          >
            Other cool link
          </Link>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
