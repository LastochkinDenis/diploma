import "./EditCourse.css";
import CoursePanal from "./componets/coursePanel/CoursePanel";
import { getInfoDesctiptionCourse } from "../../api/courseDashboard";

import { Outlet, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

export default function EditCourse(props) {
  const { idCourse } = useParams();
  const isUpdate = useSelector((state) => state.courseEdit).courseEdit.isUpdate;
  const [course, setCourse] = useState({name: "", description: "", imageCourse: ""});

  useEffect(() => {
    const getData = async () => {
        const data = await getInfoDesctiptionCourse(idCourse)
        setCourse(data);
    };

    getData();
  }, []);

  useEffect(() => {
    const onUnload = (evt) => {
      evt.preventDefault();
      evt.returnValue = "";
    };

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const listLinks = document.querySelectorAll("a");

  useEffect(() => {
    const clickLink = (evt) => {
      if (isUpdate) {
        evt.preventDefault();
      }
    };

    listLinks.forEach((item) => {
      item.addEventListener("click", clickLink);
    });

    return () =>
      listLinks.forEach((item) => {
        item.removeEventListener("click", clickLink);
      });
  }, [isUpdate]);

  return (
    <div className="course-edit">
      <div className="course-edit__wraper">
        <CoursePanal course={course}/>
        <Outlet context={[course, setCourse]}/>
      </div>
      <div className="course-edit-footer">
        <button className="save-button">Сохранить</button>
      </div>
    </div>
  );
}
