import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { getLinkRedercet } from '../../api/rederectLesson';

export default function LessonRedirect(props) {
    const [link, setLink] = useState(undefined);
    const { idCourse } = useParams();
    console.log(idCourse);

    useEffect(() => {
        const getData = async () => {
            let data = await getLinkRedercet(idCourse);
            setLink(data.link)
        }
        getData();
    }, []);

    if(link) {
        console.log(link);
        return <Navigate to={link} />
    }
    else {
        return <p></p>
    }
}