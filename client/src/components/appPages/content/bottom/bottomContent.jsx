import SubmitNewNote from "./submitNewNote";
import Help from "./help";

function BottomConent({ controlProps }) {
  return (
    <div className="absolute bottom-0 w-full">
      <SubmitNewNote controlProps={controlProps} />
      <div className="absolute right-0 bottom-0 m-2">
        <Help />
      </div>
    </div>
  );
}

export default BottomConent;
