import './EditCourse.css';
import CoursePanal from "./componets/coursePanel/CoursePanel";



export default function EditCourse(props) {
    return (<div className="course-edit">
        <div className="course-edit__wraper">
            <CoursePanal />
            <div>1</div>
        </div>
        <div className="course-edit-footer">
            <button className="save-button">Сохранить</button>
        </div>
    </div>)
}