import ArrowToDown from "../../icon/arrowToDown.svg";

import { useEffect, useState } from "react";

export default function CourseContent(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if(props.content)
      setItems(props.content);
  }, [props.content])

  return (
    <div className="list">
      {items.map((item, index) => (
        <div className="item" key={index}>
          <div
            className="title"
            onClick={() =>
              setItems((prevItems) => {
                const newItems = [...prevItems];
                newItems[index].isOpen = !newItems[index].isOpen;
                return newItems;
              })
            }
          >
            <p>{index + 1} {item.title}</p>
            <img src={ArrowToDown} className={item.isOpen ? '' : 'rotate'}/>
          </div>
          {item.isOpen && (
            <div className="sublist">
              {item.subitems.map((subitem, subindex) => (
                <div className="subitem" key={subindex}>
                  <p>{subindex + 1} {subitem}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
