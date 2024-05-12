import "./MyTrainingStyle.css";
import "../CourseAuthorDashboard/CourseDashboardStyle.css";
import { getTraining } from "../../api/myTraining";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MyTraining(props) {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    getTraining().then((data) => {
      setTrainings(data);
    });
  }, []);

  return (
    <div className="trainings__wraper">
      <div className="trainings">
        <h1>Cейчас прохожу</h1>
        {trainings.map((training, index) => {
          return (
            <div className="training" key={index}>
              <div className="training-info">
                <div className="training-image">
                  {training.imageCourse && <img src={training.imageCourse} />}
                  {!training.imageCourse && <div className="red-block"></div>}
                </div>
                <div className="training-name">
                  <h3>{training.name}</h3>
                </div>
              </div>
              <Link to={`/course/${training.slug}/redirect`} className="course-button">Продолжить</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
