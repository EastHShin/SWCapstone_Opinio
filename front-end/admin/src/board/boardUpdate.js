import React from "react";
import NavBar from "../NavBar.js";
import './Board.css';
import Button from 'react-bootstrap/Button';

import {Link} from "react-router-dom";

function BoardUpdate() {
    return (
        <div className="front">
            <NavBar class="top"/>
            <h2 className="notice">해당 게시글 / 댓글을 다음과 같이 수정합니다.</h2>
            <br/>
            <Link to="/administrator/board">
                <Button className="mar" variant="success">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/board">
                <Button variant="warning">수정</Button>
            </Link>
        </div>
    );
}

export default BoardUpdate;