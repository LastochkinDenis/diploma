import '../axios/settings';
import {getUserInfo} from '../api/getUserInfo';


import { Component, Fragment } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header/Header';
import MegnifyinGlassIcon from '../icon/MegnifyinGlassIcon.svg';
import Register from './Autentications/register';
import Autentications from './Autentications/authentivations';
import CourseHomePage from './CourseHomePage/CourseHomePage';
import { connect } from 'react-redux';
import CourseDashboard from './CourseAuthorDashboard/CorseDashboard';
import CourseCreate from './CourseCreatePage/CourseCreate';


class AppUnconnect extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let user = await getUserInfo();

    if(user)
      this.props.putUserData({'user': user});
  }
  
  render() {
    return (
    <Fragment>
      <Header />
      <main>
        <Routes>
          <Route path='/register' element=<Register /> />
          <Route path='/login' element=<Autentications /> />
          <Route path='/coursedashboard' element=<CourseDashboard/> />
          <Route path='/coursehome' element=<CourseHomePage/> />
          <Route path='/coursecreate' element=<CourseCreate/> />
        </Routes>
      </main>
      <footer></footer>
    </Fragment>
    )
  }

}

const actionBroker = (dispath) => ({
  putUserData: (key) => {dispath({type: 'user/putUserData', payload: key})}
});

const AppConnect = connect(undefined, actionBroker);
const App = AppConnect(AppUnconnect);

export default App;
