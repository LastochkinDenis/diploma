import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutApi, loginApi } from '../../api/authenticationApi';
import { useClickOutSide } from '../hooks/useClickOutside';


import './header.css';
import MegnifyinGlassIcon from '../../icon/MegnifyinGlassIcon.svg';
import burgerMenuIcon from '../../icon/burgerMenuIcon.svg';
import { Link } from 'react-router-dom';

function Header(props) {

    const [isOpenMenu, setOpenMenu] = useState(false);
    const [isOpneProfil, setOpenProfil] = useState(false);
    const user = useSelector((state) => state.user).user;
    const dispatch = useDispatch();
    const refProfilMenu = useRef(null);
    const refNavMenu = useRef(null);

    useClickOutSide(refProfilMenu, () => {setOpenProfil(false)});
    useClickOutSide(refNavMenu, () => {setOpenMenu(false)});

    const logout = async (evt) => {
     evt.preventDefault();
     const isLogout =  await logoutApi();

     if(isLogout)
          dispatch({type: 'user/deleteUserData', payload: {}});
    }

    const renderUserBlock = () => {

          if(!user.email) {
               return (
                    <div className='header__profile__authentication'>
                    <Link className='header__profile__authentication-link' to='register'>Зарегистрироваться</Link>
                    <Link className='header__profile__authentication-link' to='login'>Войти</Link>
               </div>
               )
          }
          return (
               <div className='header__profile' ref={refProfilMenu}>
                <a>{user.firstName + " " + user.lastName}</a>
                <div className='header__profile_picture'>
                    <div className='sqrt' onClick={() => {
                         setOpenMenu(false);
                         setOpenProfil(!isOpneProfil);
                    }}>
                         <p>{user.firstName[0].toUpperCase() + "" + user.lastName[0].toUpperCase()}</p>
                    </div>
                    <div className={`header__profile-menu ${isOpneProfil ? 'activeF' : ''}`}>
                         <nav>
                              <ul>
                                   <li><a href='#'>Профиль</a></li>
                                   <li><a href='#'>Настройки</a></li>
                                   <li><a href='#' onClick={logout}>Выйти</a></li>
                              </ul>
                         </nav>
                    </div>
                </div>
           </div>
          )
    }

    return (
        <header ref={refNavMenu}>
           <div className='header__logo'>
                <div className='circle'></div>
           </div>
           <button className='header__menu-button'
           onClick={(evt) => {
               setOpenMenu(!isOpenMenu);
               setOpenProfil(false);
           }}>
                <img src={burgerMenuIcon} />
           </button>
           <nav className={`header__nav ${isOpenMenu  ? " active" : ""}`}>
               <ul className={"header__nav-list"}>
                    <li className='header__nav-item'><a href='#'>Каталог</a></li>
                    { user.email && <li className='header__nav-item'><a href='#'>Мое обучение</a></li>}
                    <li className='header__nav-item'><Link to='coursehome'>Преподавание</Link></li>
               </ul>
               <div className='header__search'>
                    <label for='search'>
                        <img src={MegnifyinGlassIcon} />
                    </label>
                    <input id='search' placeholder='Поиск...'/>
               </div>
           </nav>
           {renderUserBlock()}
        </header>
    )
}

export default Header;