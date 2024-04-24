import "./courseDescriptionStyle.css";

// import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function CourseDescrition(props) {
  const [
    course,
    setCourse,
    idCourse,
    setIsUpdate,
    setLinkRequestForServer,
    dataToUpdate,
    setDataToUpdate,
  ] = useOutletContext();

  const handleImageForm = (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setCourse({ ...course, imageCourse: reader.result });
      setIsUpdate(true);
      setDataToUpdate({ ...dataToUpdate, imageCourse: file });
      setLinkRequestForServer(`/course/${idCourse}/update/desription/`);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleNameCourse = (evt) => {
    const name = evt.target.value;
    setCourse({ ...course, name });
    setIsUpdate(true);
    setDataToUpdate({ ...dataToUpdate, name: name });
    setLinkRequestForServer(`/course/${idCourse}/update/desription/`);
  };

  const handleDescriptionCourse = (evt) => {
    const description = evt.target.value;
    setCourse({ ...course, description });
    setIsUpdate(true);
    setDataToUpdate({ ...dataToUpdate, description: description });
    setLinkRequestForServer(`/course/${idCourse}/update/desription/`);
  };

  return (
    <div className="course-desctiption">
      <h1>Описание курса</h1>
      <div className="course-desctiption-image">
        <div className="course-desctiption-image__wraper">
          <label>
            <div className="course-desctiption-image-hover">
              <p>Изменить изображение</p>
            </div>
            {!course.imageCourse && <div className="red-blockD"></div>}
            {course.imageCourse && <img src={course.imageCourse} />}
            <input
              type="file"
              className="image-loader"
              onChange={handleImageForm}
            />
          </label>
        </div>
      </div>
      <div className="course-desctiption-item">
        <p>Название</p>
        <label>
          <input
            placeholder="Название курса"
            type="text"
            defaultValue={course.name}
            onChange={handleNameCourse}
          />
        </label>
      </div>
      <div className="course-desctiption-item">
        <p>Описание</p>
        <label>
          <textarea
            placeholder="Описание курса"
            rows={10}
            defaultValue={course.description}
            onChange={handleDescriptionCourse}
          />
        </label>
      </div>
    </div>
  );
}
