import { useClickOutSide } from "../../../hooks/useClickOutside";

import { useEffect, useRef } from "react";

export default function ModalTypeLesson(props) {
  let ref = useRef(undefined);
  useClickOutSide(ref, () => {
    props.setShowModalType(false);
  });

  const clickOnType = (type, language) => {
    props.setActivType(type, language);
  };

  const printTypeCourse = () => {
    let types = [];

    for (let type of props.typeLesson) {
      if (type.languageName == props.typeActive.language && props.typeActive.type == type.type) {
        types.push(
          <div
            key={
                `${type.type}${type.languageName != undefined
            ? type.languageName
            : ""}`
            }
            className="type-lesson type-lesson-active"
            onClick={() => clickOnType(type.type, type.languageName)}
          >
            <p className="type-lesson-name">{`${type.text} ${
              type.languageName != undefined ? type.languageName : ""
            }`}</p>
          </div>
        );
      } else {
        types.push(
          <div
            key={
                `${type.type}${type.languageName != undefined
            ? type.languageName
            : ""}`
            }
            className="type-lesson"
            onClick={() => clickOnType(type.type, type.languageName)}
          >
            <p className="type-lesson-name">{`${type.text} ${
              type.languageName != undefined ? type.languageName : ""
            }`}</p>
          </div>
        );
      }
    }

    return types;
  };

  return (
    <div className="modal">
      <div className="modal__wraper">
        <div className="modal-content" ref={ref}>
          {printTypeCourse()}
        </div>
      </div>
    </div>
  );
}
