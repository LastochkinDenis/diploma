import axio from "axios";

export async function getPromotionCourse(slug) {
  let data = [];

  await axio
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

  await axio.post(`course/${slug}/enrollment/`)
  .then(response => {
    const status = response.status;
    if(status == 200) {
      enrollment = true;
    }
    else {
      enrollment = false;
    }
  })
  .catch(error => {
    
    console.log(error);
    enrollment = false;
  })

  return enrollment;
}