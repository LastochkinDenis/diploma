import "./QuestionTaskStyle.css";
import Cros from '../../../../icon/cros.svg'

import { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function QuestionTask(props) {

  const [answerChoice, setAnswerChiece] = useState({});

  let ref = useRef();

  useEffect(() => {
    setAnswerChiece(props.answerChoices);
  },[])

  const handleEditorChange = (content) => {
    props.setIsUpdate(true);
    props.setDataToUpdate((prevData) => ({
      ...prevData,
      description: content,
    }));
  };

  const handleEditorInit = () => {};
  
  const handleCheckboxChange = (answer) => {
    let updatedAnswerChoice = {...answerChoice};

    updatedAnswerChoice[answer] = !updatedAnswerChoice[answer];

    setAnswerChiece(updatedAnswerChoice);
    props.setIsUpdate(true);
    props.setDataToUpdate({ ...props.dataToUpdate ,answerChoices: updatedAnswerChoice });
  };

  const deleteAnswer = (answer) => {
    let updatedAnswerChoice = {...answerChoice};

    delete updatedAnswerChoice[answer];

    setAnswerChiece(updatedAnswerChoice);
    props.setIsUpdate(true);
    props.setDataToUpdate({ ...props.dataToUpdate ,answerChoices: updatedAnswerChoice });
  }
  
  const printAnswer = () => {
    let answerList = []

    for(let answer in answerChoice) {
      answerList.push(
      <div key={answer + "answer"} className="answer">
      <label>
      <input
        type="checkbox"
        checked={answerChoice[answer]}
        onChange={() => handleCheckboxChange(answer)}
      />
      <p>{answer}</p>
      </label>
      <button onClick={() => deleteAnswer(answer)}><img src={Cros}/></button>
      </div>);
    }

    return answerList
  };

  const addAnswer = () => {
    setAnswerChiece({...answerChoice, [ref.current.value]: false});
  }

  return (
    <div>
      <h2>Текст задания</h2>
      <Editor
        apiKey="mqeiptnd73o3sf7988afucxpb2ekta4j4u0fnqoiz13fpegb"
        onEditorChange={handleEditorChange}
        initialValue={props.description}
        init={{
          height: 200,
          toolbar:
            "undo redo | blocks fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | removeformat",
          setup: handleEditorInit,
          menubar: false,
          images_file_types: "jpg, svg, webp, png",
        }}
      />
      <h2>Вырианты ответов</h2>
      <div className="choice-answer">
        {printAnswer()}
        <div className="add-choice-answer">
          <input ref={ref}/>
          <button className="course-button" onClick={addAnswer}>Добавить выриант</button>
        </div>
      </div>
    </div>
  );
}
