import React, {useState, useEffect, Component} from "react";
import axios from 'axios';
import NavBar from "../NavBar.js";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Board.css';

import {Link} from "react-router-dom";

function CommentDelete() {
    const [posts, setPosts] = useState("")

    async function del() {
        let web = "/api/admin/community/comments/" + localStorage.getItem("commentId")

        return await axios.delete(web, {
            headers: {"Content-Type": `application/json`}
        })
            .then(function (res) {
                toast.error('댓글이 삭제되었습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2500})
            })
    }

    return (
        <div className="front">
            <NavBar className="top"/>
            <h2 className="warn">해당 댓글을 정말 삭제하시겠습니까?</h2>
            {/*<h3 className="infor">
                작성자 닉네임: {posts.name}
                <br/>
                작성자 ID번호: {posts.writerId}
                <br/>
                게시글 번호: {posts.id}
                <br/>
                게시글 내용: {posts.content}
                <br/>
            </h3>*/}
            <Link to="/administrator/comment">
                <Button className="mar" variant="success">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/board">
                <Button variant="danger" onClick={del}>삭제 합니다</Button>
            </Link>
        </div>
    )
}

export default CommentDelete;