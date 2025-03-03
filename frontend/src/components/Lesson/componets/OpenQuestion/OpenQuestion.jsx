import ButtonLoad from "../../../ButtonLoader/ButtonLoad";

import { Link } from "react-router-dom";

export default function OpenQuestion(props) {
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

  const SubmitAnswer = async () => {
    let inputAnswer = document.querySelector(".lesson-content-answer").value;

    await props.setDataAnswer({
      dataAnswer: {
        answer: inputAnswer,
      },
      answerLink: `courselesson/course/${props.idCourse}/topic/${props.topicSlug}/lesson/${props.lessonSlug}/openquestion/check`,
    });
    props.handeleSumbmitAnswer();
  };

  const PrintResult = () => {
    if ((props.dataLesson.result === "")) {
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
        <input
          className="lesson-content-answer"
          maxLength={50}
          defaultValue={props.dataLesson.lastAnswer}
        />
      </div>
      <div className="lesson-content-button">
        {PrintResult()}
        <ButtonLoad buttonText={"Проверить"} statusLoad={props.isLoad}  callback={SubmitAnswer}/>
        {printNextButton()}
      </div>
    </div>
  );
}
