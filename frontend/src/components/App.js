import { Component, Fragment } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css';
import MegnifyinGlassIcon from '../icon/MegnifyinGlassIcon.svg';

class App extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    return (
    <Fragment>
      <header className='flex-block'>
        <nav className='header-navigate'>
          <ul>
            <li className='header-navigate-logo'>
              <a><div className='circle'>{ /* temporarily */ }</div></a>
            </li>
            <li>
              <a href='#'>Каталог</a>
            </li>
            <li>
              <a href='#'>Мое обусение</a>
            </li>
            <li>
              <a href='#'>Преподавание</a>
            </li>
          </ul>
        </nav>

        <div className='header-profile-wraper flex-block'>
        {/* --------------- */ }
          <div className='search-wraper'>
            <img src={MegnifyinGlassIcon} />
            <input className='search' placeholder='Поиск...' />
          </div>
        {/* --------------- */ }
          {/* <div className='profile flex-block'>
              <a href='#'>
                <p>NameUser</p>
              </a>
              <a href='#'>
                <div className='sqrt'></div>
              </a>
          </div> */}
          <div className='profile flex-block'>
            <a href='#' className='authenticatin-batten'>Регистрация</a>
            <a href='#' className='authenticatin-batten'>Войти</a>
          </div>
        </div>
      </header>
      <main>
      <p>Главная страниа</p>
      </main>
      <footer></footer>
    </Fragment>
    )
  }

}

export default App;
