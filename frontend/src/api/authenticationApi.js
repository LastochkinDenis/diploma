import axios from 'axios';

export async function regsiterApi(userData) {
    let isCrate = false;
    let erorrResponse = '';

    await axios.post('http://localhost:8000/api/1.0v/authentication/register/', {
        'user' : userData 
    })
    .then(response => {
        isCrate = response.data.isCrate;
    })
    .catch(error => {
        erorrResponse = error.response.data.error;
    });
    
    return {isCrate, erorrResponse};
} 

export async function loginApi(userData) {

    let user = {}
    let erorrResponse = ''


    await axios.post('http://localhost:8000/api/1.0v/authentication/login/',{
        'user': userData
    })
    .then(response => {
        user = response.data; 
    })
    .catch(error => {
        erorrResponse = error.response.data.error;
    });

    return {user, erorrResponse};
}