import React from "react";
import { useAuth } from "../../../../hooks/auth";
import ProfIcon from "./dropdown";
//import ControlModal from "../../modalsToast/ControlModal";

function TopProfile({ noteData, controlProps }) {
  const { user, signOut } = useAuth();

  const logOut = () => {
    console.log("log out");
    signOut();
  };

  return (
    <div className="items-center">
      <ProfIcon
        logOut={logOut}
        noteData={noteData}
        controlProps={controlProps}
      />
    </div>
  );
}

export default TopProfile;
