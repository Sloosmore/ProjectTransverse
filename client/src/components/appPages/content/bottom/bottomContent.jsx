import SubmitNewNote from "./submitNewNote";
import Help from "./help";

function BottomConent({ helpModalKit, controlProps, noteData }) {
  return (
    <div className="absolute bottom-0 w-full">
      <SubmitNewNote controlProps={controlProps} noteData={noteData} />

      <Help helpModalKit={helpModalKit} />
    </div>
  );
}

export default BottomConent;
