import Task from "./task";
import { Link, useNavigate } from "react-router-dom";

function TaskList({ tasks }) {
  if (!tasks) {
    return null; // or return a loading spinner, or some placeholder content
  }

  const navigate = useNavigate();

  const goToTask = (task) => {
    const taskParam = encodeURIComponent(JSON.stringify(task));
    navigate(`/c/${task.id}`, {
      state: { outfile: task.outfile, transcription: task.transcription },
    });
  };

  return (
    <div>
      <div>
        {tasks.map((task, index) => (
          <div
            key={index}
            onClick={() => goToTask(task)}
            style={{ cursor: "pointer" }}
          >
            <Task
              filename={task.filename}
              transcription={task.prompt[0]}
              outfile={task.file}
              state="in_progress"
              name={(task.filename || task.task_id).substring(0, 13)}
            />
            {}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
