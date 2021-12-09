import React from "react";
import NavBar from "../NavBar.js";
import './Board.css';
import Button from 'react-bootstrap/Button';

import {Link} from "react-router-dom";

function AdvertisementUpdate() {
    return (
        <div className="front">
            <NavBar class="top"/>
            <h2 className="warn">해당 게시글 / 댓글을 정말 삭제하시겠습니까?</h2>
            <br/>
            <Link to="/administrator/board">
                <Button className="mar" variant="success">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/board">
                <Button variant="danger">삭제 합니다</Button>
            </Link>
        </div>
    );
}

export default AdvertisementUpdate;