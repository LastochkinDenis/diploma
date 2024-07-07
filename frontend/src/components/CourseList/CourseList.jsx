import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import MegnifyinGlassIcon from "../../icon/MegnifyinGlassIcon.svg";
import { getSearch } from "../../api/searchApi";
import './CourseListStyle.css'

export default function CourseList(props) {
  const [courses, setCourses] = useState([]);
  let { search } = useParams();
  let ref = useRef(undefined);

  useEffect(() => {
    const getData = async () => {
        let data = []
      if (search) {
        data = await getSearch(search);
      } else {
        data = await getSearch('');
      }
      setCourses(data);
    };

    getData();
  }, [search]);

  const handleSubmit = async () => {
    let data = await getSearch(ref.current.value);
    setCourses(data);
  }

  return (
    <div className="courses">
      <div className="home-serach">
        <div className="home-serach-input">
          <div className="search__wraper">
            <label for="search">
              <img src={MegnifyinGlassIcon} />
            </label>
            <input id="search" ref={ref} placeholder="Поиск..." onKeyDown={(evt) => {
              if(evt.key == 'Enter')
                handleSubmit();
            }} />
          </div>
        </div>
        <div className="home-serach-filter">
          <button onClick={handleSubmit} className="course-button home-serach-button">
            <p>Поиск</p>
          </button>
        </div>
      </div>
      <div className="course-list-search">
        {courses.map((item, index) => {
          return <Link to={`/course/${item.slug}/promotion`} className="course-item" key={index}>
            <div className="course-item__img">
              {!item.imageCourse && <div className="red-block"></div>}
              {item.imageCourse && <img src={item.imageCourse} />}
            </div>
            <div className="course-item__info">
              <p>{item.name}</p>
            </div>
          </Link>;
        })}
      </div>
    </div>
  );
}
