import { compose } from "@reduxjs/toolkit";
import axios from "axios";

export async function getUserInfo() {
  let user;

  await axios
    .get("authentication/userinfo/")
    .then((response) => {
      user = response.data.user;
    })
    .catch((error) => console.log(error));

  return user;
}

export async function getUserCertificate() {
  let certificate = [];

  await axios
    .get("user/certificate/")
    .then((response) => {
      certificate = response.data;
    })
    .catch((error) => console.log(error));

    return certificate;
}
