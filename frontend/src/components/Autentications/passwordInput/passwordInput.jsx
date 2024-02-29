import './passwordInputStyle.css';
import eyesClosed from '../../../icon/eyesClosed.svg';
import eyesOpen from '../../../icon/eyesOpen.svg';

import { useState } from 'react';

export default function PasswordInput(props) {
    const [isShow, setShow] = useState(false);

    return (
        <div className='password'>
            <input type={isShow ? 'text' : 'password'} onChange={props.handlePasswordChange}/>
            <button type='button' onClick={() => {
                setShow(!isShow);
            }}>
               {isShow && <img src={eyesOpen} /> }
               {!isShow && <img src={eyesClosed} />}
            </button>
        </div>
    )
}