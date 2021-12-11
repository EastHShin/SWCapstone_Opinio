import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, Component } from "react";
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@material-ui/icons/AlternateEmail';
import PasswordIcon from '@material-ui/icons/VpnKey';
import './login.css'
import axios from "axios";
import {Link} from "react-router-dom";
import logo from "./logo.png";

let timer;

const setLogoutTimer = (expirationTime, email) => dispatch => {
    timer = setTimeout(() => {
        dispatch(logoutUser(email));
    }, expirationTime);
};

async function logoutUser() {
    const email = localStorage.getItem('email')
    return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/logout', email, {
        headers: {"Content-Type": `application/json`}
    })
        .then(function (res) {
            if(res.status == 200) {
                console.warn(res)
                console.warn(localStorage)
                localStorage.clear()

            }
        })
        .catch(function (err) {
            console.log(err)
        })
    console.warn(email)
}

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const nav = useNavigate()
    useEffect(() => {
        if(localStorage.getItem('status')) {
            console.warn('----------------------------------------------')
            console.warn(localStorage.getItem('status'))
            nav("/administrator/front")
        }
    }, [])

    async function log() {
        console.warn(email,password)
        let item = {email,password}
        return await axios.post("http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/login", item, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                console.warn(res.headers)
                localStorage.clear()
                localStorage.setItem("email", email)
                localStorage.setItem("status", res.data.status)
                localStorage.setItem("auth", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0SWQiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTYzOTIwNTkxMCwiZXhwIjoxNjM5MjA3NzEwfQ.9oHRIesyZnUmBAKoVyKOyFCEz09x20SVw60JDX_rxMM")
                console.warn(localStorage.getItem("auth"))
                console.warn(localStorage.getItem('status'))
                nav("/administrator/front")
            })
            .catch(function (error) {
                console.warn(error)
                nav("/administrator")
            })
    }

    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <div className="inline">
                <span className="red">관리자 </span>
                <span>화면 로그인</span>
            </div>
            <a
                className="App-link"
                href="https://github.com/EastHShin/SWCapstone_Opinio"
                target="_blank"
                rel="noopener noreferrer"
            >
                Source Code
            </a>
            <Container>
                <Form>
                    <div className="center">
                        <LoginIcon color="secondary" fontSize="large"></LoginIcon>
                        <Form.Group className="inline" controlId="form.Email" style={{width: "370px"}}>
                            <Form.Control type="email" placeholder="이메일"
                                          onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>
                    </div>
                    <div className="center">
                        <PasswordIcon color="secondary" fontSize="large"></PasswordIcon>
                        <Form.Group className="inline" controlId="form.Password" style={{width: "370px"}}>
                            <Form.Control className="wid" type="password" placeholder="비밀번호"
                                          onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                    </div>
                    <div>
                            <Button variant="success" onClick={log}>Login</Button>
                    </div>
                </Form>
            </Container>
        </header>
    );
}

export default Login;