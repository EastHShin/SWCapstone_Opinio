import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserIcon from '@material-ui/icons/Person';
import './users.css';

import {Link} from "react-router-dom";

const Table = () => {
    const [posts, setPosts] = useState({user: []})
    const [idx, setIdx] = useState("")

    const fetchPostList = async () => {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem("auth")
        let web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/user/"
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                console.warn(res.data)
                console.warn(res.data.data[1].id)
                console.warn(token)
                if(idx==="")setPosts({data: res.data.data})
                else {
                    let flag = 0
                    for(let i = 0; i < res.data.data.length; i++) {
                        if(res.data.data[i].id == idx) {
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
        localStorage.setItem("userId", val)
        console.warn(localStorage.getItem("userId"))
    }

    return (
        <div>
            <UserIcon fontSize="large"></UserIcon>
            <Form.Group class="inline" controlId="form.Email" style={{width: "370px"}}>
                <Form.Control type="email" placeholder="아이디 번호로 검색"
                              onChange={(e) => setIdx(e.target.value)}/>
            </Form.Group>
            <Link to="/administrator/user">
                <Button variant="success" onClick={fetchPostList}>검색</Button>
            </Link>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th class="table-light" width="140px">아이디 번호</th>
                    <th class="table-primary">닉네임</th>
                    <th class="table-light">이메일</th>
                    <th class="table-warning" width="250px">수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.data && posts.data.map((item) => (
                        <tr key={item.id} class="content_font">
                            <td class="table-light" valign="middle">{item.id}</td>
                            <td class="table-primary" valign="middle">{item.user_name}</td>
                            <td class="table-light" valign="middle">{item.user_email}</td>
                            <td class="table-warning" valign="middle">
                                <Link to="/administrator/user/info">
                                    <Button onClick={() => getId(item.id)} variant="info" className="mar">정보</Button>
                                </Link>
                                <Link to="/administrator/user/update">
                                    <Button onClick={() => getId(item.id)} variant="warning"
                                            className="mar">수정</Button>
                                </Link>
                                <Link to="/administrator/user/delete">
                                <Button onClick={() => getId(item.id)} variant="danger">삭제</Button>
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