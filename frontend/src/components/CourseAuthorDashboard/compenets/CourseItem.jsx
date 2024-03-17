import { useClickOutSide } from '../../hooks/useClickOutside.js';
import ContextMenuIcon from '../../../icon/contextMenu.svg';


import { useState, useRef, useEffect } from 'react';

export default function CourseItem(props) {
    const [showMenuToll, setShowMenuToll] = useState(false);
    const refItem = useRef(null);

    useClickOutSide(refItem, () => {setShowMenuToll(false)});

    const showTollMenuClick = (evt) => {
        setShowMenuToll(!showMenuToll);
    };

    return (
        <section className='course-item' ref={refItem}>
            <a href='#'>
                <div className='course-item-header'>
                    {props.course.imageCourse === "" || props.course.imageCourse === '<empty string>' ?
                     <div className='red-block'></div> :
                      <img className='image-course' src={props.course.imageCourse} />}
                    <p className='course-name'>{props.course.name}</p>
                </div>
            </a>
            <div className='context-menu'>
                <button onClick={showTollMenuClick}>
                    <img src={ContextMenuIcon} />
                </button>
            </div>
            { showMenuToll && <div className='toll-menu'>
                <ul>
                    <li>
                        <button>Редактировать</button>
                    </li>
                    <li>
                        <button>Удалить</button>
                    </li>
                </ul>
            </div>}
        </section>
    )
}