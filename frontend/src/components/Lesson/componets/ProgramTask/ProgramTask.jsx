import ButtonLoad from "../../../ButtonLoader/ButtonLoad";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MonacoEditor from "react-monaco-editor";

export default function ProgramTask(props) {
  const [program, setProgram] = useState();
  const [settings, setSettings] = useState({});
  const [resultText, setResulText] = useState("");

  useEffect(() => {
    let s = {};
    if (props.dataLesson.lastAnswer) {
      s.value = props.dataLesson.lastAnswer;
      setProgram(props.dataLesson.lastAnswer);
    } else {
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
        lv: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        
    }
}`,
      };

      s.value = defaultValueLenguage[props.dataLesson.languageName];
    }

    setSettings(s);
  }, [props.dataLesson.lastAnswer]);

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

  const PrintTermenalResult = () => {
    const lines = props.dataLesson.resultText.split("\n");

    return (
      <div className="termenal-result">
        <p>Результат проверки:</p>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>{props.dataLesson.name}</h1>
      <div className="lesson-content">
        <div
          dangerouslySetInnerHTML={{ __html: props.dataLesson.description }}
        />
        {props.dataLesson.resultText && PrintTermenalResult()}
        <div className="program-editor">
          <MonacoEditor
            {...settings}
            onChange={handleChangeAnswer}
            height="400"
          />
        </div>
      </div>
      <div className="lesson-content-button">
        {PrintResult()}
        <ButtonLoad buttonText={"Проверить"} statusLoad={props.isLoad}  callback={SubmitAnswer}/>
        {/* {props.isLoad ? (
          <button className="course-button course-button-load__wraper">
            <div className="course-button-load">
              <div className="course-button-load-item"></div>
              <div className="course-button-load-item"></div>
              <div className="course-button-load-item"></div>
              <div className="course-button-load-item"></div>
            </div>
          </button>
        ) : (
          <button className="course-button" onClick={SubmitAnswer}>
            <p>Проверить</p>
          </button>
        )} */}
        {printNextButton()}
      </div>
    </div>
  );
}
