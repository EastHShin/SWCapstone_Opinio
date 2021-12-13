import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import NavBar from "../NavBar.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from './boardbackenddummy.js'
import "./Board.css"
import UserIcon from '@material-ui/icons/Person';

import {Link} from "react-router-dom";

function Comment() {
    const [posts, setPosts] = useState("")
    const [idx, setIdx] = useState("")

    const fetchPostList = async () => {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem('auth')
        let web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community/" + localStorage.getItem("boardId")
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                console.warn(res.data.data.comments)
                setPosts({comments: res.data.data.comments, writerId: [res.data.data.writerId],
                writerName: [res.data.data.writerName], id: [res.data.data.id]})
                console.warn(posts.comments)
            })
            .catch(function (error) {
                console.warn(error)
                console.warn(token)
            })
    }

    useEffect(() => {
        fetchPostList()
    }, [setPosts])

    function getId(val) {
        localStorage.setItem("commentId", val)
        console.warn(localStorage.getItem("commentId"))
    }

    return (
        <div className="front">
            <NavBar className="top" />
            <h1>댓글</h1>
            <div className="left" style={{fontSize:"20px"}}>
                게시글 번호: {posts.id}
                <br/>
                작성자 번호: {posts.writerId}
                <br/>
                작성자 닉네임: {posts.writerName}
            </div>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th class="table-info" width="140px">댓글 번호</th>
                    <th className="table-primary" width="140px">작성자 번호</th>
                    <th className="table-light" width="200px">작성자</th>
                    <th class="table-light">댓글 내용</th>
                    <th class="table-warning" width="220px">삭제</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.comments && posts.comments.map((item) => (
                        <tr key={item} class="content_font">
                            <td className="table-info" valign="middle">{item.comment_id}</td>
                            <td className="table-primary" valign="middle">{item.writer_id}</td>
                            <td className="table-light" valign="middle">{item.writer}</td>
                            <td className="table-light" valign="middle">{item.content}</td>
                            <td className="table-warning" valign="middle">
                                <Link to="/administrator/comment/delete">
                                    <Button variant="danger"
                                            onClick={() => getId(item.comment_id)}>게시글 삭제</Button>
                                </Link>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </ReactBootStrap.Table>
        </div>
    );
}

export default Comment;