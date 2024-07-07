import "./LessonStyle.css";
import { getPromotionCourse } from "../../api/coursePromotion";
import { getLessonsSlug } from "../../api/courseDashboard";
import { GetTopicsCourse, LessonApi, SubmitAnswerApi } from "../../api/lessonApi";

import { useParams } from "react-router-dom";
import { Component } from "react";
import LessonPanel from "./componets/lessonPanel/LessonPanel";
import TopicInfo from "./componets/TopicInfo/TopicInfo";
import OpenQuestion from "./componets/OpenQuestion/OpenQuestion";
import QuestionTask from "./componets/QuestionTask/QuestionTask";
import ProgramTask from "./componets/ProgramTask/ProgramTask";

class LessonWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: { name: "" },
      answerLink: '',
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
      isLoad: false
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

  handeleSumbmitAnswer = async () => {
    this.setState(state => ({isLoad: true}))
    let data = await SubmitAnswerApi(this.state.dataAnswer, this.state.answerLink);

    this.setState(state => ({isLoad: false, dataLesson: {...this.state.dataLesson, result: data.result, resultText: data.resultText}}));
  }

  printLesson = () => {
    if(this.state.typeActive.type === 'TextInfo') {
      return <TopicInfo dataLesson={this.state.dataLesson}
      idCourse={this.props.idCourse}
      topicSlug={this.props.topicSlug}
      lessonsSlug={this.state.lessonsSlug}
      lessonSlug={this.props.lessonSlug}
       />
    }
    else if(this.state.typeActive.type === 'OpenQuestion') {
      return <OpenQuestion dataLesson={this.state.dataLesson}
      idCourse={this.props.idCourse}
      topicSlug={this.props.topicSlug}
      lessonsSlug={this.state.lessonsSlug}
      lessonSlug={this.props.lessonSlug}
      setDataAnswer={this.setDataAnswer}
      handeleSumbmitAnswer={this.handeleSumbmitAnswer}
      dataAnswer={this.state.dataAnswer}
      isLoad={this.state.isLoad}
       />
    }
    else if(this.state.typeActive.type === 'QuestionTask') {
      return <QuestionTask dataLesson={this.state.dataLesson}
      idCourse={this.props.idCourse}
      topicSlug={this.props.topicSlug}
      lessonsSlug={this.state.lessonsSlug}
      lessonSlug={this.props.lessonSlug}
      setDataAnswer={this.setDataAnswer}
      handeleSumbmitAnswer={this.handeleSumbmitAnswer}
      dataAnswer={this.state.dataAnswer}
      isLoad={this.state.isLoad}
       />
    } else if(this.state.typeActive.type === 'ProgramoTask') {
      return <ProgramTask dataLesson={this.state.dataLesson}
      idCourse={this.props.idCourse}
      topicSlug={this.props.topicSlug}
      lessonsSlug={this.state.lessonsSlug}
      lessonSlug={this.props.lessonSlug}
      setDataAnswer={this.setDataAnswer}
      handeleSumbmitAnswer={this.handeleSumbmitAnswer}
      dataAnswer={this.state.dataAnswer}
      isLoad={this.state.isLoad}
       />
    }
  };

  setDataAnswer = (data) => {
    this.setState((prevState) => ({
      ...prevState.dataAnswer, ...data
    }));
  }

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
