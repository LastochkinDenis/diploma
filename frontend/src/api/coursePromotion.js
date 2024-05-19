import axiosResquest from "../axios/reTryRequest";

let axios = axiosResquest();

export async function getPromotionCourse(slug) {
  let data = [];

  await axios
    .get(`course/${slug}/description/`)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

export async function enrollmentCourseApi(slug) {
  let enrollment = false;

  await axios
    .post(`course/${slug}/enrollment/`)
    .then((response) => {
      const status = response.status;
      if (status == 200) {
        enrollment = true;
      } else {
        enrollment = false;
      }
    })
    .catch((error) => {
      console.log(error);
      enrollment = false;
    });

  return enrollment;
}
