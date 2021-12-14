import React, {useState, useEffect, Component} from "react";
import {useNavigate} from 'react-router-dom'
import {Link} from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './NavBar.css';
import './login.js'

function NavBar() {
    const nav = useNavigate()

    async function logoutUser() {
        const email = localStorage.getItem('email')
        let web = "/api/auth/logout"

        return await axios.post(web, email, {
            headers: {"Content-Type": `application/json`}
        })
            .then(function (res) {
                if(res.status === 200) {
                    toast.success('로그아웃 완료', {position: toast.POSITION.TOP_CENTER, autoClose:1500})
                    localStorage.clear()
                    nav("/administrator")
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    function logout() {
        if(localStorage.getItem('email')) {
            logoutUser()
        }
    }

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