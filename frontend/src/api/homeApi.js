import axios from 'axios';


export async function getCourseRecomer() {
    let data = [];

    await axios.get('course/recomend/')
    .then(response => {
        data = response.data;
    })
    .catch(error => console.log(error));

    return data;
}