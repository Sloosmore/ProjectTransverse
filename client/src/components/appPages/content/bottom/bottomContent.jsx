import SubmitNewNote from "./submitNewNote";
import Help from "./help";

function BottomConent({ helpModalKit, controlProps, noteData }) {
  return (
    <div className="absolute bottom-0 w-full">
      <SubmitNewNote controlProps={controlProps} noteData={noteData} />
      <div className="absolute right-0 bottom-0 m-2">
        <Help helpModalKit={helpModalKit} />
      </div>
    </div>
  );
}

export default BottomConent;
