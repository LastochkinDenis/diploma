import { getCourseContent } from "../../../../api/courseDashboard";
import Cros from "../../../../icon/cros.svg";
import "./contentCourseStyle.css";
import Topic from "./components/Topic";

import { Component } from "react";
import { useOutletContext } from "react-router-dom";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = { content: {} };
  }

  async componentDidMount() {
    let data = await getCourseContent(this.props.courseSlug);
    this.props.setLinkRequestForServer(`/coursecontent/${this.props.courseSlug}/content/`);

    this.setState((state) => ({ content: data }));
  }

  async componentDidUpdate(pervProps, prevState) {
    if (this.props.isUpdate === false && pervProps.isUpdate === true) {
      let data = await getCourseContent(this.props.courseSlug);
      console.log('--------------------')
      console.log(data);
      this.setState((state) => ({ content: data }));
    }
  }

  handleCreateTopic = () => {
    let newSerialNumber = Object.keys(this.state.content).length + 1;
    let newTopic = {
      info: {
        slug: "",
        name: "",
        serialNumber: newSerialNumber,
        courseSlug: this.props.courseSlug,
        isCreate: true,
      },
      content: {},
    };

    this.setState((state) => ({
      content: { ...state.content, [newSerialNumber]: newTopic },
    }));
  };

  renderTopic = () => {
    let topicList = [];

    for (let topic of Object.values(this.state.content)) {
      console.log(topic)
      topicList.push(
        <Topic
          topic={topic}
          courseSlug={this.props.courseSlug}
          deleteTopic={this.deleteTopic}
          addTask={this.addTask}
          key={`${topic.info.serialNumber}Topic`}
        />
      );
    }

    return topicList;
  };

  shouldComponentUpdate(nextProps, nextState) {
    // if(nextProps.isUpdate == false && this.props.isUpdate == true) {
    //   return true
    // }
    // if (
    //   Object.keys(this.state.content).length ==
    //   Object.keys(nextState.content).length
    // ) {
    //   return false;
    // }
    return true;
  }

  deleteTopic = (serialNumber) => {
    this.setState((prevState) => {
      const updatedContent = { ...prevState.content };
      delete updatedContent[serialNumber];

      const updatedContentWithNewIndex = {};
      let index = 1;
      
      for (let key in updatedContent) {
        let topic = updatedContent[key];
        topic.info.serialNumber = index;
        updatedContentWithNewIndex[index] = topic;
        index++;
      }

      return { content: { ...updatedContentWithNewIndex } };
    });
  };

  addTask = (serialNumberTopic, data) => {
    let content = this.state.content;
    content[serialNumberTopic] = { ...content[serialNumberTopic],
      content: { ...content[serialNumberTopic].content, ...data },
    };

    this.setState((state) => ({ content: {...content}}));
  };

  render() {
    return (
      <div className="content-course">
        <h1>Программа курса</h1>
        {this.renderTopic()}
        <button onClick={this.handleCreateTopic} className="course-button">
          + Создать тему
        </button>
      </div>
    );
  }
}

export default function ContentCourse(props) {
  const [course] = useOutletContext();
  let isUpdate = useOutletContext()[7];
  let setLinkRequestForServer = useOutletContext()[4];

  if (course.slug)
    return (
      <Content
        courseSlug={course.slug}
        setLinkRequestForServer={setLinkRequestForServer}
        isUpdate={isUpdate}
      />
    );
  return <p></p>;
}
