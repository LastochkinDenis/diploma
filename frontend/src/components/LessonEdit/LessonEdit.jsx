import "./LessonEditStyle.css";
import "../CourseAuthorDashboard/CourseDashboardStyle.css";
import { getLessonsSlug, getDataLessonEdit } from "../../api/courseDashboard";
import ModalTypeLesson from "./component/modalTypeLesson/modalTypeLesson";
import TopicInfo from "./component/TopicInfo/TopicInfo";

import { Link, useOutletContext, useParams } from "react-router-dom";
import { Component, createRef } from "react";

class LessonEditClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessonsSlug: [],
      lesson: {},
      showModalType: false,
      typeLesson: [
        { type: "TextInfo", text: "информационый текст" },
        { type: "QuestionTask", text: "задача с выбором ответа" },
        { type: "OpenQuestion", text: "открытый вопрос" },
        {
          type: "ProgramTask",
          text: "программная задача",
          languageName: "Python",
        },
        {
          type: "ProgramTask",
          text: "программная задача",
          languageName: "Java",
        },
        { type: "ProgramTask", text: "программная задача", languageName: "C#" },
      ],
      typeActive: { type: "OpenQuestion", languageName: "" },
      dataLesson: {name: ''}
    };
  }
  // /course/course2-3/edit/topic/test1api11/lesson/edit/1
  async componentDidMount() {
    let lessonsSlug = await getLessonsSlug(
      this.props.idCourse,
      this.props.topicSlug
    );

    let dataLesson = await getDataLessonEdit(
      this.props.idCourse,
      this.props.topicSlug,
      this.props.lessonSlug
    );

    if(dataLesson.type === 'TextInfo'&& dataLesson.languageName === '' ){
      this.props.setLinkRequestForServer(`coursecontent/${this.props.idCourse}/topicinfo/${this.props.topicSlug}/edit/${this.props.lessonSlug}`);
    }

    this.setState((state) => ({
      lessonsSlug: lessonsSlug,
      typeActive: {
        type: dataLesson.type,
        languageName: dataLesson.languageName,
      },
      dataLesson: {
        ...dataLesson
      }
    }));
  }

  printLessonList = () => {
    let lessons = [];

    for (let slug of this.state.lessonsSlug) {
      lessons.push(
        <div className="lesson-link">
          <Link
            to={`/course/${this.props.idCourse}/edit/topic/${this.props.topicSlug}/lesson/edit/${slug}/`}
          ></Link>
        </div>
      );
    }

    return lessons;
  };

  setShowModalType = (taf) => {
    this.setState((state) => ({ showModalType: taf }));
  };

  openModalType = () => {
    this.setShowModalType(true);
  };

  setActivType = (lessonType, language) => {
    this.setState((state) => ({
      typeActive: { type: lessonType, language: language },
    }));
  };

  handleChangeNameLesson = (evt) => {
    this.props.setDataToUpdate({
      ...this.props.dataToUpdate,
      name: evt.target.value,
    });
    this.props.setIsUpdate(true);
  };

  printLesson = () => {
    if(this.state.dataLesson.type === 'TextInfo'&& this.state.dataLesson.languageName === ''){
      return <TopicInfo text={this.state.dataLesson.text} />
    }
  }

  render() {
    return (
      <div className="lesson-edit">
        <h1>Настройка урока</h1>
        {this.state.showModalType && (
          <ModalTypeLesson
            setShowModalType={this.setShowModalType}
            typeLesson={this.state.typeLesson}
            typeActive={this.state.typeActive}
            setActivType={this.setActivType}
          />
        )}
        <div className="lesson-edit-head">
          <div className="lesson-settings">
            <div className="lesson-settings-name">
              <div className="red-block"></div>
              <label>
                <input onChange={this.handleChangeNameLesson} defaultValue={this.state.dataLesson.name}/>
              </label>
            </div>
            <button className="course-button" onClick={this.openModalType}>
              Настройка урока
            </button>
          </div>
          <div className="lesson-list">{this.printLessonList()}</div>
        </div>
        <div className="lesson-content">
          {this.printLesson()}
        </div>
      </div>
    );
  }
}

export default function LessonEdit(props) {
  const { idCourse, topicSlug, lessonSlug } = useParams();
  let setIsUpdate = useOutletContext()[3];
  let setLinkRequestForServer = useOutletContext()[4];
  let dataToUpdate = useOutletContext()[5];
  let setDataToUpdate = useOutletContext()[6];

  if (idCourse !== undefined && lessonSlug !== undefined)
    return (
      <LessonEditClass
        idCourse={idCourse}
        topicSlug={topicSlug}
        lessonSlug={lessonSlug}
        setIsUpdate={setIsUpdate}
        setDataToUpdate={setDataToUpdate}
        dataToUpdate={dataToUpdate}
        setLinkRequestForServer={setLinkRequestForServer}
        key={lessonSlug}
      />
    );
  return <p></p>;
}
