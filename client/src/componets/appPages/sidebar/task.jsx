import "./task.css";

function Task({ name, state, shadow }) {
  const taskColor = {
    complete: "green",
    error: "red",
    in_progress: "grey",
    active: "active",
    inactive: "inactive",
    playback: "playback",
  };

  const task = (
    <div className="d-flex align-items-center w-100">
      <span className={`${taskColor[state]}-circle`}></span>
      <span className="text-span ml-2">{name}</span>
    </div>
  );

  return (
    <div className={`text-center mt-3 d-grid pt-2 `}>
      <div
        className={`btn btn-light btn-rounded mx-auto text-black-50 ${
          shadow && "shadow"
        }`}
        role="button"
      >
        {task}
      </div>
    </div>
  );
}

export default Task;
