import '.././../../CourseAuthorDashboard/compenets/modalDelete/modalDelete.css';
import './modalSavaStyle.css';

import { useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function ModalSave(props) {
    const navigate = useNavigate();

    const clickOutModal = (evt) => {
        if(!evt.target.classList.contains('model_wraper')) {
            props.setShowModalSave(false);
        }
    }

    const ButtonSave = () => {
        const idDone = props.handleSaveChange();

        if(idDone){
            navigate(props.link);
        }
        else {
            props.setShowModalSave(false);
        }
    }

    const ButtonNotSave = () => {
        navigate(props.link);
    }

    return (
        <div className="modal">
            <div className="modal__wraper" onClick={clickOutModal}>
                <div className="modal-content">
                    <p>Вы отредактировали курс, но не сохранили его. Сохранить изменения?</p>
                    <div className="modale-content-button">
                        <button onClick={ButtonSave}>Сохранить</button>
                        <button onClick={ButtonNotSave}>Отменить изменения</button>
                    </div>
                </div>
            </div>
        </div>
    )
}