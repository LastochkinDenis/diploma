import "./CourseCreateStyle.css";
import "../Autentications/register.css";

import { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { courseCreate } from "../../api/courseDashboard";
import { useSelector } from "react-redux";

function CourseCreate(props) {
  let user = useSelector((state) => state.user).user;

  return <CourseCreateUnconected user={user} />;
}

class CourseCreateUnconected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorName: "",
      errorDescripton: "",
      isCreate: false,
    };

    this.clearFormData();
  }

  clearFormData = () => {
    this.state.formData = {
      name: "",
      description: "_",
    };
  };

  validate = () => {
    this.resetError();

    if (!this.state.formData.name) {
      this.setState((state) => ({ errorName: "Название курса не указано" }));
      return false;
    }

    if (!this.state.formData.name) {
      this.setState((state) => ({ errorName: "Название курса не указано" }));
      return false;
    }

    return true;
  };

  resetError = () => {
    this.setState((state) => ({
      errorName: "",
      errorDescripton: "",
    }));
  };

  handeleNameChange = (evt) => {
    this.state.formData.name = evt.target.value;
  };

  handeleDescriptionChange = (evt) => {
    this.state.formData.description = evt.target.value;
  };

  handleFormSubmit = async (evt) => {
    evt.preventDefault();

    if (!this.validate()) {
      return;
    }

    let { isCreate, errors } = await courseCreate(this.state.formData);

    if (isCreate) {
      this.setState((state) => ({ isCreate: true }));
    }
  };

  render() {
    if (!this.props.user.email) {
      return <Navigate to="/login" />;
    }
    if (this.state.isCreate) return <Navigate to="/coursehome" />;
    return (
      <div className="form-container">
        <div className="form__wraper">
          <h1>Создание курса</h1>
          <hr />
          <form onSubmit={this.handleFormSubmit}>
            <div className="form-item">
              <label>
                <p>Название курса:</p>
                <input
                  onChange={this.handeleNameChange}
                  type="text"
                  placeholder="Название курса"
                />
              </label>
              {this.state.errorName && (
                <p className="error-mesage">{this.state.errorName}</p>
              )}
            </div>
            <div className="form-item">
              <label>
                <p>Описание курса:</p>
                <textarea
                  onChange={this.handeleDescriptionChange}
                  placeholder="Описание курса"
                  rows={6}
                />
              </label>
              {this.state.errorDescripton && (
                <p className="error-mesage">{this.state.errorDescripton}</p>
              )}
            </div>
            <input
              type="submit"
              content="Создать курс"
              className="submitButton"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default CourseCreate;
