import Task from "./Task";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useOutletContext } from "react-router-dom";

export default function Topic(props) {
  const [serialNumberAdd, setSerialNumberAdd] = useState(1);
  let ref = useRef();
  let [topic, setTopik] = useState({
    info: { name: "", serialNumber: "" },
    content: {},
  });
  let setIsUpdate = useOutletContext()[3];
  let dataToUpdate = useOutletContext()[5];
  let setDataToUpdate = useOutletContext()[6];

  useEffect(() => {
    setTopik(props.topic);

    let amountTask = Object.keys(props.topic.content).length + 1;
    setSerialNumberAdd(`${props.topic.info.serialNumber}.${amountTask}`);
  }, [props.topic.info.slug]);

  useEffect(() => {
    if (topic.info.isCreate) {
      let randomSlug = `${Math.random(0, 1000)}${Math.random(0, 1000)}`;

      let data = {
        [randomSlug]: {
          isCreate: true,
        },
      };

      setTopik({ ...topic, info: { ...topic.info, slug: randomSlug } });
    }
  }, [topic.info.isCreate]);

  const handleAddTask = (evt) => {
    let taskName = ref.current.value;
    let randomSlug = `${Math.random(0, 1000)}${Math.random(0, 1000)}`;
    let serialNumber = serialNumberAdd.split('.')[1];

    if (taskName === "") {
      return;
    }

    setTopik({
      ...topic,
      content: {
        ...topic.content,
        [serialNumber]: { name: taskName, slug: randomSlug },
      },
    });

    props.addTask(topic.info.serialNumber, {
      [serialNumber]: { name: taskName, slug: randomSlug },
    });

    dataToUpdate[topic.info.slug] = {
      ...dataToUpdate[topic.info.slug],
      [randomSlug]: {
        do: "create task",
        data: {
          name: taskName,
          serialNumber: serialNumber,
        },
      },
    };

    if (dataToUpdate[topic.info.slug]["change order"]) {
      dataToUpdate[topic.info.slug]["change order"].push(randomSlug);
    }

    setDataToUpdate({ ...dataToUpdate });
    setIsUpdate(true);

    setSerialNumberAdd(
      (prevSerialNumberAdd) =>
        `${topic.info.serialNumber}.${
          Number(prevSerialNumberAdd.split(".")[1]) + 1
        }`
    );
  };

  const deleteTask = (serialNumber) => {
    serialNumber = serialNumber.split('.')[1]
    dataToUpdate[topic.info.slug] = {
      ...dataToUpdate[topic.info.slug],
      [topic.content[serialNumber].slug]: {
        do: "delete",
        data: {
          name: topic.content[serialNumber].name,
          serialNumber: serialNumber,
        },
      },
    };

    if (dataToUpdate[topic.info.slug]["change order"]) {
      dataToUpdate[topic.info.slug]["change order"].splice(
        topic.content[serialNumber].slug,
        1
      );
    }

    setDataToUpdate({ ...dataToUpdate });
    setIsUpdate(true);

    delete topic.content[serialNumber];

    if (Object.keys(topic.content).length > 0) {
      let content = {};
      for (let serialNumberTask in topic.content) {
        let numberTask = Number(serialNumberTask.split(".")[1]);
        let numberDelete = Number(serialNumber.split(".")[1]);

        if (serialNumber < serialNumberTask) {
          content[serialNumberTask - 1] =
            topic.content[serialNumberTask];
        } else {
          content[serialNumberTask] = topic.content[serialNumberTask];
        }
      }
      setTopik({ ...topic, content: { ...content } });
      setSerialNumberAdd(
        `${topic.info.serialNumber}.${Object.keys(content).length + 1}`
      );
    } else {
      setTopik({ ...topic, content: {} });
      setSerialNumberAdd(`${serialNumber.split(".")[0]}.1`);
    }
  };

  const printTask = () => {
    let printList = [];
    let index = 1;

    for (let key in topic.content) {
      let serialNumber = `${topic.info.serialNumber}.${key}`;
      printList.push(
        <Task
          serialNumber={serialNumber}
          task={topic.content[key]}
          deleteTask={deleteTask}
          index={index}
        />
      );
      index++;
    }

    return printList;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    let serialNumberTopic = topic.info.serialNumber;
    let taskOrder = [];

    let taskList = Object.keys(topic.content);

    taskList.splice(result.source.index - 1, 1);
    taskList.splice(result.destination.index - 1, 0, result.draggableId.split('.')[1]);

    let index = 1;
    let content = {};

    for (let serialNumberTask of taskList) {
      content[index] =
        topic.content[serialNumberTask];
      taskOrder.push(topic.content[serialNumberTask].slug);
      index++;
    }

    dataToUpdate[topic.info.slug] = {
      ...dataToUpdate[topic.info.slug],
      "change order": taskOrder,
    };

    setDataToUpdate({ ...dataToUpdate });
    setIsUpdate(true);

    setTopik({ ...topic, content: { ...content } });
  };

  const handleChangeNameTopic = (evt) => {
    let value = evt.target.value;

    if (topic.info.isCreate) {
      dataToUpdate[topic.info.slug] = {
        ...dataToUpdate[topic.info.slug],
        [topic.info.slug]: {
          do: "create",
          data: {
            name: value,
            serialNumber: topic.info.serialNumber,
          },
        },
      };
    } else {
      dataToUpdate[topic.info.slug] = {
        ...dataToUpdate[topic.info.slug],
        [props.topic.info.slug]: {
          do: "rename",
          data: {
            name: value,
          },
        },
      };
    }
    setDataToUpdate({ ...dataToUpdate });
    setIsUpdate(true);
  };

  const deleteTopic = () => {
    
    if(topic.info.isCreate) {
      delete dataToUpdate[topic.info.slug]
    }
    else {
      dataToUpdate[topic.info.slug] = {
        ...dataToUpdate[topic.info.slug],
        [props.topic.info.slug]: {
          do: "delete",
        }
      };
    }
    setDataToUpdate({ ...dataToUpdate });
    setIsUpdate(true);
    props.deleteTopic(topic.info.serialNumber);
  };

  return (
    <div className="course-topic">
      <div className="course-topic-head">
        <p>{topic.info.serialNumber}</p>
        <input
          defaultValue={topic.info.name}
          type="text"
          onChange={handleChangeNameTopic}
        />
      </div>
      <div className="course-topic-tasks">
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId={topic.info.serialNumber.toString() + "droppableId"}
            >
              {(provided) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {printTask()}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="course-topic-task">
          <div className="course-topic-task-info">
            <div className="red-block"></div>
            <p className="course-topic-task-info-serial-number">
              {serialNumberAdd}
            </p>
            <input type="text" ref={ref} />
          </div>
          <button className="course-button" onClick={handleAddTask}>
            + Создать задачу
          </button>
        </div>
        <button className="course-button" onClick={deleteTopic}>
          Удалить тему
        </button>
      </div>
    </div>
  );
}
