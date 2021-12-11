import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './report.css';

import {Link} from "react-router-dom";

function Table() {
    const [posts, setPosts] = useState({user: []})

    useEffect(() => {
        const fetchPostList = async () => {
            axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
            const token = localStorage.getItem('auth')
            const response = await axios.get("http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community/report/all", {
                headers: {
                    "Content-Type": `application/json`
                }
            })
                .then(function (res) {
                    console.warn(res.data)
                    console.warn(token)
                    setPosts({user: res.data})
                    console.warn(posts)
                })
                .catch(function (error) {
                    console.warn(error)
                    console.warn(token)
                })
        }
        fetchPostList()
    }, [setPosts])

    return (
        <div>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th className="table-light" width="140px">신고  No.</th>
                    <th className="table-primary">신고 내용</th>
                    <th className="table-warning" width="250px">어떻게 할까요?</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.user && posts.user.map((item) => (
                        <tr key={item.id} className="content_font">
                            <td className="table-light" valign="middle">{item.id}</td>
                            <td className="table-primary" valign="middle">{item.title}</td>
                            <td className="table-warning" valign="middle">
                                <Button className="mar" variant="info">처리완료</Button>
                                <Link to="/administrator/ad/delete">
                                    <Button variant="danger">무시하기</Button>
                                </Link>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </ReactBootStrap.Table>
            <h2>Tables</h2>
        </div>
    );
}

export default Table;