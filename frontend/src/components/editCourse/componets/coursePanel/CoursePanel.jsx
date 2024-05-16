import './CoursePanelStyle.css';
import ArrowToDown from '../../../../icon/arrowToDown.svg'
import { PublishCourse } from '../../../../api/courseDashboard';

import { useState } from "react";
import { Link } from 'react-router-dom'


export default function CoursePanal(props) {
    const [menuCourseContent, setMenuCourseContent] = useState(true);
    const [menuSetingsCourse, setMenuSetingsCourse] = useState(true);
    const handelePublistCourse = async () => {
        let data = await PublishCourse(props.course.slug);
        
        if(data) {
            props.setCourse({...props.course, status: 'a'})
        }
    }

    return (
        <div className="course-panel">
            <div className="course-panel-head">
                {props.course.imageCourse && <img src={props.course.imageCourse} className="course-panel-head-image" />}
                {!props.course.imageCourse && <div className="red-block"></div>}
                {/* <div className="red-block-p"></div> */}
                <p className="course-panel-head-name">{props.course.name}</p>
            </div>
            {props.course.status === 'a' ? <button className="course-panel-button-publish">
                Опубликовано
            </button> : <button className="course-panel-button-publish" onClick={handelePublistCourse}>
                Опубликовать
            </button>}
            <div className="menu-course">
                <div className="menu-course__wraper">
                    <div className="menu-course-name" onClick={() => {setMenuCourseContent(!menuCourseContent)}}>
                        <p>Курсы</p>
                        <img className={menuCourseContent ? '': 'menu-course-name-deactiv'} src={ArrowToDown}/>
                    </div>
                    {menuCourseContent && <ul>
                        <li><Link to={`descrition`}>Описание</Link></li>
                        <li><Link to='content'>Содержание</Link></li>
                    </ul>}
                </div>
            </div>
            <div className="menu-course">
                <div className="menu-course__wraper">
                    <div className="menu-course-name" onClick={() => {setMenuSetingsCourse(!menuSetingsCourse)}}>
                        <p>Настройки</p>
                        <img className={menuSetingsCourse ? '': 'menu-course-name-deactiv'} src={ArrowToDown}/>
                    </div>
                    {menuSetingsCourse && <ul>
                        <li><Link to='author'>Преподователи</Link></li>
                    </ul>}
                </div>
            </div>
        </div>
    )
}