import "./EditCourse.css";
import CoursePanal from "./componets/coursePanel/CoursePanel";
import {
  getInfoDesctiptionCourse,
  handleCourseEditApi,
} from "../../api/courseDashboard";
import ModalSave from "./componets/modalSave/ModalSave";

import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EditCourse(props) {
  const { idCourse } = useParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const [course, setCourse] = useState({
    name: "",
    description: "",
    imageCourse: "",
  });
  const [showModalSave, setShowModalSave] = useState(false);
  const [linkClick, setLinkClick] = useState("");
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [linkRequestForServer, setLinkRequestForServer] = useState("");

  useEffect(() => {
    const getData = async () => {
      const data = await getInfoDesctiptionCourse(idCourse);
      setCourse(data);
    };

    getData();
  }, []);

  useEffect(() => {
    const onUnload = (evt) => {
      evt.preventDefault();
      evt.returnValue = "";
    };
    if(isUpdate) {
      window.addEventListener("beforeunload", onUnload);
    }
    else {
      window.removeEventListener("beforeunload", onUnload);
    }
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const listLinks = document.querySelectorAll("a");

  useEffect(() => {
    const clickLink = (evt) => {
      if (isUpdate) {
        evt.preventDefault();
        setShowModalSave(true);

        let link = evt.target.href.replace("http://luminari.ru/", "");

        setLinkClick("/" + link);
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

  const HandleSaveChange = async (evt) => {

    let result = false;

    if(Object.keys(dataToUpdate).length >= 1) {
      
      result = await handleCourseEditApi(linkRequestForServer, dataToUpdate);
      setIsUpdate(false);
      setDataToUpdate({});
    }

    return result;
  };

  return (
    <div className="course-edit">
      {showModalSave && (
        <ModalSave
          setShowModalSave={setShowModalSave}
          handleSaveChange={HandleSaveChange}
          link={linkClick}
        />
      )}
      <div className="course-edit__wraper">
        <CoursePanal course={course} setCourse={setCourse}/>
        <div className="course-edit-block">
          <Outlet
            context={[
              course,
              setCourse,
              idCourse,
              setIsUpdate,
              setLinkRequestForServer,
              dataToUpdate,
              setDataToUpdate,
              isUpdate
            ]}
          />
        </div>
      </div>
      <div className="course-edit-footer">
        <button className="save-button" onClick={HandleSaveChange}>
          Сохранить
        </button>
      </div>
    </div>
  );
}
