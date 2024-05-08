import "./LessonStyle.css";
import { getPromotionCourse } from "../../api/coursePromotion";
import { getLessonsSlug } from "../../api/courseDashboard";
import { GetTopicsCourse, LessonApi } from "../../api/lessonApi";

import { useParams } from "react-router-dom";
import { Component } from "react";
import LessonPanel from "./componets/lessonPanel/LessonPanel";
import TopicInfo from "./componets/TopicInfo/TopicInfo";

class LessonWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: { name: "" },
      dataAnswer: {},
      lessonsSlug: [],
      topics: [],
      typeLesson: [
        { type: "TextInfo", text: "информационый текст", languageName: '' },
        { type: "QuestionTask", text: "задача с выбором ответа", languageName: ''},
        { type: "OpenQuestion", text: "открытый вопрос", languageName: ''},
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
      typeActive: { type: "", languageName: "" },
      dataLesson: {},
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.topicSlug !== this.props.topicSlug) {
      let lessonsSlug = await getLessonsSlug(
        this.props.idCourse,
        this.props.topicSlug
      );
      this.setState((state) => ({ lessonsSlug: lessonsSlug }));
    }
    if (prevProps.lessonSlug !== this.props.lessonSlug) {
      let dataLesson = await LessonApi(
        this.props.idCourse,
        this.props.topicSlug,
        this.props.lessonSlug
      );
      this.setState((state) => ({
        dataLesson: dataLesson,
        typeActive: {type: dataLesson.type, languageName: dataLesson.languageName}
      }));    
    }
  }

  async componentDidMount() {
    let dataCourse = await getPromotionCourse(this.props.idCourse);
    let lessonsSlug = await getLessonsSlug(
      this.props.idCourse,
      this.props.topicSlug
    );
    let topics = await GetTopicsCourse(this.props.idCourse);
    let dataLesson = await LessonApi(
      this.props.idCourse,
      this.props.topicSlug,
      this.props.lessonSlug
    );

    this.setState((state) => ({
      course: { name: dataCourse.course.name },
      lessonsSlug: lessonsSlug,
      topics: topics,
      dataLesson: dataLesson,
      typeActive: {type: dataLesson.type, languageName: dataLesson.languageName}
    }));
  }

  handeleSumbmitAnswer = () => {};

  printLesson = () => {
    if(this.state.typeActive.type === 'TextInfo') {
      return <TopicInfo dataLesson={this.state.dataLesson}
      idCourse={this.props.idCourse}
      topicSlug={this.props.topicSlug}
      lessonsSlug={this.state.lessonsSlug}
      lessonSlug={this.props.lessonSlug}
       />
    }
  };

  render() {
    return (
      <div className="lesson__wraper">
        <LessonPanel
          name={this.state.course.name}
          idCourse={this.props.idCourse}
          topicSlug={this.props.topicSlug}
          lessonsSlug={this.state.lessonsSlug}
          lessonSlug={this.props.lessonSlug}
          topics={this.state.topics}
        />
        <div className="lesson">
          {this.printLesson()}
        </div>
      </div>
    );
  }
}

export default function Lesson(props) {
  let { idCourse, topicSlug, lessonSlug } = useParams();

  return (
    <LessonWrap
      idCourse={idCourse}
      topicSlug={topicSlug}
      lessonSlug={lessonSlug}
    />
  );
}
