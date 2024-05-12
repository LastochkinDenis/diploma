import "./LessonPanelStyle.css";
import LessnonNavigateTopic from "./LessonNavigateTopic";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LessonPanel(props) {

  const [showNavigate, setShowNavigate] = useState(false);

  return (
    <div className="lesson-navigate-panel">
      <div onClick={() => setShowNavigate(!showNavigate)} className="lesson-navigate-button">
        Показать содрежание
      </div>
      <div className={`lesson-navigate ${showNavigate ? 'active-panel' : ''}`}>
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
          {props.lessonsSlug && (
            <LessnonNavigateTopic
              idCourse={props.idCourse}
              topicSlug={props.topicSlug}
              lessonsSlug={props.lessonsSlug}
              lessonSlug={props.lessonSlug}
            />
          )}
        </div>
      </div>
    </div>
  );
}
