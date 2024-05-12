import axios from 'axios';

export async function getLinkRedercet(slug) {
    let data = '';

    await axios.get(`/courselesson/course/${slug}/rederect/`)
    .then(response => {
        data = response.data;
    })
    .catch(error => {
        console.log(error);
    });

    return data;
}