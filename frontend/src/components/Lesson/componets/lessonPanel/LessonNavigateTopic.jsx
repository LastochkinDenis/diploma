import { Link } from 'react-router-dom';
import './LessonPanelStyle.css';
import { useState, useEffect } from "react";

export default function LessnonNavigateTopic(props) {
  return (
    <div className="topic-navigate-lessons">
      {props.lessonSlug.map((item, index) => {
        return <Link key={index} className="topic-navigate-lesson" to={`/course/${props.idCourse}/topic/${props.topicSlug}/lesson/${item}`}></Link>
      })}
    </div>
  )
}
