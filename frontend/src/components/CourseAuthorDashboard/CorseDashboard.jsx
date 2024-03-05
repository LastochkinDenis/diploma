import MegnifyinGlassIcon from  '../../icon/MegnifyinGlassIcon.svg';
import ContextMenuIcon from '../../icon/contextMenu.svg';
import './CorseDashboardStyle.css';

import { Component } from "react";


export default class CourseDashboard extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div className="course-main">
            <h1>Курсы</h1>
            <hr/>
            <div className="control-panale">
                <div className="control-panale-serch-course">
                    <div className="serch-course__wraper">
                        <label>
                            <img src={MegnifyinGlassIcon} />
                            <input type='text' className='serch-course' placeholder='Название курса' />
                        </label>
                    </div>
                    <button className='course-button'>
                        Искать
                    </button>
                </div>
                <button className='course-button'>+ Новый курс</button>
            </div>
            <div className='course-list'>
                <section className='course-item'>
                    <a href='#'>
                        <div className='course-item-header'>
                            <div className='red-block'></div>
                            <p className='course-name'>Название</p>
                        </div>
                        <div className='context-menu'>
                            <button>
                                <img src={ContextMenuIcon} />
                            </button>
                        </div>
                    </a>
                </section>
            </div>
        </div>
        )
    }

}