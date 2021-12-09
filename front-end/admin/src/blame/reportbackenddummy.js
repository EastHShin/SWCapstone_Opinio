import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './report.css';

import {Link} from "react-router-dom";

const Table = () => {
    const [posts, setPosts] = useState({user: []})

    useEffect(() => {
        const fetchPostList = async () => {
            const {data} = await axios("http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/admin/community/report/all", {
                headers: {
                    "X-AUTH-TOKEN": 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJza3lzYXZlcjAwQGFqb3UuYWMua3IiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNjM5MDQzNzIyLCJleHAiOjE2MzkwNDU1MjJ9.rkRouaIxRfHTfHlJYZzEw8XIUOqN9AD2t6qALbvhP4o'
                }
            });
            console.log(data)
            setPosts({user: data})
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