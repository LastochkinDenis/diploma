import Cros from "../../../../../icon/cros.svg";
import { Draggable } from "react-beautiful-dnd";

export default function Task(props) {
  return (
    <Draggable
      key={props.serialNumber}
      draggableId={props.serialNumber}
      index={props.index}
    >
      {(provided) => {
        return (
          <div
            className="course-topic-task"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="course-topic-task-info">
              <div className="red-block"></div>
              <p className="course-topic-task-info-serial-number">
                {props.serialNumber}
              </p>
              <p>{props.task.name}</p>
            </div>
            <div className="course-topic-task-buttons">
              <button className="course-button">+ Редактировать</button>
              <button
                className="delete-topic-button"
                onClick={() => props.deleteTask(props.serialNumber)}
              >
                <img src={Cros} />
              </button>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}
