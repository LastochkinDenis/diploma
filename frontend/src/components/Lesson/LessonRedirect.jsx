import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { getLinkRedercet } from '../../api/rederectLesson';

export default function LessonRedirect(props) {
    const [linkData, setLinkData] = useState({});
    const { idCourse } = useParams();

    useEffect(() => {
        const getData = async () => {
            let data = await getLinkRedercet(idCourse);
            setLinkData(data)
        }
        getData();
    }, []);

    if(linkData.link !== '' && linkData.error === '') {
        return <Navigate to={linkData.link} />
    }
    else {
        return <h2>В курсе нет тем</h2>
    }
}