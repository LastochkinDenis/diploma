import { Navigate } from 'react-router-dom';
import MegnifyinGlassIcon from  '../../icon/MegnifyinGlassIcon.svg';
import ContextMenuIcon from '../../icon/contextMenu.svg';
import './CourseDashboardStyle.css';
import CourseItem from './compenets/CourseItem.jsx';
import modalDelete from './compenets/modalDelete/modalDelete.jsx';

import { Component, createRef } from "react";
import ModalDelete from './compenets/modalDelete/modalDelete.jsx';


export default class CourseDashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showCourseList: this.props.courseList,
            serch: '',
            resetSerch: false,
            redirectCrate: false,
            modalDelete: false,
            selectCourse: {}
        }
    }

    serchRef = createRef()
    tollMenuRef = createRef()

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.resetSerch !== nextState.resetSerch ||
             nextState.redirectCrate || this.state.modalDelete || nextState.modalDelete) {
            return true;
        }
        if(this.state.showCourseList === nextState.showCourseList){
            return false;
        }
        return true;
    }

    orderCourseList = () => {
        if(this.serch === '') {
            return;
        }

        let courseList = this.props.courseList.filter((course => {
            return course.name.includes(this.state.serch);
        }));

        this.setState((state) => ({showCourseList: courseList, resetSerch: true}));
    }

    printCourse = (course) => { 
        return (
            <section className='course-item'>
            <a href='#'>
                <div className='course-item-header'>
                    {course.imageCourse === "" ? <div className='red-block'></div> : <img className='image-course' src={course.imageCourse} />}
                    <p className='course-name'>{course.name}</p>
                </div>
                <div className='context-menu'>
                    <button>
                        <img src={ContextMenuIcon} />
                    </button>
                </div>
            </a>
        </section>
        )
    }

    handskeResetSerch = () => {
        this.setState((serch) => ({showCourseList: this.props.courseList, resetSerch: false, serch: ''}));
        this.serchRef.current.value = '';
    }

    handleSerchChange = (evt) => {
        this.setState((state) => ({serch: this.serchRef.current.value}));
    }

    addCourse = () => {
        this.setState((state) => ({redirectCrate: true}));
    }

    setModalDelete = (isShow, selectCourse = {}) => {
        if(Object.entries(selectCourse).length > 0) 
            this.setState((state) => ({modalDelete: isShow, selectCourse: selectCourse}));
        this.setState((state) => ({modalDelete: isShow}));
    }

    deleteCourseList = (course) => {
        let courses = this.state.showCourseList.filter((c) => {return course.slug !== c.slug});
        this.setState((state) => ({showCourseList: courses}));
    }

    render() {
        if(this.state.redirectCrate) {
            return <Navigate to='/coursecreate' />
        }
        return (
        <div className="course-main">
            <h1>Курсы</h1>
            <hr/>
            {this.state.modalDelete && <ModalDelete course={this.state.selectCourse} 
            setModalDelete={this.setModalDelete}
            deleteCourseList={this.deleteCourseList} />}
            <div className="control-panale">
                <div className="control-panale-serch-course">
                    <div className="serch-course__wraper">
                        <label>
                            <img src={MegnifyinGlassIcon} />
                            <input type='text' className='serch-course' placeholder='Название курса' onChange={this.handleSerchChange} ref={this.serchRef} />
                        </label>
                    </div>
                    <button className='course-button' onClick={this.orderCourseList}>
                        Искать
                    </button>
                    {this.state.resetSerch && <button onClick={this.handskeResetSerch} className='course-button'>Сбросить</button>}
                </div>
                <button className='course-button' onClick={this.addCourse}>+ Новый курс</button>
            </div>
            <div className='course-list'>
            {
                this.state.showCourseList.map(course => <CourseItem course={course} setModalDelete={this.setModalDelete} />)
            }
            </div>
        </div>
        )
    }

}