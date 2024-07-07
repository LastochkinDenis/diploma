import Cros from "../../../../../icon/cros.svg";
import { Draggable } from "react-beautiful-dnd";
import { Link, useParams } from 'react-router-dom'

export default function Task(props) {

  const printLink = () => {
    if(props.task.isCreate) {
      return <Link to={"#"} className="course-button">+ Редактировать</Link>
    }
    else {
      return <Link className="course-button" to={`/course/${props.courseSlug}/edit/topic/${props.topicSlug}/lesson/edit/${props.task.slug}/`} >+ Редактировать</Link>
    }
  }

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
              {/* <button className="course-button">+ Редактировать</button> */}
              {printLink()}
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
