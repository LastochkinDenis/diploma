import { useActionData, useAsyncError } from "react-router-dom";
import MegnifyinGlassIcon from "../../icon/MegnifyinGlassIcon.svg";
import "./HomeStyle.css";

import { useState, useEffect, useRef } from "react";
import { getCourseRecomer } from "../../api/homeApi";

export default function Home(props) {
  const [courseList, setCourseList] = useState([
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
    { name: "7" },
    { name: "8" },
    { name: "9" },
    { name: "10" },
    { name: "11" },
    { name: "12" },
    { name: "13" },
    { name: "14" },
    { name: "15" },
    { name: "16" },
    { name: "17" },
    { name: "18" },
  ]);

  useEffect(() => {
    let getData = async () => {
      let data = await getCourseRecomer();
      console.log(data);
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
          <a href="#">
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
          </a>
        </div>
      );
      if (index >= 12) {
        break;
      }
      index++;
    }

    return colums;
  };

  return (
    <div className="home">
      <div className="home-serach">
        <div className="home-serach-input">
          <div className="search__wraper">
            <label for="search">
              <img src={MegnifyinGlassIcon} />
            </label>
            <input id="search" placeholder="Поиск..." />
          </div>
        </div>
        <div className="home-serach-filter">
          <div className="home-serach-filter-checkbox">
            <label>
              <input type="checkbox" />
              <p>С сертификатом</p>
            </label>
          </div>
          <button className="course-button home-serach-button">
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
