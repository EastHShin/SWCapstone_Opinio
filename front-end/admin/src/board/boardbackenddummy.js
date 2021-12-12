import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserIcon from '@material-ui/icons/Person';
import './Board.css'

import {Link} from "react-router-dom";

const Table = () => {
    const [posts, setPosts] = useState({user: []})
    const [idx, setIdx] = useState("")

    const fetchPostList = async () => {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem('auth')
        let web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community"
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                console.warn(res.data)
                console.warn(res.data.data[1].boardId)
                console.warn(token)
                if(idx==="")setPosts({data: res.data.data})
                else {
                    let flag = 0
                    for(let i = 0; i < res.data.data.length; i++) {
                        if(res.data.data[i].boardId == idx) {
                            flag = 1
                            setPosts({data: [res.data.data[i]]})
                            console.warn(res.data.data[i])
                        }
                    }
                    if(flag === 0) setPosts({data: res.data.data})
                }
                console.warn(posts)
                console.warn(idx === "")
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
        localStorage.setItem("boardId", val)
        console.warn(localStorage.getItem("boardId"))
    }

    return (
        <div>
            <UserIcon fontSize="large"></UserIcon>
            <Form.Group class="inline" controlId="form.Email" style={{width: "370px"}}>
                <Form.Control type="email" placeholder="게시글 번호로 검색"
                              onChange={(e) => setIdx(e.target.value)}/>
            </Form.Group>
            <Link to="/administrator/board">
                <Button variant="success" onClick={fetchPostList}>검색</Button>
            </Link>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th className="table-primary" width="100px">게시글 번호</th>
                    <th className="table-light" width="100px">작성자 번호</th>
                    <th className="table-danger" width="100px">신고된 횟수</th>
                    <th className="table-primary" width="230px">제목</th>
                    <th className="table-light" width="330px">내용</th>
                    <th className="table-warning" width="250px">수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.data && posts.data.map((item) => (
                        <tr key={item.id} class="content_font">
                            <td className="table-primary" valign="middle">{item.boardId}</td>
                            <td className="table-light" valign="middle">{item.writerId}</td>
                            <td className="table-danger" valign="middle">
                                {item.countedReports > 0 &&
                                <div style={{color: "#FF2800", fontSize:"24px", fontWeight:"Bold"}}>
                                    {item.countedReports}
                                </div>}
                                {item.countedReports === 0 && item.countedReports}
                            </td>
                            <td className="table-primary" valign="middle">{item.title}</td>
                            <td className="table-light" valign="middle">{item.content}</td>
                            <td className="table-warning" valign="middle">
                                <Link to="/administrator/comment">
                                    <Button variant="btn btn-secondary"
                                            onClick={() => getId(item.boardId)}
                                            className="mar">댓글 조회</Button>
                                </Link>
                                <Link to="/administrator/board/delete">
                                    <Button variant="danger"
                                            onClick={() => getId(item.boardId)}>게시글 삭제</Button>
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

export default Table;