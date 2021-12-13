import React, {useState, useEffect, Component} from "react";
import axios from 'axios';
import NavBar from "../NavBar.js";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Board.css';

import {Link} from "react-router-dom";

function BoardDelete() {
    const [posts, setPosts] = useState("")

    async function del() {
        let web = "/api/admin/community/" + localStorage.getItem("boardId")

        return await axios.delete(web, {
            headers: {"Content-Type": `application/json`}
        })
            .then(function (res) {
                toast.error('게시글이 삭제되었습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2500})
            })
    }

    async function getValue() {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem('auth')
        let web = "/api/admin/community/" + localStorage.getItem("boardId")
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                setPosts({
                    name: [res.data.data.writerName], id: [res.data.data.id],
                    writerId: [res.data.data.writerId], content: [res.data.data.content]
                })
            })
    }

    useEffect(() => {
        getValue()
    }, [])

    return (
        <div className="front">
            <NavBar className="top"/>
            <h2 className="warn">해당 게시글과 댓글을 정말 삭제하시겠습니까?</h2>
            <h3 className="infor">
                작성자 닉네임: {posts.name}
                <br/>
                작성자 ID번호: {posts.writerId}
                <br/>
                게시글 번호: {posts.id}
                <br/>
                게시글 내용: {posts.content}
                <br/>
            </h3>
            <Link to="/administrator/board">
                <Button className="mar" variant="success">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/front">
                <Button variant="danger" onClick={del}>삭제 합니다</Button>
            </Link>
        </div>
    );
}

export default BoardDelete;