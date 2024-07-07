import axios from "axios";
import { connect } from "react-redux";
import axiosResquest from "../axios/reTryRequest";

let axiosR = axiosResquest();

export async function courseCreate(data) {
  let isCreate = false;
  let errros = { };

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

  await axiosR
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

  await axiosR
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

  let headers = {};

  if (data.imageCourse) {
    headers = {
      "Content-Type": "multipart/form-data",
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  await axios
    .put(`${linkAPI}`, data, {
      headers: {
        ...headers,
      },
    })
    .then((response) => {
      isDone = true;
    })
    .catch((error) => console.log(error));

  return isDone;
}

export async function getCourseContent(courseSlug) {
  let data = {};

  await axiosR
    .get(`coursecontent/${courseSlug}/content/`)
    .then((response) => {
      data = response.data;
    })
    .catch((erorr) => console.log(erorr));

  return data;
}

export async function getAuthorList(slug) {
  let data = [];

  await axiosR
    .get(`course/${slug}/author/`)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  return data;
}

export async function addAuthorList(slug, email) {
  let data = [];

  await axiosR
    .post(`course/${slug}/author/`, {
      email: email,
    })
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  return data;
}

export async function deleteAuthorList(slug, email) {
  let data = [];

  await axiosR
    .delete(`course/${slug}/author/`, {
      data: { email: email },
    })
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  return data;
}

export async function getLessonsSlug(courseSlug, topicSlug) {
  let data = [];

  await axiosR
    .get(`coursecontent/${courseSlug}/lessons/${topicSlug}/`)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  return data;
}

export async function getDataLessonEdit(courseSlug, topicSlug, lessonSlug) {
  let data = {};

  await axiosR
    .get(`coursecontent/${courseSlug}/topic/${topicSlug}/lesson/${lessonSlug}/`)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  return data;
}

export async function PublishCourse(slug) {
  let data = false;

  await axios
    .post(`course/${slug}/publish/`)
    .then((response) => {
      if (response.status == 200) {
        data = true;
      }
    })
    .catch((error) => {
      console.log(error);
      data = false;
    });

  return data;
}
