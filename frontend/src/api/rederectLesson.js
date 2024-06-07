import axios from "axios";
import axiosResquest from "../axios/reTryRequest";

// let axios = axiosResquest();

export async function getLinkRedercet(slug) {
  let data = "";

  await axios
    .get(`/courselesson/course/${slug}/rederect/`)
    .then((response) => {
      if(response.response.status === 200) {
        data = {link: response.data.link, error: ''};
      }
      else if(response.response.status === 400) {
        data = {error: "the course haven't topic", link: ''};
      }
    })
    .catch((error) => {
      data = {error: "the course haven't topic", link: ''};
      console.log(error);
    });
    
  return data;
}
