import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, Component } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginIcon from '@material-ui/icons/AlternateEmail';
import PasswordIcon from '@material-ui/icons/VpnKey';
import './login.css'
import axios from "axios";
import logo from "./logo.png";

let timer;
toast.configure()

const setLogoutTimer = (expirationTime, email) => dispatch => {
    timer = setTimeout(() => {
        dispatch(logoutUser(email));
    }, expirationTime);
};

async function logoutUser() {
    const email = localStorage.getItem('email')
    return await axios.post('/api/auth/logout', email, {
        headers: {"Content-Type": `application/json`}
    })
        .then(function (res) {
            if(res.status == 200) {
                localStorage.clear()
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const nav = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('status')) {
            nav("/administrator/front")
        }
    }, [])

    async function log() {
        let item = {email,password}
        let web = "/api/auth/login"
        return await axios.post(web, item, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                localStorage.clear()
                localStorage.setItem("email", email)
                localStorage.setItem("status", res.data.status)
                localStorage.setItem("auth", res.headers.authorization)
                axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
                toast.success('로그인 완료', {position: toast.POSITION.TOP_CENTER, autoClose:1500})
                nav("/administrator/front")
            })
            .catch(function (error) {
                toast.error('아이디나 비밀번호가 틀렸습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2500})
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