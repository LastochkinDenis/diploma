import './modalDelete.css';
import {deleteCourse} from '../../../../api/courseDashboard.js';


export default function ModalDelete (props) {

    const onClouseClick = (evt) => {
        if(!evt.target.classList.contains('model_wraper'))
            props.setModalDelete(false);
    }

    const deleteCourseClick = (evt) => {
        const isDelete = deleteCourse(props.course.slug);
        if(isDelete) {
            props.deleteCourseList(props.course);
        }
        props.setModalDelete(false);
    }

    return (
        <div className='modal'>
            <div className='modal__wraper' onClick={onClouseClick}>
                <div className='modal-content'>
                    <p>Вы уверены что хотите удалить курс {props.course.name}?</p>
                    <div className='modale-content-button'>
                        <button onClick={deleteCourseClick}> 
                            Да
                        </button>
                        <button onClick={() => props.setModalDelete(false)}>
                            Нет
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}