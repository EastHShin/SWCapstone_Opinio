import React, { useState, useEffect, Component } from "react";
import NavBar from "../NavBar.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './users.css';
import './userUpdate.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom'

import {Link} from "react-router-dom";

function UserUpdate() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [point, setPoint] = useState("")
    const [mPlant, setmPlant] = useState("")
    const [subcription, setSubscr] = useState("")
    const [posts, setPosts] = useState("")

    async function Update() {
        let sub
        if(subcription === "true" || subcription === "True") {
            sub = true
        } else {
            sub = false
        }
        let web = "/api/admin/user/" + localStorage.getItem("userId")

        if(name==="" || email==="" || point==="" || mPlant==="") {
            return toast.error('이름, 이메일, 포인트, 슬롯의 내용을 모두 채워야합니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2000})
        }
        return await axios.put(web, {
            headers: { "Content-Type": `application/json` },
            name: name,
            email: email,
            point: point,
            maxPlantNum: mPlant,
            subscription: sub
        })
            .then(function (res) {
                toast.warn('회원 정보가 수정되었습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2500})
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
            <NavBar class="top" />
            <h1>유저 업데이트</h1>
            <div className={"left"}>
                이름 <Form.Control className={"inline2"} type="text" placeholder={posts.name}
                                 onChange={(e) => setName(e.target.value)} style={{width: "450px"}}/><br/>
                이메일 <Form.Control className={"inline2"} type="text" placeholder={posts.email}
                                  onChange={(e) => setEmail(e.target.value)} style={{width: "450px"}}/><br/>
                포인트<Form.Control className={"inline2"} type="text" placeholder={posts.point}
                                 onChange={(e) => setPoint(e.target.value)} style={{width: "450px"}}/><br/>
                식물슬롯개수<Form.Control className={"inline2"} type="text" placeholder={posts.mPlant}
                                    onChange={(e) => setmPlant(e.target.value)} style={{width: "450px"}}/><br/>
                구독여부<Form.Control className={"inline2"} type="text" placeholder="구독을 원할시 True 또는 true 입력"
                                  onChange={(e) => setSubscr(e.target.value)} style={{width: "450px"}}/><br/>
                <Link to="/administrator/user">
                <Button variant="success" className="mar">뒤로 가기</Button>
                </Link>
                <Link to="/administrator/front">
                <Button variant="warning" onClick={Update}>수정</Button>
                </Link>
            </div>
        </div>
    );
}

export default UserUpdate;