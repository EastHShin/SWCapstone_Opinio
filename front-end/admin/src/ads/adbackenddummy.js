import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './advertisement.css';

import {Link} from "react-router-dom";

const Table = () => {
    const [posts, setPosts] = useState({user: []})

    useEffect(() => {
        const fetchPostList = async () => {
            const response = await axios("https://jsonplaceholder.typicode.com/posts")

            console.log(response)
            setPosts({user: response})
        }
        fetchPostList()
    }, [setPosts])

    return (
        <div>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th className="table-light" width="140px">광고번호</th>
                    <th className="table-primary">광고</th>
                    <th className="table-warning" width="250px">수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.user && posts.user.map((item) => (
                        <tr key={item.id} class="content_font">
                            <td className="table-light" valign="middle">{item.id}</td>
                            <td className="table-primary" valign="middle">{item.title}</td>
                            <td className="table-warning" valign="middle">
                                <Button className="mar" variant="info">Info</Button>
                                <Link to="/administrator/ad/update">
                                    <Button variant="warning" className="mar">Update</Button>
                                </Link>
                                <Link to="/administrator/ad/delete">
                                <Button variant="danger">Delete</Button>
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