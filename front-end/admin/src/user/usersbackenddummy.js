import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UserIcon from '@material-ui/icons/Person';
import './users.css';

import {Link} from "react-router-dom";

const Table = () => {
    const [posts, setPosts] = useState({user: []})
    const [idx, setIdx] = useState("")
    const nav = useNavigate()

    const fetchPostList = async () => {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem("auth")
        let web = "/api/admin/user/"
        const response = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                if(idx==="")setPosts({data: res.data.data})
                else {
                    let flag = 0
                    for(let i = 0; i < res.data.data.length; i++) {
                        if(res.data.data[i].id == idx) {
                            flag = 1
                            setPosts({data: [res.data.data[i]]})
                        }
                    }
                    if(flag === 0) {
                        setPosts({data: res.data.data})
                        toast.warn('회원 번호가 존재하지 않습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2000})
                    }
                }
            })
            .catch(function (error) {
                if(error.response.status == 403) {
                    localStorage.clear()
                    nav("/administrator")
                }
            })
    }

    useEffect(() => {
        fetchPostList()
    }, [setPosts])

    function getId(val) {
        localStorage.setItem("userId", val)
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