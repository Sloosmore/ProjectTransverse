import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/TransverseIcon.svg";

function Footer() {
  return (
    <footer className="flex flex-wrap justify-between items-center py-3 my-2.5 px-4">
      <p className="col-span-4 mb-0 text-gray-600">© 2024 Transverse</p>

      <Link
        to="/"
        className="col-span-4 flex items-center justify-center mb-3 md:mb-0 md:mr-auto text-blue-600 no-underline md:mx-auto mt-2.5"
      >
        <img src={logo} alt="" className="w-12 h-12" />
      </Link>

      <ul className="nav col-span-4 flex justify-end">
        <li className="nav-item">
          <Link to="/about" className="nav-link px-2 text-gray-600">
            About
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/terms" className="nav-link px-2 text-gray-600">
            Terms
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/privacy" className="nav-link px-2 text-gray-600">
            Private Policy
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link px-2 text-gray-600">
            Login
          </Link>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
