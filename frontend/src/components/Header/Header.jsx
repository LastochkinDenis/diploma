import { useState } from 'react';
import { useSelector } from 'react-redux';

import './header.css';
import MegnifyinGlassIcon from '../../icon/MegnifyinGlassIcon.svg';
import burgerMenuIcon from '../../icon/burgerMenuIcon.svg';
import { Link } from 'react-router-dom';

function Header(props) {

    const [isOpen, setOpen] = useState();
    const user = useSelector((state) => state.user).user;

    console.log(user)

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
               <div className='header__profile'>
                <a>{user.firstName + " " + user.lastName}</a>
                <div className='header__profile_picture'>
                    <div className='sqrt'>
                         <p>{user.firstName[0].toUpperCase() + "" + user.lastName[0].toUpperCase()}</p>
                    </div>
                </div>
           </div>
          )
    }

    return (
        <header>
           <div className='header__logo'>
                <div className='circle'></div>
           </div>
           <button className='header__menu-button'
           onClick={() => setOpen(!isOpen)}>
                <img src={burgerMenuIcon} />
           </button>
           <nav className={`header__nav ${isOpen  ? " active" : ""}`}>
               <ul className={"header__nav-list"}>
                    <li className='header__nav-item'><a href='#'>Каталог</a></li>
                    <li className='header__nav-item'><a href='#'>Мое обучение</a></li>
                    <li className='header__nav-item'><a href='#'>Преподавание</a></li>
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