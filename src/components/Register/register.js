import React, { Component } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import Axios from 'axios';
import i18n from '../../i18n';
import Chat from '../Chat/chat';

import './register.css';

export default class Register extends Component {
    state = {
        firstName:"",
        lastName:"",
        username:"",
        usernameLogin: "",
        email:"",
        tel:"",
        password:"",
        passwordLogin: "",
        DOB:"",
        hireDate: "",
        restaurantUnit: 0,
        allRestourants: [],

        redirect: false
    }

    handleInput =(event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    register =(e) => {
        e.preventDefault()
        console.log(this.state)
        Axios.post("https://localhost:44342/api/register", {
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Email: this.state.email,
            Username: this.state.username,
            DOB: this.state.DOB,
            HireDate: this.state.hireDate,
            Password: this.state.password,
            RestaurantUnit: this.state.restaurantUnit,
            PhoneNumber: "9292929229"
        })
        .then(resp => {
            alert("Registrovano")
        })
        .catch(err => {
            console.log(err)
        })

    }

    login =(e) => {
        e.preventDefault()
        Axios.post("https://localhost:44342/api/login", {
            Username: this.state.usernameLogin,
            Password: this.state.passwordLogin
        })
        .then((res)=> {
            console.log(res.data);
            localStorage.setItem("token", res.data.title);
            localStorage.setItem("nick", this.state.usernameLogin);
            
            window.location.href = "http://localhost:3000/privateChat"
            
            
            //history.push("/privateChat");

           
        })
        .catch(e => { console.log(e); })
    }

    componentDidMount =() => {
        let id = 1
        Axios.get("https://localhost:44342/restaurantUnit/restaurant/1")
        .then((res) => {
            console.log(res.data);
            this.setState({ allRestourants: res.data})
        })
        .then(resp => {
            console.log("GET restaurant units:  ");
            console.log(resp.data);
        })
        .catch((e) => {
            console.log(e)
        })
    }
    ru = (e) => {
        console.log(e.target.value)
        this.setState({restaurantUnit : parseInt(e.target.value)})
    }

    changeDIV = () => {

        var x = document.getElementById("signupDIV");
        var y = document.getElementById("loginDIV");
        if (x.style.display === "none") {
          x.style.display = "block";
          y.style.display = "none";
        } else {
          x.style.display = "none";
          y.style.display = "block";
        }
      }
    render() {
        if (!this.state.redirect) {
        return( 
            <div id="reg">
                {/*
                <h3 id="forms-heading">Ukoliko još nemate svoj račun, napravite ga što prije da bi dobili pogodnosti kakve drugi nemaju. A ko imate svoj račun logujte 
                        se i iskoristit svoje pogodnosti.
                </h3>*/}

                <div id="registration">
                    <div className="left" id="signupDIV">
                        <h3 className="register-heading">Sign Up</h3>
                        <form id="register" onSubmit={this.register}>
                            <input className="register-field" type="text" name="firstName" placeholder={i18n.t('Ime')} onChange={this.handleInput} value={this.state.firstName}/>
                            <br />
                            <input className="register-field" type="text" name="lastName" placeholder={i18n.t('Prezime')} onChange={this.handleInput} value={this.state.lastName}/>
                            <br />
                            <input className="register-field" type="text" name="username" placeholder="Username" onChange={this.handleInput} value={this.state.username}/>
                            <br />
                            <input className="register-field" type="password" name="password" placeholder="Password" onChange={this.handleInput} value={this.state.password}/>
                            <br />
                            <input className="register-field" type="text" name="email" placeholder="Email" onChange={this.handleInput} value={this.state.email}/>
                            <br />
                            <input className="register-field" type="text" name="tel" placeholder={i18n.t('Telefon')} onChange={this.handleInput} value={this.state.tel}/>
                            <br />
                            <span id="birth-date">
                                <label className="label" for="dob">{i18n.t('Datum rođenja')} </label><br/>
                                <input type="date" name="DOB" id="dob" onChange={this.handleInput} value={this.state.DOB}/>
                            </span><br />
                            <span id="hire-date">
                                <label className="label" for="hire">{i18n.t('Datum zaposlenja')} </label><br/>
                                <input type="date" name="hireDate" id="hire" onChange={this.handleInput} value={this.state.hireDate}/>
                            </span>
                            <br />
                            <span id="restaurant-unit">
                                <label for="res-unit">Restaurant Unit:</label>
                                <select id="res-unit" onChange={this.ru}>
                                    {this.state.allRestourants.map(p =>{
                                        return <option value = {p.unitId} key = {p.unitId}> {p.unitId} </option>
                                    })}
                                </select>
                            </span>
                            <br />
                            
                            <button className="register-btn">SIGN UP</button>
                            <button id="switch-to-login" onClick={this.changeDIV}>{i18n.t('Imate račun')}</button>
                        </form>
                    </div>
                    
                    <div className="right" id="loginDIV">
                        <h3 className="register-heading">Log In</h3>
                        <form id="login" onSubmit={this.login}>
                            <input className="register-field" type="text" name="usernameLogin" placeholder="Username" onChange={this.handleInput} value={this.state.usernameLogin}/>
                            <br />
                            <input className="register-field" type="password" name="passwordLogin" placeholder="Password" onChange={this.handleInput} value={this.state.passwordLogin}/>
                            <br />
                            
                            <button id="login-btn" className="register-btn">LOG IN</button>
                            <button id="switch-to-signup" onClick={this.changeDIV}>{i18n.t('Nemate račun')}</button>
                        </form>
                    </div>
                </div>

                {/*<div>
                    <h3>Pristigle narudžbe:</h3>
                    <ul>

                    </ul>
                </div>*/}
            </div>
            
            
        )} else {
            return (
                <Redirect to={{
                    pathname: "/privateChat",
                    search: `?nick=${this.state.username}`
                }} /> 
            )
        }
    }
};