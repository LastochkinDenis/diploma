import axiosResquest from "../axios/reTryRequest";

let axios = axiosResquest();

export async function getTraining() {
  let data = [];

  await axios
    .get("course/training/")
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  return data;
}
