import axios from 'axios';


export async function getSearch(search='') {
    let data = [];

    await axios.get(`course/search/${search}`)
    .then(response => {
        data = response.data;
    })
    .catch(error => {
        console.log(error);
    });

    return data;
}