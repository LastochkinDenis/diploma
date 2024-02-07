import './register.css';
import { loginApi } from '../../api/authenticationApi';
import { putUserData } from '../../store/userSlice';

import { Component } from "react";
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

class AutenticationsUnconnected extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errorEmail: '',
            errorPassword: '',
            isLogin: false
        };

        this.clearFormData();
    }

    clearFormData = () => {
        this.state.fornData = {
            email: '',
            password: '',
        }
    }

    resetErorMasege = () => {
        this.setState((state) => ({
            errorEmail: '',
            errorPassword: '',
        }))
    }

    validate = () => {
        this.resetErorMasege();
        if(!this.state.fornData.email){
            this.setState((state) => ({
                'errorEmail': 'Адрес электронной почты не указан'
            }));
            return false;
        }
        if(!/\w+@\w+.\w+/.test(this.state.fornData.email)){
            this.setState((state) => ({errorEmail: 'Не верно указана почта'}));
            return false;
        }

        if(!this.state.fornData.password) {
            this.setState((state) => ({'errorPassword': 'Пароль не указан'}));
            return false;
        }
        
        return true;
    }

    showErrorMessage = (error) => {
        if(error === 'User do not found.') {
            this.setState((state) => ({errorEmail: 'Неверный пароль или пользователь не найден'}))
        }
    }

    handleFormSubmit = async (evt) => {
        evt.preventDefault();

        if(!this.validate()) 
            return;

        this.state.fornData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        let {user, erorrResponse} = await loginApi(this.state.fornData);
        
        if(Object.keys(user).length > 0){
            this.props.putUserData(user);
            this.setState((state) => ({isLogin: true}));
        }
        else 
            this.showErrorMessage(erorrResponse);
    }

    handleEmailChange = (evt) => {
        this.state.fornData.email = evt.target.value;
    }

    handlePasswordChange = (evt) => {
        this.state.fornData.password = evt.target.value;
    }

    render() {
        if(this.state.isLogin)
            return <Navigate  to='/' />
        return (
            <div className='authentivations__wraper'>
                <h1>Авторизация</h1>
                <hr />
                <form onSubmit={this.handleFormSubmit}>
                    <div className="authentivations__form-item">
                        <label>
                            <p>Почта:</p>
                            <input type="email" placeholder="Почта" onChange={this.handleEmailChange}/>
                        </label>
                        {this.state.errorEmail && <p className='error-mesage'>{this.state.errorEmail}</p>}
                    </div>
                    <div className="authentivations__form-item">
                        <label>
                            <p>Пароль:</p>
                            <input type="text" placeholder="Пароль" onChange={this.handlePasswordChange}/>
                        </label>
                        {this.state.errorPassword && <p className='error-mesage'>{this.state.errorPassword}</p>}
                    </div>
                    <button className='submitButton'>Войти</button>
                </form>
            </div>
        )
    }
}

const actionBroker = (dispath) => ({
    putUserData: (key) => {dispath({type: 'user/putUserData', payload: key})}
})

const connectAutentications = connect(undefined, actionBroker);
const Autentications = connectAutentications(AutenticationsUnconnected);
export default Autentications;