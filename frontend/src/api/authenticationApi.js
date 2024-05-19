import axiosResquest from "../axios/reTryRequest";

let axios = axiosResquest();

export async function regsiterApi(userData) {
  let isCrate = false;
  let erorrResponse = "";

  await axios
    .post("authentication/register/", {
      user: userData,
    })
    .then((response) => {
      isCrate = response.data.isCrate;
    })
    .catch((error) => {
      erorrResponse = error.response.data.error;
    });

  return { isCrate, erorrResponse };
}

export async function loginApi(userData) {
  let user = {};
  let erorrResponse = "";

  await axios
    .post("authentication/login/", {
      user: userData,
    })
    .then((response) => {
      user = response.data;
    })
    .catch((error) => {
      erorrResponse = error.response.data.error;
    });

  return { user, erorrResponse };
}

export async function logoutApi() {
  let data;

  await axios
    .post("http://localhost:8000/api/1.0v/authentication/logout/", {})
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.log(error));

  if (data === "User log out") {
    return true;
  }
  return false;
}
