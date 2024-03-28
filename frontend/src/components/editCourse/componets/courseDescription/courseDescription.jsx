import { getInfoDesctiptionCourse } from "../../../../api/courseDashboard";
import "./courseDescriptionStyle.css";

import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { putIsUpate } from "../../../../store/courseEditSlice";
import { useDispatch } from "react-redux";

export default function CourseDescrition(props) {
  const { idCourse } = useParams();
  const [course, setCourse] = useOutletContext();
  const dispatch = useDispatch()
  

  const handleImageForm = (evt) => {
    const file = evt.target.files[0];
    if(file) { 
        setCourse({...course, imageCourse:URL.createObjectURL(file)});
        dispatch({type: 'courseEdit/setIsUpdate', payload: {isUpdate: true}})
    }
  };

  const handleNameCourse = (evt) => {
    const name = evt.target.value;
    setCourse({...course, name});
  }

  const handleDescriptionCourse = (evt) => {
    const description = evt.target.value;
    setCourse({...course, description});
  }

  useEffect(() => {
    const getData = async () => {
        const data = await getInfoDesctiptionCourse(idCourse)
        setCourse(data);
    };

    getData();
  }, []);
  
  return (
    <div className="course-desctiption">
      <div className="course-desctiption-image">
        <div className="course-desctiption-image__wraper">
          <label>
            <div className="course-desctiption-image-hover">
              <p>Изменить изображение</p>
            </div>
            {!course.imageCourse && <div className="red-blockD"></div>}
            {course.imageCourse && <img src={course.imageCourse} />}
            <input type="file" className="image-loader" onChange={handleImageForm}/>
          </label>
        </div>
      </div>
      <div className="course-desctiption-item">
        <p>Название</p>
        <label>
          <input placeholder="Название курса" type="text" defaultValue={course.name} onChange={handleNameCourse}/>
        </label>
      </div>
      <div className="course-desctiption-item">
        <p>Описание</p>
        <label>
          <textarea placeholder="Описание курса" rows={10} defaultValue={course.description} onChange={handleDescriptionCourse}/>
        </label>
      </div>
    </div>
  );
}
