import React, { useState } from "react";
import { useAuth } from "../../../hooks/auth";
import { Tooltip as ReactTooltip } from "react-tooltip";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { signOut } = useAuth();

  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <>
      <div
        className={`position-absolute bottom-0 w-100 text-center mb-3 dropup dropup-center ${
          isOpen ? "show" : ""
        }`}
      >
        <div className="text-center position-relative text-muted">
          <ul
            className={`dropdown-menu ${
              isOpen ? "show" : ""
            } text-center position-absolute start-50 translate-middle-x `}
            style={{ bottom: "0vh", width: "85%" }}
          >
            <li>
              <a
                className="dropdown-item text-black-50 d-flex justify-content-between align-items-center btn"
                role="button"
                data-tooltip-id="setting-tooltip"
              >
                <i className="bi bi-gear align-left"></i>
                <span className="mx-auto"> Settings</span>
              </a>
              <ReactTooltip
                place="right"
                id="setting-tooltip"
                className="bg-light text-black-50 border"
                content="Comming Soon"
              />
            </li>
            <li className="">
              <div
                className="dropdown-item text-black-50 d-flex justify-content-between align-items-center btn"
                role="button"
                onClick={signOut}
              >
                <i className="bi bi-escape align-left"></i>
                <span className="mx-auto"> Log out</span>
              </div>
            </li>
          </ul>
        </div>

        <div
          className=" btn btn-light mx-auto text-black-50 d-flex justify-content-between align-items-center py-1 px-3 mt-2"
          role="button"
          style={{ width: "85%" }}
          onClick={toggleOpen}
        >
          <i
            className="bi bi-person-fill align-left"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <span className="mx-auto">Profile</span>
        </div>
      </div>
    </>
  );
}

export default Profile;
