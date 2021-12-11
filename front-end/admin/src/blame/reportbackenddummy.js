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
                    setPosts({data: res.data.data})
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
                    posts.data && posts.data.map((item) => (
                        <tr key={item.id} className="content_font">
                            <td className="table-light" valign="middle">{item.report_id}</td>
                            <td className="table-primary" valign="middle">{item.reason}</td>
                            <td className="table-warning" valign="middle">
                                <Link to="/administrator/ad/delete">
                                    <Button variant="danger">처리완료</Button>
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