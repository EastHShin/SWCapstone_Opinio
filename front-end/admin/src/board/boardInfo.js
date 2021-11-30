import React, {useEffect, useState} from 'react';
import axios from 'axios';
import NavBar from "../NavBar.js";
import './Board.css';
import Button from 'react-bootstrap/Button';

import {Link} from "react-router-dom";

function BoardInfo(props) {
    const [posts, setPosts] = useState({user: []})

    useEffect(() => {
        const fetchPostList = async () => {
            const {data} = await axios("https://jsonplaceholder.typicode.com/posts")

            setPosts({user: data})
        }
        fetchPostList()
    }, [setPosts])

    return (
        <div className="front">
            <NavBar class="top"/>

            <h2 className="info">게시글 / 댓글 내용</h2>
            <br/>
            <Link to="/administrator/board">
                <Button className="mar" variant="success">확인</Button>
            </Link>
        </div>
    );
}

export default BoardInfo;