import React, { useState, useEffect, Component } from "react";
import axios from 'axios';
import NavBar from "../NavBar.js";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './users.css';
import './userUpdate.css';

import {Link} from "react-router-dom";

function UserDelete() {
    const [posts, setPosts] = useState("")

    async function del() {
        let web = "/api/admin/user/" + localStorage.getItem("userId")

        return await axios.delete(web, {
            headers: {"Content-Type": `application/json`},
            id: localStorage.getItem("userId")
        })
            .then(function (res) {
                toast.error('회원 정보가 삭제되었습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2500})
            })
    }

    async function getValue() {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem('auth')
        let web = "/api/admin/user/" + localStorage.getItem("userId")
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                setPosts({name: [res.data.data.name], email:[res.data.data.email], point:[res.data.data.point],
                    mPlant:[res.data.data.maxPlantNum], subscribe:[res.data.data.subcription]})
            })
    }

    useEffect(() => {
        getValue()
    }, [])

    return (
        <div className="front">
            <NavBar className="top"/>
            <h2 className="warn">해당 유저를 정말 삭제하시겠습니까?</h2>
            <h3>
            닉네임: {posts.name}
            <br/>
            이메일: {posts.email}
            </h3>
            <Link to="/administrator/user">
                <Button className="mar" variant="success">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/front">
                <Button variant="danger" onClick={del}>삭제 합니다</Button>
            </Link>
        </div>
    )
}

export default UserDelete;