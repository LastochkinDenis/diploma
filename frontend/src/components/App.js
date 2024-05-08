import "../axios/settings";
import { getUserInfo } from "../api/getUserInfo";

import { Component, Fragment } from "react";
import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Header/Header";
// import MegnifyinGlassIcon from '../icon/MegnifyinGlassIcon.svg';
import Register from "./Autentications/register";
import Autentications from "./Autentications/authentivations";
import CourseHomePage from "./CourseHomePage/CourseHomePage";
import { connect } from "react-redux";
import CourseDashboard from "./CourseAuthorDashboard/CourseDashboard";
import CourseCreate from "./CourseCreatePage/CourseCreate";
import EditCourse from "./editCourse/EditCourse";
import CourseDescrition from "./editCourse/componets/courseDescription/courseDescription";
import ContentCourse from "./editCourse/componets/contentCourse/contentCourse";
import AuthorList from "./AuthorsList/AuthorList";
import LessonEdit from "./LessonEdit/LessonEdit";
import Home from "./Home/Home";
import CoursePromotion from "./CoursePromotion/CoursePromotion";
import MyTraining from "./MyTraining/MyTraining";
import Lesson from "./Lesson/Lesson";
import LessonRedirect from "./Lesson/LessonRedirect";

class AppUnconnect extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let user = await getUserInfo();

    if (user) this.props.putUserData({ user: user });
  }

  render() {
    return (
      <div>
      <Header />
      <main>
        <Routes>
            <Route path="/" element=<Home /> />
            <Route path="/course/:idCourse/topic/:topicSlug/lesson/:lessonSlug" element=<Lesson /> /> 
            <Route path="/register" element=<Register />/>
            <Route path="/course/:idCourse/promotion" element=<CoursePromotion /> />
            <Route path="/course/:idCourse/redirect" element=<LessonRedirect /> />
            <Route path="/login" element=<Autentications /> />
            <Route path="/coursedashboard" element=<CourseDashboard /> />
            <Route path="/coursehome" element=<CourseHomePage /> />
            <Route path="/coursecreate" element=<CourseCreate /> />
            <Route path="/mytraining" element=<MyTraining /> />
            <Route path="/course/:idCourse/edit" element={<EditCourse />}>
              <Route path="descrition" element={<CourseDescrition />} />
              <Route path="content" element={<ContentCourse />} />
              <Route path="author" element={<AuthorList />} />
              <Route path="topic/:topicSlug/lesson/edit/:lessonSlug" element={<LessonEdit />} />
            </Route>
          </Routes>
      </main>
      </div>
    );
  }
}

{/* <Fragment>
        <Header />
        <main>
          
        </main>
        <footer></footer>
      </Fragment> */}

const actionBroker = (dispath) => ({
  putUserData: (key) => {
    dispath({ type: "user/putUserData", payload: key });
  },
});

const AppConnect = connect(undefined, actionBroker);
const App = AppConnect(AppUnconnect);

export default App;
