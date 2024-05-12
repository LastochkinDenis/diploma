import { useActionData, useAsyncError } from "react-router-dom";
import MegnifyinGlassIcon from "../../icon/MegnifyinGlassIcon.svg";
import "./HomeStyle.css";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getCourseRecomer } from "../../api/homeApi";
import { useNavigate } from "react-router-dom";

export default function Home(props) {
  const [courseList, setCourseList] = useState([]);
  let ref = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    let getData = async () => {
      let data = await getCourseRecomer();
      setCourseList(data);
    }

    getData();
  }, [])

  const printCourseColum = () => {
    let colums = [];
    let index = 1;

    for (let course of courseList) {
      colums.push(
        <div className="block-course">
          <Link to={`/course/${course.slug}/promotion`}>
            <div className="text">
              <p>{course.name}</p>
            </div>
              {course.imageCourse !== '' ? (
                <div className="image">
                  <img src={course.imageCourse} />
                </div>
              ) : (
                <div className="red-block"></div>
              )}
          </Link>
        </div>
      );
      if (index >= 12) {
        break;
      }
      index++;
    }

    return colums;
  };

  const HandleSearch = () => {
    navigate(`/courses/${ref.current.value}`);
  }

  return (
    <div className="home">
      <div className="home-serach">
        <div className="home-serach-input">
          <div className="search__wraper">
            <label for="search">
              <img src={MegnifyinGlassIcon} />
            </label>
            <input id="search" placeholder="Поиск..." ref={ref}/>
          </div>
        </div>
        <div className="home-serach-filter">
          <button onClick={HandleSearch} className="course-button home-serach-button">
            <p>Поиск</p>
          </button>
        </div>
      </div>
      <h1>Онлайн-курсы</h1>
      <div className="course-recomend__wraper">
        <div className="course-recomend">{printCourseColum()}</div>
        <div className="block-course-button-recomend">
          <button className="course-button">Посмоть больше</button>
        </div>
      </div>
    </div>
  );
}
