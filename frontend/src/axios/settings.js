import axios from "axios";

axios.defaults.baseURL = 'https://luminari.ru/api/1.0v/';
axios.defaults.withCredentials = true;

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    
    if (error.response.status === 403 && !refresh) {
        refresh = true;
        const response = await axios.get('authentication/updateacesc/');            

        return axios(error.config);
    }
    if (error.response.status !== 403) {
        refresh = false;
    }
    return error;
});
