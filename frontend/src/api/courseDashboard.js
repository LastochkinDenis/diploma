import axios from "axios";
import { connect } from "react-redux";


export async function courseCreate(data) {

    let isCreate = false;
    let errros = {q: 1}

    await axios.post('course/cratecourse/', {
        'name': data.name,
        'description': data.description
    })
    .then(response => {
        if(response.data.name) {
            isCreate = true;
        }
    })
    .catch(error => {
        console.log(error.response.data.error);
    })

    return {isCreate, errros};
}

export async function getCourseList() {

    let courseList = [];
    let error;

    await axios.get('course/courselist/')
    .then(response => {
        courseList = response.data;
    })
    .catch(error => {
        error = 'user don\'t have course';
    })

    return {courseList, error}
}