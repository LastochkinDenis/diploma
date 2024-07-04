import ButtonLoad from "../../../ButtonLoader/ButtonLoad";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function QuestionTask(props) {
  const [answerChoice, setAnswerChoice] = useState({});

  useEffect(() => {
    let choices = {};
    for (let answer of props.dataLesson.answer) {
      if (props.dataLesson.lastAnswer.includes(answer)) {
        choices[answer] = true;
      } else {
        choices[answer] = false;
      }
    }
    setAnswerChoice(choices);
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

  const handleCheckboxChange = (answer) => {
    let updatedAnswerChoice = { ...answerChoice };

    updatedAnswerChoice[answer] = !updatedAnswerChoice[answer];

    setAnswerChoice(updatedAnswerChoice);
  };

  const printAnswer = () => {
    let answerList = [];

    for (let answer in answerChoice) {
      answerList.push(
        <div key={answer + "answer"} className="answer-choice">
          <label>
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(answer)}
              checked={answerChoice[answer]}
            />
            <p>{answer}</p>
          </label>
        </div>
      );
    }

    return answerList;
  };

  const SubmitAnswer = async () => {
    await props.setDataAnswer({
      dataAnswer: answerChoice,
      answerLink: `courselesson/course/${props.idCourse}/topic/${props.topicSlug}/lesson/${props.lessonSlug}/questiontask/check`,
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

  return (
    <div>
      <h1>{props.dataLesson.name}</h1>
      <div className="lesson-content">
        <div
          dangerouslySetInnerHTML={{ __html: props.dataLesson.description }}
        />
        {printAnswer()}
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
