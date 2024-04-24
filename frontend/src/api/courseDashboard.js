import axios from "axios";
import { connect } from "react-redux";

export async function courseCreate(data) {
  let isCreate = false;
  let errros = { q: 1 };

  await axios
    .post("course/cratecourse/", {
      name: data.name,
      description: data.description,
    })
    .then((response) => {
      if (response.data.name) {
        isCreate = true;
      }
    })
    .catch((error) => {
      console.log(error.response.data.error);
    });

  return { isCreate, errros };
}

export async function getCourseList() {
  let courseList = [];
  let error;

  await axios
    .get("course/courselist/")
    .then((response) => {
      courseList = response.data;
    })
    .catch((error) => {
      error = "user don't have course";
    });

  return { courseList, error };
}

export async function deleteCourse(courseSlug) {
  let isDelete = false;

  axios
    .post(`course/${courseSlug}/delete/`)
    .then((response) => {
      isDelete = true;
    })
    .catch((error) => console.log(error));

  return isDelete;
}

export async function getInfoDesctiptionCourse(idCourse) {
  let data = {};

  await axios
    .get(`course/${idCourse}/description/`)
    .then((response) => {
      data = response.data.course;
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
}

export async function handleCourseEditApi(linkAPI, data) {
  let erorr = {};
  let isDone = false;

  console.log(data.imageCourse);
  console.log(data.fileCourse);

  let headers = {}

  if(data.imageCourse || data.fileCourse) {
    headers = {
      'Content-Type': 'multipart/form-data'
    }
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  await axios
    .put(`${linkAPI}`, data, {
      headers: {
        ...headers
      }
    })
    .then((response) => {
      isDone = true;
    })
    .catch((error) => console.log(error));

  return isDone;
}

export async function getCourseContent(courseSlug) {

  let data = {}

  await axios.get(`coursecontent/${courseSlug}/content/`)
  .then(response => {
    data = response.data
  })
  .catch(erorr => console.log(erorr));

  return data;
}