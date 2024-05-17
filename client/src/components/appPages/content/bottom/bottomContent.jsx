import SubmitNewNote from "./submitNewNote";
import Help from "./help";

function BottomConent() {
  return (
    <div className="absolute bottom-0 w-full">
      <SubmitNewNote />
      <div className="absolute right-0 bottom-0 m-2">
        <Help />
      </div>
    </div>
  );
}

export default BottomConent;
