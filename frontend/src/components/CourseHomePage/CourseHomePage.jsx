import './CourseHomePageStyle.css';

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function CourseHomePage(props) {
    const [haveUserCourse, sethaveUserCourse] = useState(false);

    if(haveUserCourse) {
        return <Navigate to='/coursedashboard' />
    }
    return (
        <div className='InformationForCreateCourse'>
            <h1>Создовай курсы в онлайн кострукторе</h1>
            <section className='textForCreateCourse'>
                <h2>Добро пожаловать на страницу создания курсов!</h2>
                <p>Наши курсы - это возможность поделиться вашим знанием и опытом с миром. Если у вас есть экспертное знание в определенной области и вы хотите передать его другим, создание курса - отличный способ сделать это.</p>
            </section>
            <section className='textForCreateCourse'>
                <h2>Почему создание курса у нас?</h2>
                <p>Мы предлагаем удобную платформу для создания и публикации курсов, которая позволит вам легко поделиться своими знаниями с тысячами студентов со всего мира. Наша цель - помочь вам создать информативный и интересный курс, который будет полезен и вдохновителен для наших учащихся.</p>
            </section>
            <section className='textForCreateCourse'>
                <h2>Что вам нужно для создания курса?</h2>
                <p>Для создания курса вам потребуется определить тему курса, разработать структуру уроков, подготовить материалы и задания для студентов. Мы поддержим вас на каждом этапе процесса создания курса, чтобы ваш контент был качественным и привлекательным для аудитории.</p>
            </section>
            <section className='textForCreateCourse'>
                <h2>Присоединяйтесь к нашему сообществу преподавателей!</h2>
                <p>Если вы готовы поделиться своими знаниями и вдохновить других на обучение, присоединяйтесь к нашему сообществу преподавателей. Создайте свой курс прямо сейчас и помогите другим достичь новых высот в своем обучении и развитии.</p>
            </section>
            <div class='wrapepr__button-create-corse'>
                <Link to='/coursecreate' className='button-create-corse'>Содать курс</Link>
            </div>
        </div>
    )
}