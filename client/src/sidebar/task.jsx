import "./task.css";

function Task(props) {
  let progress;

  const green_task = (
    <div className="d-flex align-items-center w-100">
      <span className="green-circle"></span>
      <span className="text-span ml-2">{props.name}</span>
    </div>
  );

  const red_task = (
    <div className="d-flex align-items-center w-100">
      <span className="red-circle"></span>
      <span className="text-span ml-2">{props.name}</span>
    </div>
  );

  const working_task = (
    <div className="d-flex align-items-center w-100">
      <span className="grey-circle"></span>

      <span className="text-span ml-2">{props.name}</span>
    </div>
  );

  if (props.state == "complete") {
    progress = green_task;
  } else if (props.state == "error") {
    progress = red_task;
  } else if (props.state == "in_progress") {
    progress = working_task;
  }
  return (
    <div className="text-center mt-3 d-grid pt-2">
      <div
        className="btn btn-light btn-rounded mx-auto text-black-50"
        role="button"
      >
        {progress}
      </div>
    </div>
  );
}

export default Task;
