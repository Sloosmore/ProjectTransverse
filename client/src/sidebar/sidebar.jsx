import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.css";
import TaskList from "./task_list";
import NoteList from "./note_list";

import { Link } from "react-router-dom";
import transverseImage from "../assets/transverse.svg"; // Add this line
function Sidebar({ docData, noteData }) {
  //this is the sidebar bar
  return (
    <div className="flex-column d-flex h-100">
      <div className="pl-2 pr-2">
        <div className="text-center d-grid bg-light border border-lightgrey border-5 ">
          <div className="p-2">
            <Link to="/">
              <img src={transverseImage} alt="" />
            </Link>
          </div>
        </div>
      </div>
      {/*<div className="divide mb-5"></div>*/}
      <br />
      {/*will need to construct slightly differently because it doesn't take all var and different routes >*/}
      <NoteList notes={noteData} />
      <div className="border"></div>
      <TaskList tasks={docData} />
    </div>
  );
}

export default Sidebar;
