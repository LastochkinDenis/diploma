import "./register.css";
import { regsiterApi } from "../../api/authenticationApi.js";
import PasswordInput from "./passwordInput/passwordInput.jsx";

import { Component } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorEmail: "",
      errorFirstName: "",
      errorLastName: "",
      errorPassword: "",
      isCrate: false,
    };

    this.clearFormData();
  }

  clearFormData = () => {
    this.state.fornData = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      password2: "",
    };
  };

  resetErorMasege = () => {
    this.setState((state) => ({
      errorEmail: "",
      errorFirstName: "",
      errorLastName: "",
      errorPassword: "",
    }));
  };

  showErrorMessage = (error) => {
    if (error == "user with this email already exists.")
      this.setState((state) => ({
        errorEmail: "Пользователь с такой почтой уже существует",
      }));
  };

  validate = () => {
    this.resetErorMasege();
    if (!this.state.fornData.email) {
      this.setState((state) => ({
        errorEmail: "Адрес электронной почты не указан",
      }));
      return false;
    }
    if (!/\w+@\w+.\w+/.test(this.state.fornData.email)) {
      this.setState((state) => ({ errorEmail: "Не верно указана почта" }));
      return false;
    }

    if (!this.state.fornData.firstName) {
      this.setState((state) => ({ errorFirstName: "Имя не указана" }));
      return false;
    }

    if (!this.state.fornData.lastName) {
      this.setState((state) => ({ errorLastName: "Фамилия не указана" }));
      return false;
    }

    if (!this.state.fornData.password) {
      this.setState((state) => ({ errorPassword: "Пароль не указан" }));
      return false;
    }

    if (this.state.fornData.password !== this.state.fornData.password2) {
      this.setState((state) => ({ errorPassword: "Пароли не совподают" }));
      return false;
    }
    return true;
  };

  handleFormSubmit = async (evt) => {
    evt.preventDefault();
    if (!this.validate()) {
      return;
    }

    let { isCrate, erorrResponse } = await regsiterApi(this.state.fornData);

    if (isCrate) {
      this.setState((state) => ({ isCrate: true }));
    } else {
      this.showErrorMessage(erorrResponse);
    }
  };

  handleEmailChange = (evt) => {
    this.state.fornData.email = evt.target.value;
  };

  handleFirstNameChange = (evt) => {
    this.state.fornData.firstName = evt.target.value;
  };

  handleLastNameChange = (evt) => {
    this.state.fornData.lastName = evt.target.value;
  };

  handlepasswordChange = (evt) => {
    this.state.fornData.password = evt.target.value;
  };

  handlePassword2Change = (evt) => {
    this.state.fornData.password2 = evt.target.value;
  };

  render() {
    if (this.state.isCrate) return <Navigate to="/login" />;
    return (
      <div className="authentivations">
        <div className="authentivations__wraper">
          <h1>Регистрация</h1>
          <hr />
          <form
            onSubmit={this.handleFormSubmit}
            className="authentivations__form"
          >
            <div className="authentivations__form-item">
              <label>
                <p>Почта:</p>
                <input
                  type="email"
                  placeholder="Почта"
                  onChange={this.handleEmailChange}
                />
              </label>
              {this.state.errorEmail && (
                <p className="error-mesage">{this.state.errorEmail}</p>
              )}
            </div>
            <div className="authentivations__form-item">
              <label>
                <p>Имя:</p>
                <input
                  type="text"
                  placeholder="Имя"
                  onChange={this.handleFirstNameChange}
                />
              </label>
              {this.state.errorFirstName && (
                <p className="error-mesage">{this.state.errorFirstName}</p>
              )}
            </div>
            <div className="authentivations__form-item">
              <label>
                <p>Фамилия:</p>
                <input
                  type="text"
                  placeholder="Фамилия"
                  onChange={this.handleLastNameChange}
                />
              </label>
              {this.state.errorLastName && (
                <p className="error-mesage">{this.state.errorLastName}</p>
              )}
            </div>
            <div className="authentivations__form-item">
              <label>
                <p>Пароль:</p>
                <PasswordInput
                  handlePasswordChange={this.handlepasswordChange}
                />
              </label>
              {this.state.errorPassword && (
                <p className="error-mesage">{this.state.errorPassword}</p>
              )}
            </div>
            <div className="authentivations__form-item">
              <label>
                <p>Пароль:</p>
                <PasswordInput
                  handlePasswordChange={this.handlePassword2Change}
                />
              </label>
              <p className="error-mesage"></p>
            </div>
            <button className="submitButton">Зарегистрироваться</button>
          </form>
        </div>
      </div>
    );
  }
}
