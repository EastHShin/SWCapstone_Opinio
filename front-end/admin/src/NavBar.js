import React, {useState, useEffect, Component} from "react";
import {useNavigate} from 'react-router-dom'
import {Link} from 'react-router-dom';
import axios from "axios";
import './NavBar.css';
import './login.js'

async function logoutUser() {
    const email = localStorage.getItem('email')

    return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/logout', email, {
        headers: {"Content-Type": `application/json`}
    })
        .then(function (res) {
            if(res.status === 200) {
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

function logout() {
    if(localStorage.getItem('email')) {
        logoutUser()
        console.warn(localStorage)
    }
}

function NavBar() {
    return (
        <header className="top">
            <ul>
                <li className="inline"><Link onClick={logout} to="/administrator" className="inline">로그아웃</Link></li>
                <li className="inline"><Link to="/administrator/front" className="inline">메인화면</Link></li>
                <li className="inline"><Link to="/administrator/user" className="inline">유저관리</Link></li>
                <li className="inline"><Link to="/administrator/report" className="inline">신고관리</Link></li>
                <li className="inline"><Link to="/administrator/board" className="inline">게시글/댓글</Link></li>
            </ul>
        </header>
    )
}

export default NavBar;