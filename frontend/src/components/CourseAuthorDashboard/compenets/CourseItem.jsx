import { useClickOutSide } from '../../hooks/useClickOutside.js';
import ContextMenuIcon from '../../../icon/contextMenu.svg';
import { Link } from 'react-router-dom';

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
            <Link to={`/course/${props.course.slug}/edit/content`}>
                <div className='course-item-header'>
                    {props.course.imageCourse === "" || props.course.imageCourse === '<empty string>' ?
                     <div className='red-block'></div> :
                      <img className='image-course' src={props.course.imageCourse} />}
                    <p className='course-name'>{props.course.name}</p>
                </div>
            </Link>
            <div className='context-menu'>
                <button onClick={showTollMenuClick}>
                    <img src={ContextMenuIcon} />
                </button>
            </div>
            { showMenuToll && <div className='toll-menu'>
                <ul>
                    <li>
                        <Link to={`/course/${props.course.slug}/edit/descrition`}>Редактировать</Link>
                    </li>
                    <li>
                        <button onClick={() => {
                            props.setModalDelete(true, props.course);
                        }}>Удалить</button>
                    </li>
                </ul>
            </div>}
        </section>
    )
}