import { Link } from 'react-router-dom';
import './LessonPanelStyle.css';
import { useState, useEffect } from "react";

export default function LessnonNavigateTopic(props) {

  return (
    <div className="topic-navigate-lessons">
      {props.lessonsSlug.map((item, index) => {
        return <Link key={index} className={`topic-navigate-lesson ${item == props.lessonSlug ? "topic-navigate-lesson-current" : ""}`} to={`/course/${props.idCourse}/topic/${props.topicSlug}/lesson/${item}`}></Link>
      })}
    </div>
  )
}
