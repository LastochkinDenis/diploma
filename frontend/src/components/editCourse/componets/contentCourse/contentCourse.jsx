import { Component } from "react";

export default class ContentCourse extends Component {
    constructor(props) {
        super(course);
    }

    renderTopic = () => {
        return (
            <div className="course-topic">
                    <div className="course-topic-head">
                        <p>1</p>
                        <input type="text"/>
                    </div>
                    <div className="course-topic-task">
                        <div className="red-block"></div>
                        <p>1.1</p>
                        <p>Название</p>
                        <button className="course-button">
                            Редоктировать
                        </button>
                    </div>
                    <div className="course-topic-task">
                        <div className="red-block"></div>
                        <p>1.2</p>
                        <input type="text" />
                        <button className="course-button">
                            + Создать задачу
                        </button>
                    </div>
                </div>
        )
    }

    render() {
        return (
            <div className="content-course">
                <h1>Програма курса</h1>
                
            </div>
        )
    }
}