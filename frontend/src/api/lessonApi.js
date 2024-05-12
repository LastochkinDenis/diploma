import axios from "axios";


export async function GetTopicsCourse(slug) {
    let data = [];

    await axios.get(`courselesson/course/${slug}/topics/`)
    .then(response => {
        data = response.data;
    })
    .catch(error => console.log(error));

    return data;
}
export async function LessonApi(slug, slugTopic, slugLesson) {
    let data = {};

    await axios.get(`courselesson/course/${slug}/topic/${slugTopic}/lesson/${slugLesson}/`)
    .then(response => {
        data = response.data;
    })
    .catch(error => console.log(error));

    return data;
}
export async function SubmitAnswerApi(dataAnswer, link) {
    let data = false;

    await axios.post(link, dataAnswer)
    .then(response => {
        data = response.data;
    })
    .catch(error => console.log(error));

    return data;
}