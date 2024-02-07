import { compose } from "@reduxjs/toolkit";
import axios from "axios";


export async function getUserInfo() {
    
    let user;

    await axios.get('http://localhost:8000/api/1.0v/authentication/userInfo/')
    .then(response => {
        user = response.data.user
    })
    .catch(error => console.log(error));

    return user
}