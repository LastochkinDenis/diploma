import { courseCreate } from '../../api/courseDashboard';
import '../CourseAuthorDashboard/CourseDashboardStyle.css'
import './AuthorLIstStyle.css';
import cros from '../../icon/cros.svg';
import { getAuthorList, deleteAuthorList, addAuthorList } from '../../api/courseDashboard';

import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function AuthorList(props) {
    const course = useOutletContext()[0];
    const [authors, setAuthor] = useState([]);
    const ref = useRef(undefined);

    useEffect(() => {
        const getAuthor = async () => {
            let data = await getAuthorList(course.slug);
            setAuthor(data);
        };

        if(course.slug) {
            getAuthor();
        }
    }, [course]);

    const deleteAuthor = async (email) => {
        if(authors.length <= 1) {
            return;
        }
        let data = await deleteAuthorList(course.slug, email);

        if(data)
            setAuthor(data);
    }

    const addAuthor = async () => {
        let data = await addAuthorList(course.slug, ref.current.value);

        if(data)
            setAuthor(data);
    }

    return (
        <div className='author-list'>
            <h1>Список преподователей</h1>
            <div className='author-block-add'>
                <label>
                    <input ref={ref} placeholder='Почта преподователя' />
                </label>
                <button className='course-button' onClick={addAuthor}>
                    Добавить преподователя
                </button>
            </div>
            <div className='authors__wraper'>
                <p>Список преподователей</p>
                <div className='authors'>
                    {authors.map((author, index) => {
                        return <div className='author' key={index}>
                            <p className='author-name'>{`${author.lastName} ${author.firstName}`}</p>
                            <button onClick={() => deleteAuthor(author.email)}>
                                <img src={cros} />
                            </button>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
