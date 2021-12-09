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
            const {data} = await axios("https://jsonplaceholder.typicode.com/posts")

            setPosts({user: data})
        }
        fetchPostList()
    }, [setPosts])

    return (
        <div>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th class="table-light" width="140px">신고  No.</th>
                    <th class="table-primary">신고 내용</th>
                    <th class="table-warning" width="250px">어떻게 할까요?</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.user && posts.user.map((item) => (
                        <tr key={item.id} class="content_font">
                            <td class="table-light" valign="middle">{item.id}</td>
                            <td class="table-primary" valign="middle">{item.title}</td>
                            <td class="table-warning" valign="middle">
                                <Button variant="info" className="mar">처리완료</Button>
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