import './LessonEditStyle.css';
import '../CourseAuthorDashboard/CourseDashboardStyle.css'

import { Link, useOutletContext, useParams } from "react-router-dom";
import { Component, createRef } from "react";
import { getLessonsSlug } from '../../api/courseDashboard';


class LessonEditClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonsSlug: [],
            lesson: {}
        }
    }

    nameLessonRef = createRef(undefined)
// /course/course2-3/edit/topic/test1api11/lesson/edit/1
    async componentDidMount() {
        let lessonsSlug = await getLessonsSlug(this.props.idCourse, this.props.topicSlug);

        this.setState(state => ({lessonsSlug: lessonsSlug}));
    }

    printLessonList = () => {
        let lessons = []

        for(let slug of this.state.lessonsSlug){
            lessons.push(<div className="lesson-link">
                <Link to={`/course/${this.props.idCourse}/edit/topic/${this.props.topicSlug}/lesson/edit/${slug}/`}></Link>
            </div>);
        }

        return lessons;
    }

    render() {
        return (
            <div className="lesson-edit">
                <h1>Настройка урока</h1>
                <div className="lesson-edit-head">
                    <div className="lesson-settings">
                        <div className="lesson-settings-name">
                            <div className="red-block"></div>
                            <label>
                                <input ref={this.nameLessonRef} />
                            </label>
                        </div>
                        <button className="course-button">
                            Настройка урока
                        </button>
                    </div>
                    <div className="lesson-list">
                        {this.printLessonList()}
                    </div>
                </div>
                <div className="lesson-content"></div>
            </div>
        )
    }
}


export default function LessonEdit(props) {

    const {idCourse, topicSlug, lessonSlug} = useParams();

    if(idCourse !== undefined && lessonSlug !== undefined)
        return <LessonEditClass idCourse={idCourse} topicSlug={topicSlug} lessonSlug={lessonSlug} />
    return <p></p>
}