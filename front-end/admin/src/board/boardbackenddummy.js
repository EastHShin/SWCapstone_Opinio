import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Board.css'

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
                    <th class="table-light" width="140px"></th>
                    <th class="table-primary">게시글 / 댓글</th>
                    <th className="table-light">내용</th>
                    <th class="table-warning" width="250px">수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.user && posts.user.map((item) => (
                        <tr key={item.id} class="content_font">
                            <td class="table-light" valign="middle">{item.id}</td>
                            <td class="table-primary" valign="middle">{item.title}</td>
                            <td className="table-light" valign="middle">{item.body}</td>
                            <td class="table-warning" valign="middle">
                                <Link to="/administrator/board/info">
                                   <Button variant="info" className="mar">Info</Button>
                                </Link>
                                <Link to="/administrator/board/update">
                                    <Button variant="warning" className="mar">Update</Button>
                                </Link>
                                <Link to="/administrator/board/delete">
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