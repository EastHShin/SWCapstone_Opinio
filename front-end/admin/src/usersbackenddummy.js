import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './users.css';

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
                <tr>
                    <th class="table-light" width="140px">아이디 번호</th>
                    <th class="table-primary">이메일</th>
                    <th class="table-light">내용</th>
                    <th class="table-warning" width="250px">수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.user && posts.user.map((item) => (
                        <tr key={item.id}>
                            <td class="table-light" valign="middle">{item.id}</td>
                            <td class="table-primary" valign="middle">{item.title}</td>
                            <td class="table-light" valign="middle">{item.body}</td>
                            <td class="table-warning" valign="middle">
                                <Button variant="info" className="mar">Info</Button>
                                <Button variant="warning" className="mar">Update</Button>
                                <Button variant="danger">Delete</Button>
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