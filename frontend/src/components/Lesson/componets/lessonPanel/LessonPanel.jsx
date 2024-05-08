import "./LessonPanelStyle.css";
import LessnonNavigateTopic from "./LessonNavigateTopic";
import { Link } from "react-router-dom";

export default function LessonPanel(props) {
  return (
    <div className="lesson-navigate">
      <p className="course-name">{props.name}</p>
      <div className="lesson-navigate__wraper">
        <div className="topic-navigate">
          {props.topics.map((item, index) => {
            return (
              <Link
                key={index}
                className="topic"
                to={`/course/${props.idCourse}/topic/${item.slug}/lesson/${item.slugFirstLesson}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        {props.lessonSlug && (
          <LessnonNavigateTopic idCourse={props.idCourse} topicSlug={props.topicSlug} lessonSlug={props.lessonSlug} />
        )}
      </div>
    </div>
  );
}
