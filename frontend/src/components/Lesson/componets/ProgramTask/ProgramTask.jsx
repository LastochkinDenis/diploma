import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MonacoEditor from "react-monaco-editor";

export default function ProgramTask(props) {
  const [program, setProgram] = useState();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    let s = {};
    if(props.dataLesson.lastAnswer) {
      s.value = props.dataLesson.lastAnswer;
      setProgram(props.dataLesson.lastAnswer);
    }
    else {
      const defaultValueLenguage = {
        py: "",
        "c#": `namespace DeveloperApiCSharpSample {
      class Program
      {
          static void Main(string[] args)
          {
              
          }
      }
  }
          `,
        lv: "",
      };
  
      s.value = defaultValueLenguage[props.dataLesson.languageName];
    }

    setSettings(s);
  }, []);

  const printNextButton = () => {
    let index = props.lessonsSlug.indexOf(props.lessonSlug);
    if (props.lessonsSlug[index + 1] !== undefined) {
      return (
        <Link
          className="course-button"
          to={`/course/${props.idCourse}/topic/${props.topicSlug}/lesson/${
            props.lessonsSlug[index + 1]
          }`}
        >
          Следующий урок
        </Link>
      );
    }
  };

  const handleChangeAnswer = (evt) => {
    console.log(evt)
    setProgram(evt);
  };

  const SubmitAnswer = async () => {
    await props.setDataAnswer({
      dataAnswer: {
        program: program,
      },
      answerLink: `courselesson/course/${props.idCourse}/topic/${props.topicSlug}/lesson/${props.lessonSlug}/programtask/check`,
    });
    props.handeleSumbmitAnswer();
  };

  const PrintResult = () => {
    if (props.dataLesson.result === "") {
      return undefined;
    } else if (props.dataLesson.result) {
      return <div className="result-right">Ответ правильный</div>;
    } else if (!props.dataLesson.result) {
      return <div className="result-wrong">Ответ неправильный</div>;
    }
  };

  const defaultValue = () => {
    // if (props.dataLesson === "") {
    // }
  };

  return (
    <div>
      <h1>{props.dataLesson.name}</h1>
      <div className="lesson-content">
        <div
          dangerouslySetInnerHTML={{ __html: props.dataLesson.description }}
        />
        <div className="program-editor">
          <MonacoEditor {...settings}
            onChange={handleChangeAnswer}
           height="400" />
        </div>
      </div>
      <div className="lesson-content-button">
        {PrintResult()}
        <button className="course-button" onClick={SubmitAnswer}>
          Проверить
        </button>
        {printNextButton()}
      </div>
    </div>
  );
}
