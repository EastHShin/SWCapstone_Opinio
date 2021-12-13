import React, {useEffect, useState} from 'react';
import axios from 'axios';
import NavBar from "../NavBar.js";
import Button from 'react-bootstrap/Button';
import './users.css';
import './userUpdate.css';

import {Link} from "react-router-dom";

function UserInfo() {
    const [posts, setPosts] = useState({data: []})
    const fetchPostList = async () => {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem('auth')
        let web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/user/" + localStorage.getItem("userId")
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                setPosts({data: res.data.data})
            })
            .catch(function (error) {
                if(error.status == 403) localStorage.clear()
            })
    }
    function checkSub() {
    }

    useEffect(() => {
        fetchPostList()
            .then(checkSub())
    }, [setPosts])

    return (
        <div className="front">
            <NavBar class="top"/>
            <h1>유저 세부정보</h1>
            <div className="info" style={{color: "#FFFFFF"}}>
                유저 번호:&nbsp;
                <span>{posts.data.id}</span>
                <br/>
                유저 이름:&nbsp;
                <span>{posts.data.name}</span>
                <br/>
                이메일:&nbsp;
                <span>{posts.data.email}</span>
                <br/>
                키우는 식물의 수:&nbsp;
                <span>{posts.data.plantNum}</span>
                <br/>
                식물의 슬롯 개수:&nbsp;
                <span>{posts.data.maxPlantNum}</span>
                <br/>
                식물 질병 구독 여부:&nbsp;
                <span>{posts.data.subcription===true && <span style={{color: "#1134A6"}}>YES</span>}</span>
                <span>{posts.data.subcription===false && <span style={{color: "#FF2800"}}>NO</span>}</span>
                <br/>
                포인트:&nbsp;
                <span>{posts.data.point}</span>
                <br/>
                <Link to="/administrator/user">
                    <Button variant="danger">뒤로 가기</Button>
                </Link>
            </div>
        </div>
    );
}

export default UserInfo;