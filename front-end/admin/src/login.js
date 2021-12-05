import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, {Component} from "react";
import LoginIcon from '@material-ui/icons/AlternateEmail';
import PasswordIcon from '@material-ui/icons/VpnKey';
import './login.css'

import {Link} from "react-router-dom";
import logo from "./logo.png";

class Login extends Component {
    render() {
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
                        <div class="center">
                            <LoginIcon color="secondary" fontSize="large"></LoginIcon>
                            <Form.Group class="inline" controlId="form.Email" style={{width: "370px"}}>
                                <Form.Control type="email" placeholder="이메일"/>
                            </Form.Group>
                        </div>
                        <div class="center">
                            <PasswordIcon color="secondary" fontSize="large"></PasswordIcon>
                            <Form.Group class="inline" controlId="form.Password" style={{width: "370px"}}>
                                <Form.Control type="password" placeholder="비밀번호" class="wid"/>
                            </Form.Group>
                        </div>
                        <div>
                            <Link to="/administrator/front">
                                <Button variant="success">Login</Button>
                            </Link>
                        </div>
                    </Form>
                </Container>
            </header>
        );
    }
}

export default Login;