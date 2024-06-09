import "./CoursePromotionStyle.css";
import "../CourseAuthorDashboard/CourseDashboardStyle.css";
import ContentCourse from "./CourseContent";
import ArrowToDown from "../../icon/arrowToDown.svg";
import { getPromotionCourse, enrollmentCourseApi } from "../../api/coursePromotion";

import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useParams } from "react-router-dom";

export default function CoursePromotion(props) {
    const { idCourse } = useParams();
  const [promotion, setPromotion] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let data = await getPromotionCourse(idCourse);
      if (data.course) {
        setPromotion(data.course);
      }
    };

    getData();
  }, []);

  const EnrollmentCourse = async () => {
    let result = await enrollmentCourseApi(idCourse);

    setPromotion({...promotion, enrollment: result});
  };

  const printButtonEnrollment = () => {
    if (promotion.enrollment) {
      return <button className="enrollment-button">Вы записаны на курс</button>;
    } else {
      return <button className="course-button" onClick={EnrollmentCourse}>Записаться на курс</button>;
    }
  };

  return (
    <div className="promtion-course">
      <div className="promtion-course-head">
        <div className="promtion-course-description">
          <h1>О курсе</h1>
          <p>
            {promotion.description}
          </p>
        </div>
        <div className="promtion-course-enrollment">
          <div className="promtion-course-image">
		{promotion.imageCourse ? 
              <img src={promotion.imageCourse} />
             : 
              <div className="red-block"></div>
            }
          </div>
          <p className="promtion-course-name">{promotion.name}</p>
          <div className="promtion-course-enrollment__wraper">
            {printButtonEnrollment()}
          </div>
        </div>
      </div>
      <div className="promtion-content">
        <ContentCourse content={promotion.content}/>
      </div>
    </div>
  );
}
