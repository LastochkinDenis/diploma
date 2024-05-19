import axiosResquest from "../axios/reTryRequest";

let axios = axiosResquest();

export async function getSearch(search = "") {
  let data = [];

  await axios
    .get(`course/search/${search}`)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}
